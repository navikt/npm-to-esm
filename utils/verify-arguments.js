const Promise = require('promise');
const readImportMap = require('./read-import-map');

function getCommonArguments(argv) {
    return {
        packageName: argv.package,
        version: argv.v,
        entry: argv.entry,
        shouldIncludeDependencies: argv.includeDependencies,
        shouldCleanupWorkingDirectory: argv.cleanup,
    };
}

function verifyArguments(argv) {
    return new Promise((resolve, reject) => {
        const commonArguments = getCommonArguments(argv);
        if (!commonArguments.packageName) {
            reject('Please specify package with --package <argument>');
        }

        if (!commonArguments.version) {
            reject('Please specify version with --v <argument>');
        }

        const importMapFile = argv.importMap;
        const shouldUseImportMap = !!importMapFile;
        if (shouldUseImportMap) {
            readImportMap(importMapFile).then((importMap) => {
                resolve({ ...commonArguments, importMap });
            }, reject);
        } else {
            resolve(commonArguments);
        }
    });
}

module.exports = verifyArguments;
