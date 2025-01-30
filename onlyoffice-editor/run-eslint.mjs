import { execSync } from 'child_process';

// process.chdir('onlyoffice-editor');
// console.log(execSync('ls', { encoding: 'utf-8' }));
// console.log('---');
// console.log(execSync('ls -al node_modules', { encoding: 'utf-8' }));
// process.chdir('node_modules');
// process.chdir('eslint');
// process.chdir('bin');
// console.log(execSync('ls -al', { encoding: 'utf-8' }));

execSync('node_modules/eslint/bin/eslint.js .', {
    stdio: 'inherit',
});
