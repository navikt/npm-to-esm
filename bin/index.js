#! /usr/bin/env node
const { execSync } = require('child_process');
const yargs = require('yargs/yargs');
const { hideBin } = require('yargs/helpers');
const rimraf = require('rimraf');
const readline = require('readline');
const argv = yargs(hideBin(process.argv)).argv;
const logger = require('./../utils/logger');
const verifyArguments = require('../utils/verify-arguments');
const getNPMPackage = require('./../utils/get-npm-package');
const convertCommonJsToESMAndWriteToDisk = require('./../utils/cjs-to-esm');

verifyArguments(argv).then(
    (arguments) => {
        const { packageName, version, entry, shouldCleanupWorkingDirectory, shouldIncludeDependencies, } = arguments;
        const importMap = !!arguments.importMap ? arguments.importMap : null;
        const outputFile = `./index.esm.js` || argv.outputFile;

        getNPMPackage({ name: packageName, version, entry }).then(({ inputPath, folder }) => {
            const cwd = folder;

            const pkgDirectory = `${cwd}/package`;
            logger.info('Current working directory:', cwd);

            if (shouldIncludeDependencies) {
                logger.info('--------------------------------------------------');
                logger.info('Executing npm install in current working directory');
                logger.info('...');
                execSync('npm install', { cwd: pkgDirectory });
                logger.info('Done');
                logger.info('--------------------------------------------------');
            }

            convertCommonJsToESMAndWriteToDisk(inputPath, outputFile, folder, importMap).then(
                () => {
                    logger.success(`\nGreat success! Open ${outputFile} to see end result`);

                    if (shouldCleanupWorkingDirectory) {
                        logger.warn('\n###################################');
                        logger.warn('## IMPORTANT: Cleanup is enabled ##');
                        logger.warn('###################################');

                        logger.warn(
                            '\nThis will run rimraf (rm -rf) of the current working directory which is currently set to:'
                        );

                        logger.warn(folder);
                        logger.warn('\nPlease confirm deletion by typing yes, or type anything else to stop deletion');

                        const rl = readline.createInterface({
                            input: process.stdin,
                            output: process.stdout,
                        });
                        rl.question('Answer: ', function (answer) {
                            if (answer === 'yes') {
                                rimraf(
                                    cwd,
                                    {
                                        disableGlob: true,
                                    },
                                    (error) => {
                                        if (error) {
                                            logger.error('Something went wrong deleting directory', error);
                                        }
                                        logger.success('Deleted. Exiting script');
                                        process.exit();
                                    }
                                );
                            } else {
                                logger.success('Nothing was deleted. Exiting script');
                                process.exit();
                            }
                        });
                    }
                },
                (errorMessage, errorObject) => logger.error(errorMessage, errorObject)
            );
        });
    },
    (error) => {
        logger.error(error);
        process.exit();
    }
);
