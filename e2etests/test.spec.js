import { GenericContainer } from "testcontainers";
import fetch from 'node-fetch';
import { spawnSync } from 'child_process';
import { JSDOM } from 'jsdom';

const DOCKER_START_TIMEOUT_MS = 1 * 60 * 1000;

describe("test documentserver", function () {
    let container;
    let httpPort;

    beforeAll(async () => {
        spawnSync('docker', ['load', '-i', '../docker/load/tarball.tar'], { stdio: 'inherit' });
        container = await new GenericContainer("cp-documentserver:latest")
            .withExposedPorts(80)
            .start();

        httpPort = container.getFirstMappedPort();

        const { output, exitCode } = await container.exec(["supervisorctl", "start", "ds:example"]);
        expect(exitCode).toBe(0);
    }, DOCKER_START_TIMEOUT_MS);

    afterAll(async () => {
        await container.stop();
    });

    it("welcome page", async function () {
        const url = new URL("http://localhost/welcome/");
        url.port = httpPort;
        const dom = await JSDOM.fromURL(url, {
            runScripts: "dangerously",
            pretendToBeVisual: true,
            resources: "usable",
        });

        const btn = dom.window.document.querySelector('.button');
        expect(btn.firstChild.nodeValue).toBe('GO TO TEST EXAMPLE');
    });

    it("example page", async function () {
        const url = new URL("http://localhost/example/");
        url.port = httpPort;
        const dom = await JSDOM.fromURL(url, {
            runScripts: "dangerously",
            pretendToBeVisual: true,
            resources: "usable",
        });

        const link = dom.window.document.querySelector('a.word');
        expect(link.firstChild.nodeValue).toBe('Document');
    });
});
