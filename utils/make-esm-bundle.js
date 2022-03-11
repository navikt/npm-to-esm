const rollup = require('rollup');
const importmap = require('@eik/rollup-plugin');
const commonjs = require('@rollup/plugin-commonjs');
const { nodeResolve } = require('@rollup/plugin-node-resolve');
const replace = require('@rollup/plugin-replace');

const defaultReplaceConfig = {
    preventAssignment: true,
    'process.env.NODE_ENV': JSON.stringify('production'),
};

const getRollupOptions = (inputFile, outputFile, moduleDirectory, importMap, replaceConfigArgument) => {
    let replaceConfig = defaultReplaceConfig;
    const plugins = [];

    if (replaceConfigArgument) {
        replaceConfig = {
            ...replaceConfig,
            ...replaceConfigArgument,
        };
    }

    plugins.push(replace(replaceConfig));

    const shouldUseImportMap = !!importMap;
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

async function makeEsmBundle(inputFile, outputFile, folder, importMap, replaceConfig) {
    const rollupOptions = getRollupOptions(inputFile, outputFile, folder, importMap, replaceConfig);
    const bundle = await rollup.rollup(rollupOptions);
    const rollupOutput = await bundle.write(rollupOptions.output);
    await bundle.close();
    return rollupOutput;
}

module.exports = makeEsmBundle;
