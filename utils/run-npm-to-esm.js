const prepareNpmPackage = require('./prepare-npm-package');
const makeEsmBundle = require('./make-esm-bundle');

module.exports = async function runNpmToEsm(options) {
    const { packageName, packageVersion, entry, includeDependencies, outputFile, importMap } = options;
    const { inputPath, directory } = await prepareNpmPackage(packageName, packageVersion, entry, includeDependencies);
    return await makeEsmBundle(inputPath, outputFile, directory, importMap);
};
