const runNpmToEsm = require('./lib/run-npm-to-esm');
const validateArguments = require('./lib/cli/validate-arguments');
const optionsObjectToArray = require('./lib/utils/options-object-to-array');

module.exports = async (options) => {
    const optionsArray = optionsObjectToArray(options);
    const validatedOptions = await validateArguments(optionsArray, false);
    validatedOptions.importMap = validatedOptions.importMap ?? options.importMap;
    return await runNpmToEsm(validatedOptions, options.replaceConfig);
};
