module.exports = async function (filePath) {
    const pkgJsonBuffer = await readFile(filePath, 'utf-8');
    return JSON.parse(pkgJsonBuffer);
};
