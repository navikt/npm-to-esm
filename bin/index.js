#! /usr/bin/env node
const yargs = require('yargs/yargs');
const { hideBin } = require('yargs/helpers');
const argv = yargs(hideBin(process.argv)).argv;
const logger = require('./../utils/logger');
const verifyArguments = require('../utils/verify-arguments');
const makeEsmBundle = require('../utils/make-esm-bundle');
const prepareNpmPackage = require('./../utils/prepare-npm-package');

(async () => {
    try {
        const arguments = await verifyArguments(argv);
        const { packageName, version, entry, shouldIncludeDependencies } = arguments;
        const importMap = !!arguments.importMap ? arguments.importMap : null;
        const outputFile = arguments.outputFile || './index.esm.js';

        const { inputPath, directory } = await prepareNpmPackage(
            packageName,
            version,
            entry,
            shouldIncludeDependencies
        );

        await makeEsmBundle(inputPath, outputFile, directory, importMap);
        logger.success(`\nGreat success! Open ${outputFile} to see end result`);
    } catch (error) {
        logger.error(error);
        process.exit(1);
    }
})();
