const rimraf = require('rimraf');
const readline = require('readline');
const logger = require('./logger');

const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
});

function logWarningMessage(directory) {
    logger.warn('\n###################################');
    logger.warn('## IMPORTANT: Cleanup is enabled ##');
    logger.warn('###################################');
    logger.warn('\nThis will run rimraf (rm -rf) of the current working directory which is currently set to:');
    logger.warn(directory);
}

function getCleanupConfirmation() {
    return new Promise((resolve, reject) => {
        logger.warn('\nPlease confirm deletion by typing yes, or type anything else to stop deletion');
        rl.question('Answer: ', function (answer) {
            if (answer === 'yes') {
                resolve();
            } else {
                reject();
            }
        });
    });
}

function deleteDirectory(directory) {
    return new Promise((resolve, reject) => {
        rimraf(
            directory,
            {
                disableGlob: true,
            },
            (error) => {
                if (error) {
                    reject('Something went wrong deleting directory', error);
                }
                logger.success('Deleted. Exiting script');
                resolve();
            }
        );
    });
}

function cleanup(directory) {
    return new Promise((resolve, reject) => {
        logWarningMessage(directory);
        getCleanupConfirmation().then(
            () => deleteDirectory(directory).then(resolve, reject),
            () => {
                logger.success('Nothing was deleted. Exiting script');
                resolve();
            }
        );
    });
}

module.exports = cleanup;
