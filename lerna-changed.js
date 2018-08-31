const spawn = require('await-spawn');
const exec = require('await-exec');
const process = require('process');

function getArgs() {
    return process.argv.slice(2);
}

async function getChangedPackages() {
    const { stdout } = await exec('npm run lerna changed');
    return stdout.split('\n').slice(4, -1);
}

(async () => {
    const [ mode, command ] = getArgs();

    const packages = await getChangedPackages();
    const glob = `@(${packages.join('|')})`;
    await spawn('npm', ['run', 'lerna', mode, `"${command}"`, '--', '--scope', `"${glob}"`], { stdio: 'inherit', shell: true });
})();
