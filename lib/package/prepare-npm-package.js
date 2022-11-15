const util = require('util');
const exec = util.promisify(require('child_process').exec);
const logger = require('../utils/logger');
const getNpmPackage = require('./get-npm-package');

async function runNpmInstallInPackageDirectory(cwd) {
    const packageDirectory = `${cwd}/package`;
    logger.info('--------------------------------------------------');
    logger.info(`Executing npm install in package directory (${packageDirectory})`);
    logger.info('.....');
    await exec('npm install', { cwd: packageDirectory });
    logger.info('Done');
    logger.info('--------------------------------------------------');
}

async function prepareNpmPackage(packageName, version, entry, shouldIncludeDependencies) {
    const { inputPath, directory } = await getNpmPackage({ name: packageName, version, entry });
    if (shouldIncludeDependencies) {
        await runNpmInstallInPackageDirectory(directory);
    }
    return { inputPath, directory };
}

module.exports = prepareNpmPackage;
