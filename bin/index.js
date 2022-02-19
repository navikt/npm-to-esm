#! /usr/bin/env node
const yargs = require('yargs/yargs');
const { hideBin } = require('yargs/helpers');
const logger = require('./../utils/logger');
const readImportMap = require('./../utils/read-import-map');
const runNpmToEsm = require('../utils/run-npm-to-esm');

(async () => {
    try {
        const argv = await yargs(hideBin(process.argv))
            .option('packageName', {
                type: 'string',
                description: 'The desired package from NPM registry',
                alias: 'p',
            })
            .option('packageVersion', {
                type: 'string',
                description: 'Version of the desired package',
                alias: 'v',
            })
            .option('entry', {
                type: 'string',
                description: 'Custom entrypoint to build from (relative to root of the specified package)',
                alias: 'e',
            })
            .option('includeDependencies', {
                type: 'boolean',
                description: 'Whether or not to include dependencies of the module',
            })
            .option('importMap', {
                type: 'string',
                description: 'Import map',
                coerce: readImportMap,
            })
            .option('outputFile', {
                type: 'string',
                description: 'Where to output the finished bundle',
                default: './index.esm.js',
            })
            .demandOption(['packageName', 'packageVersion'])
            .parseAsync();

        await runNpmToEsm(argv);
        const outputFile = argv.outputFile;
        logger.success(`\nGreat success! Open ${outputFile} to see end result`);
    } catch (error) {
        logger.error(error);
        process.exit(1);
    }
})();
