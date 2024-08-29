import { promisify } from 'node:util';
import { join } from 'node:path';
import assert from 'node:assert/strict';
import { GenericContainer } from "testcontainers";
import { spawnSync } from 'node:child_process';

async function main() {
    let httpPort;
    const playwrightCommand = process.argv[2];
    const browserCache = join(process.cwd(), 'e2etests', 'ms-playwright');

    process.chdir('e2etests');

    const dockerInfo = spawnSync("docker", ["load", "-i", "../docker/load/tarball.tar"], {
        stdio: "inherit",
    });
    assert.equal(dockerInfo.status, 0);

    const container = await new GenericContainer("cp-documentserver:latest")
        .withExposedPorts({
            container: 80,
            host: 80
        })
        .start();

    try {
        httpPort = container.getFirstMappedPort();
        const { output, exitCode } = await container.exec([
            "supervisorctl",
            "start",
            "ds:example",
        ]);
        assert.equal(exitCode, 0)

        const npmInfo = spawnSync('npm', ['--cache', '.', 'exec', '--', 'playwright', playwrightCommand], {
            stdio: 'inherit',
            env: { ...process.env, PLAYWRIGHT_BROWSERS_PATH: browserCache }
        });
        assert.equal(npmInfo.status, 0);
    } finally {
        await container.stop();
    }
}

main().catch((e) => {
    console.error(e);
    process.exit(1);
});
