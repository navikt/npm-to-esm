const { exec } = require('child_process');
const Promise = require('promise');
const logger = require('./logger');
const getNpmPackage = require('./get-npm-package');

function runNpmInstallInPackageDirectory(cwd) {
    return new Promise((resolve, reject) => {
        const packageDirectory = `${cwd}/package`;
        logger.info('--------------------------------------------------');
        logger.info(`Executing npm install in package directory (${packageDirectory})`);
        logger.info('...');
        exec('npm install', { cwd: packageDirectory }, (error) => {
            if (error) {
                reject(error);
            }
            logger.info('Done');
            logger.info('--------------------------------------------------');
            resolve();
        });
    });
}

async function prepareNpmPackage(packageName, version, entry, shouldIncludeDependencies) {
    try {
        const { inputPath, directory } = await getNpmPackage({ name: packageName, version, entry });
        if (shouldIncludeDependencies) {
            await runNpmInstallInPackageDirectory(directory);
        }
        return { inputPath, directory };
    } catch (error) {
        throw error;
    }
}

module.exports = prepareNpmPackage;
