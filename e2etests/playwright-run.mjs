import { execSync } from 'child_process';
import { join } from 'path';

const browserCacheRelative = process.argv[2];
const playwrightCommand = process.argv[3];

const browserCache = join(process.cwd(), '..', '..', '..', browserCacheRelative);
execSync(`npm  --cache . exec -- playwright ${playwrightCommand}`, {
    stdio: 'inherit',
    env: { ...process.env, PLAYWRIGHT_BROWSERS_PATH: browserCache }
});
