const { readFile } = require('fs/promises');

async function readImportMap(importMapFilePath) {
    // due to yargs argument validation not triggering if readImportMap throws
    if (!importMapFilePath || importMapFilePath === '[object Object]') {
        return;
    }

    try {
        const data = await readFile(importMapFilePath, { encoding: 'utf8' });
        return JSON.parse(data);
    } catch (error) {
        throw `Unable to read importMap JSON file at ${importMapFilePath} (either due to file missing or file contents not being valid JSON). See below for error.\n${error}`;
    }
}

module.exports = readImportMap;
