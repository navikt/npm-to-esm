#! /usr/bin/env node
const logger = require('../lib/utils/logger');
const runNpmToEsm = require('../lib/run');
const validateArguments = require('../lib/cli/validate-arguments');

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
