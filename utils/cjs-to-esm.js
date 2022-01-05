const rollup = require('rollup');
const importmap = require('@eik/rollup-plugin');
const commonjs = require('@rollup/plugin-commonjs');
const { nodeResolve } = require('@rollup/plugin-node-resolve');
const importmapValue = require('../import-map');
const replace = require('@rollup/plugin-replace');

const getRollupOptions = (inputFile, outputFile, moduleDirectory) => {
    return {
        input: inputFile,
        plugins: [
            replace({
                'process.env.NODE_ENV': JSON.stringify('production'),
                preventAssignment: true
            }),
            importmap(importmapValue || { maps: []  }),
            nodeResolve({
                moduleDirectories: [`${moduleDirectory}/package/node_modules`],
            }),
            commonjs({}),
        ],
        output: {
            file: outputFile,
            format: 'esm',
        },
        treeshake: {
            propertyReadSideEffects: 'always',
        },
    };
};

async function convertCommonJsToESMAndWriteToDisk(inputFile, outputFile, folder) {
    const rollupOptions = getRollupOptions(inputFile, outputFile, folder);
    const bundle = await rollup.rollup(rollupOptions);
    await bundle.generate(rollupOptions.output);
    await bundle.write(rollupOptions.output);
    await bundle.close();
}

module.exports = convertCommonJsToESMAndWriteToDisk;
