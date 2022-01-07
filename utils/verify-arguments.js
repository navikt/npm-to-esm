const readImportMap = require('./read-import-map');

function getCommonArguments(argv) {
    return {
        packageName: argv.package,
        version: argv.v,
        entry: argv.entry,
        shouldIncludeDependencies: argv.includeDependencies,
        outputFile: argv.outputFile
    };
}

async function verifyArguments(argv) {
    const commonArguments = getCommonArguments(argv);
    if (!commonArguments.packageName) {
        throw 'Please specify package with --package <argument>';
    }

    if (!commonArguments.version) {
        throw 'Please specify version with --v <argument>';
    }

    const importMapFile = argv.importMap;
    const shouldUseImportMap = !!importMapFile;
    if (shouldUseImportMap) {
        const importMap = await readImportMap(importMapFile);
        return { ...commonArguments, importMap };
    }
    return commonArguments;
}

module.exports = verifyArguments;
