import { GenericContainer } from "testcontainers";
import fetch from "node-fetch";
import { spawnSync } from "child_process";
import { JSDOM, VirtualConsole } from "jsdom";

const DOCKER_START_TIMEOUT_MS = 1 * 60 * 1000;

describe("test documentserver", function () {
    let container;
    let httpPort;

    beforeAll(async () => {
        spawnSync("docker", ["load", "-i", "../docker/load/tarball.tar"], {
            stdio: "inherit",
        });
        container = await new GenericContainer("cp-documentserver:latest")
            .withExposedPorts(80)
            .start();

        httpPort = container.getFirstMappedPort();

        const { output, exitCode } = await container.exec([
            "supervisorctl",
            "start",
            "ds:example",
        ]);
        expect(exitCode).toBe(0);
    }, DOCKER_START_TIMEOUT_MS);

    afterAll(async () => {
        await container.stop();
    });

    it("welcome page", async function () {
        const page = await loadPage("/welcome/");

        const btn = page.window.document.querySelector(".button");
        expect(btn.firstChild.nodeValue).toBe("GO TO TEST EXAMPLE");
    });

    it("example page", async function () {
        const examplePage = await loadPage("/example/");

        const link = examplePage.window.document.querySelector("a.word");
        expect(link.firstChild.nodeValue).toBe("Document");
    });

    it("new document", async function () {
        const examplePage = await loadPage("/example/");

        const link = examplePage.window.document.querySelector("a.word");
        expect(link.firstChild.nodeValue).toBe("Document");

        const documentPage = await loadPage(
            link.href,
            examplePage.window.location.href,
        );

        sleep(1000);

        expect(documentPage.log.map((x) => x.args)).toContain([
            "Document editor ready",
        ]);
    });

    async function loadPage(path, baseUrl = "http://localhost") {
        const url = new URL(path, baseUrl);
        url.port = httpPort;
        const virtualConsole = new VirtualConsole();
        virtualConsole.sendTo(console);

        const log = [];
        const consoleMethods = [];
        for (const method of Object.keys(console)) {
            if (typeof console[method] === "function") {
                consoleMethods.push(method);
            }
        }
        consoleMethods.push("jsdomError");
        for (const method of consoleMethods) {
            console.log("XXX register", method);
            virtualConsole.on(method, (...args) => {
                console.log("XXX", ...args);
                log.push({ method, args });
            });
        }

        console.log("XXX eventNames", virtualConsole.eventNames());
        virtualConsole.emit('log', 'log test', 1, 2, 3);

        const dom = await JSDOM.fromURL(url, {
            runScripts: "dangerously",
            pretendToBeVisual: true,
            resources: "usable",
            virtualConsole,
        });

        return { log, dom, window: dom.window };
    }
});

function sleep(ms) {
    return new Promise((resolve) => {
        setTimeout(() => resolve());
    });
}
