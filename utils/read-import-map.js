const { readFile } = require('fs/promises');

async function readImportMap(importMapFilePath) {
    // due to yargs argument validation not triggering if readImportMap throws
    if (!importMapFilePath) {
        return;
    }

    try {
        const data = await readFile(importMapFilePath, { encoding: 'utf8' });
        return JSON.parse(data);
    } catch (error) {
        throw `Unable to read importMap JSON file at ${importMapFilePath}\n${error}`;
    }
}

module.exports = readImportMap;
