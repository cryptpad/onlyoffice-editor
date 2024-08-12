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
});
