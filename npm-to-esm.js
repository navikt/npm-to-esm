const runNpmToEsm = require('./utils/run-npm-to-esm');
const validateArguments = require('./utils/validate-arguments');
const optionsObjectToArray = require('./utils/options-object-to-array');

module.exports = async (options) => {
    const optionsArray = optionsObjectToArray(options);
    const validatedOptions = await validateArguments(optionsArray, false);
    return await runNpmToEsm(validatedOptions);
};
