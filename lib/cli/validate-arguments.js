const yargs = require('yargs/yargs');
const { hideBin } = require('yargs/helpers');
const readImportMap = require('../importmap/read-import-map');

module.exports = async function validateArguments(completeArgList, runningFromCli) {
    const argList = runningFromCli ? hideBin(completeArgList) : completeArgList;
    return await yargs(argList)
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
};
