const rollup = require('rollup');
const importmap = require('@eik/rollup-plugin');
const commonjs = require('@rollup/plugin-commonjs');
const { nodeResolve } = require('@rollup/plugin-node-resolve');
const replace = require('@rollup/plugin-replace');

const getRollupOptions = (inputFile, outputFile, moduleDirectory, importMap) => {
    const shouldUseImportMap = !!importMap;
    const plugins = [];
    plugins.push(
        replace({
            'process.env.NODE_ENV': JSON.stringify('production'),
            preventAssignment: true,
        })
    );

    if (shouldUseImportMap) {
        plugins.push(importmap({ maps: [{ imports: importMap }] }));
    }

    plugins.push(
        nodeResolve({
            moduleDirectories: [`${moduleDirectory}/package/node_modules`],
        }),
        commonjs({})
    );

    return {
        input: inputFile,
        plugins,
        output: {
            file: outputFile,
            format: 'esm',
        },
        treeshake: {
            propertyReadSideEffects: 'always',
        },
    };
};

async function makeEsmBundle(inputFile, outputFile, folder, importMap) {
    const rollupOptions = getRollupOptions(inputFile, outputFile, folder, importMap);
    const bundle = await rollup.rollup(rollupOptions);
    await bundle.generate(rollupOptions.output);
    await bundle.write(rollupOptions.output);
    await bundle.close();
}

module.exports = makeEsmBundle;
