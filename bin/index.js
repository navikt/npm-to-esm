#! /usr/bin/env node
const logger = require('./../utils/logger');
const runNpmToEsm = require('../utils/run-npm-to-esm');
const validateArguments = require('../utils/validate-arguments');

(async () => {
    try {
        const argv = await validateArguments(process.argv, true);
        await runNpmToEsm(argv);
        const outputFile = argv.outputFile;
        logger.success(`\nGreat success! Open ${outputFile} to see end result`);
    } catch (error) {
        logger.error(error);
        process.exit(1);
    }
})();
