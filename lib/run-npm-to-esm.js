const prepareNpmPackage = require('./package/prepare-npm-package');
const makeEsmBundle = require('./build/make-esm-bundle');

module.exports = async function runNpmToEsm(options, replaceConfig) {
    const { packageName, packageVersion, entry, includeDependencies, outputFile, importMap } = options;
    const { inputPath, directory } = await prepareNpmPackage(packageName, packageVersion, entry, includeDependencies);
    return await makeEsmBundle(inputPath, outputFile, directory, importMap, replaceConfig);
};
