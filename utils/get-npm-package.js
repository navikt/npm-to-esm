const makeDir = require('make-dir');
const { tmpdir } = require('os');
const { nanoid } = require('nanoid');
const compressing = require('compressing');
const axios = require('axios');
const { readFile } = require('fs').promises;
const path = require('path');

async function getPackage({ name, version }) {
    const packageUrl = getPackageUrl({ name, version });
    try {
        const { data } = await axios({
            method: 'get',
            url: packageUrl,
            responseType: 'arraybuffer',
        });
        return Buffer.from(data, 'binary');
    } catch (error) {
        return error;
    }
}

function getPackageUrl({ name, version }) {
    const npmUrl = 'https://registry.npmjs.org';
    const fileName = `${name.split('/').pop()}-${version}.tgz`;
    const packageUrl = `${npmUrl}/${name}/-/${fileName}`;
    return packageUrl;
}

async function makeTemporaryDirectory() {
    const tmp = tmpdir();
    const directoryPath = `${tmp}/${nanoid()}`;
    const directory = await makeDir(directoryPath);
    return directory;
}

async function unpack(buffer) {
    const mappe = await makeTemporaryDirectory();
    await compressing.tgz.uncompress(buffer, mappe);
    return mappe;
}

function findEsmEntrypoint(pkg) {
    const { main, exports, module } = pkg;
    if (exports && Object.keys(exports).includes('import')) {
        return exports.import;
    } else if (main || module) {
        return main || module;
    } else {
        return './index.js';
    }
}

async function getNPMPackage({ name, version, entry }) {
    const package = await getPackage({ name, version });
    const directory = await unpack(package);
    const pkgJsonPath = `${directory}/package/package.json`;
    const pkgJsonBuffer = await readFile(pkgJsonPath, 'utf-8');
    const pkgJsonData = JSON.parse(pkgJsonBuffer);
    const entrypoint = entry || findEsmEntrypoint(pkgJsonData);
    const inputPath = path.join(directory, 'package', entrypoint);
    return { inputPath, directory };
}

module.exports = getNPMPackage;
