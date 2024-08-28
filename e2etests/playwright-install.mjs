import { execSync } from 'child_process';
import { readdirSync } from 'fs';
import { join } from 'path';

const outPath = join(process.cwd(), '..', '..', '..', process.argv[2]);
console.log('XXX');
console.log(process.cwd());
console.log(process.argv[2]);
console.log(outPath);
console.log(readdirSync(outPath));
execSync('npm  --cache . exec -- playwright install', {
    stdio: 'inherit',
    env: { ...process.env, PLAYWRIGHT_BROWSERS_PATH: outPath }
});
console.log(readdirSync('.'));
console.log(readdirSync(outPath));

// process.exit(1);
