module.exports = function inferEntrypoint(pkg) {
    const { main, exports, module } = pkg;
    if (exports && Object.keys(exports).includes('import')) {
        entry = exports.import;
    } else if (main || module) {
        entry = main || module;
    } else {
        entry = './index.js';
    }
    return entry;
};
