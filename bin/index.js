#! /usr/bin/env node
const { readFile } = require('fs');
const { execSync } = require('child_process');
const yargs = require('yargs/yargs');
const { hideBin } = require('yargs/helpers');
const rimraf = require('rimraf');
const readline = require('readline');
const argv = yargs(hideBin(process.argv)).argv;
const Logger = require('./../utils/logger');
const getNPMPackage = require('./../utils/get-npm-package');
const convertCommonJsToESMAndWriteToDisk = require('./../utils/cjs-to-esm');

const logger = new Logger();

const packageName = argv.package;
const version = argv.v;
const entry = argv.entry;
const shouldIncludeDependencies = argv.includeDependencies;
const shouldCleanupWorkingDirectory = argv.cleanup;
const importMapFile = argv.importMap;

let importMap = null;
readFile(importMapFile, 'utf-8', function (error, data) {
    if (error) {
        logger.error('Unable to read importMap file', error);
        process.exit();
    }
    try {
        importMap = JSON.parse(data);
        logger.info(`Import map parsed`);
    } catch (error) {
        logger.error(`Provided import-map at ${importMapFile} does not contain valid JSON`);
        process.exit();
    }
});

if (!packageName) {
    logger.error('Please specify package with --package <argument>');
    process.exit();
}

if (!version) {
    logger.error('Please specify version with --v <argument>');
    process.exit();
}

const outputFile = `./index.esm.js`;

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
        (error) => logger.error('Something went wrong', error)
    );
});
