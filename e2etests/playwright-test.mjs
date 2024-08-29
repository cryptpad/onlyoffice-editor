import { execSync } from 'child_process';
import { join } from 'path';
import { readdirSync } from 'fs';  // TODO clean up debug logs

const browserCacheRelative = process.env.BROWSERS_PATH;
const playwrightCommand = process.argv[2];
console.log('XXX', { argv: process.argv, browserCacheRelative, playwrightCommand });
const browserCache = join(process.cwd(), 'e2etests', 'ms-playwright');
console.log(readdirSync(browserCache));

console.log('XXX', { argv: process.argv, browserCacheRelative, browserCache, playwrightCommand });

process.chdir('e2etests');
execSync(`npm  --cache . exec -- playwright ${playwrightCommand}`, {
    stdio: 'inherit',
    env: { ...process.env, PLAYWRIGHT_BROWSERS_PATH: browserCache }
});
