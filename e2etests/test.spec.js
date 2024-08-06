import { GenericContainer } from "testcontainers";
import fetch from 'node-fetch';
import { spawnSync } from 'child_process';

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
        const response = await fetch(url);
        expect(response.status).toBe(200);
    });
});
