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

async function makeTemporaryFolder() {
    const tmp = tmpdir();
    const folderPath = `${tmp}/${nanoid()}`;
    const folder = await makeDir(folderPath);
    return folder;
}

async function unpack(buffer) {
    const mappe = await makeTemporaryFolder();
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
    const folder = await unpack(package);
    const pkgJsonPath = `${folder}/package/package.json`;
    const pkgJsonBuffer = await readFile(pkgJsonPath, 'utf-8');
    const pkgJsonData = JSON.parse(pkgJsonBuffer);
    const entrypoint = entry || findEsmEntrypoint(pkgJsonData);
    const inputPath = path.join(folder, 'package', entrypoint);
    return { inputPath, folder };
}

module.exports = getNPMPackage;
