import { GenericContainer } from "testcontainers";
import fetch from 'node-fetch';

const DOCKER_START_TIMEOUT_MS = 1 * 60 * 1000;

describe("A suite is just a function", function () {
    let container;
    let httpPort;

    beforeAll(async () => {
        container = await new GenericContainer("cp-documentserver:latest")
            .withExposedPorts(80)
            .start();

        httpPort = container.getFirstMappedPort();
    }, DOCKER_START_TIMEOUT_MS);

    afterAll(async () => {
        await container.stop();
    });

    it("and so is a spec", async function () {
        const url = new URL("http://localhost/welcome/");
        url.port = httpPort;
        const response = await fetch(url);
        expect(response.status).toBe(200);
    });
});
