import { join } from 'node:path';
import assert from 'node:assert/strict';
import { GenericContainer } from "testcontainers";
import { spawnSync } from 'node:child_process';
import { readdirSync, cpSync } from 'node:fs';

async function main() {
    let httpPort;
    const browserCache = join(process.cwd(), 'e2etests', 'ms-playwright');

    process.chdir('e2etests');

    // console.log('XXX ls .', readdirSync('.'));
    // console.log('XXX ls ms-playwright', readdirSync('ms-playwright'));


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

        const npmInfo = spawnSync('npm', ['--cache', '.', 'exec', '--', 'playwright', 'test'], {
            stdio: 'inherit',
            env: { ...process.env, PLAYWRIGHT_BROWSERS_PATH: browserCache }
        });

        cpSync('test-results', process.env['TEST_UNDECLARED_OUTPUTS_DIR'], {recursive: true});

        assert.equal(npmInfo.status, 0, 'Error while calling playwright ' + npmInfo.stdout + ' ' + npmInfo.stderr);
    } finally {
        await container.stop();
    }
}

main().catch((e) => {
    console.error(e);
    process.exit(1);
});
