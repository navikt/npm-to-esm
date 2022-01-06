const { readFile } = require('fs');
const Promise = require('promise');

function readImportMap(importMapFilePath) {
    return new Promise((resolve, reject) => {
        readFile(importMapFilePath, 'utf-8', function (error, data) {
            if (error) {
                reject(`Unable to read importMap file at ${importMapFilePath}`, error);
            }
            try {
                const importMap = JSON.parse(data);
                resolve(importMap);
            } catch (error) {
                reject(`Provided import-map at ${importMapFilePath} does not contain valid JSON`, error);
            }
        });
    });
}

module.exports = readImportMap;
