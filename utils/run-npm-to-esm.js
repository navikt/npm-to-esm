const makeEsmBundle = require('./make-esm-bundle');
const prepareNpmPackage = require('./prepare-npm-package');

module.exports = async function runNpmToEsm(options) {
    const { packageName, packageVersion, entry, includeDependencies, importMap, outputFile } = options;
    const { inputPath, directory } = await prepareNpmPackage(packageName, packageVersion, entry, includeDependencies);
    return await makeEsmBundle(inputPath, outputFile, directory, importMap);
};
