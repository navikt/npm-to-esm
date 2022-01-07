const { readFile } = require('fs/promises');

async function readImportMap(importMapFilePath) {
    try {
        const data = await readFile(importMapFilePath, { encoding: 'utf8' });
        return JSON.parse(data);
    } catch (error) {
        throw `Unable to read importMap JSON file at ${importMapFilePath}\n${error}`;
    }
}

module.exports = readImportMap;
