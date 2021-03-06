# npm-to-esm

`npm-to-esm` is a utility for making ESM bundles out of npm-modules fetched off of the npm registry located at registry.npmjs.org.

## Description

It does this by fetching a specified NPM-module from the registry to your file system, and using a specified entrypoint, it runs the contents of the module through a Rollup build that is setup and executed [here](https://github.com/navikt/npm-to-esm/blob/main/utils/make-esm-bundle.js), putting the resulting contents in an outputFile of your choice (or `./index.esm.js` from where you are running it by default). 

It has been tested using modules that are on CommonJS and ESM formats respectively. However, _it should be considered a best-effort and it may not work for your use-case_ - this util is still very much a work in progress.

# Getting started

To install the package from the NPM registry:

```npm install -g @navikt/npm-to-esm```

Usage example:

```npm-to-esm --packageName @navikt/ds-react --packageVersion 0.14.3-beta.1 --entry ./esm/index.js```

You may also require it from Node.js and provide options as an argument:

```
const npmToEsm = require('@navikt/npm-to-esm');

async function myFunction() {
    const rollupOutput = await npmToEsm({ 
        packageName: '@navikt/ds-react', 
        packageVersion: '0.16.8'
        // ... other options
    })
}
```

## Options

| Option | Description | Required / Optional | Default value | Example |
| --- | --- | --- | --- | --- |
| `--packageName <packageName>` | The desired package from NPM registry | required | | |
| `--packageVersion <version>` | Version of the desired package | required | | |
| `--entry <path to entrypoint>` | Custom entrypoint to build from (relative to root of the specified package) | optional | | |
| `--includeDependencies` | Whether or not to include dependencies of the package in the resulting ESM bundle | optional | | |
| `--importMap <path to file>` | Path to a file containing an import map in valid JSON format. Uses [this rollup-plugin](https://www.npmjs.com/package/@eik/rollup-plugin) to translate imports to use specified URLs instead (see example). Takes precedence over `--includeDependencies` for imports included in the import map. | optional | | `{ "react": "https://<my-cool-cdn>/react.esm.js" }` |
| `--outputFile <path to file>` | Where to output the finished bundle | optional | `./index.js` | |

### Replacing strings in output build

If you want to modify the output of the rollup build before writing the contents to a file, the [rollup-build](https://github.com/navikt/npm-to-esm/blob/main/utils/make-esm-bundle.js) has been configured with usage of [rollup's replace plugin](https://www.npmjs.com/package/@rollup/plugin-replace), and providing a custom config object to this plugin is supported when using npm-to-esm from Node.js (please read the docs for @rollup/plugin-replace for how to configure it for your use case).

Example:
```
const npmToEsm = require('@navikt/npm-to-esm');

async function myFunction() {
    const rollupOutput = await npmToEsm({ 
        packageName: '@navikt/ds-react', 
        packageVersion: '0.16.8'
        replaceConfig: {
            delimiters: ['', ''],
            values: {
                'process.env.NODE_ENV': JSON.stringify('production'),
                'import { myNamedExport }': 'import myDefaultExport' 
            }
        }
    })
}
```

**Please note: The replace plugin does have a default configuration set up in the rollup build, regardless of whether npm-to-esm is being used from Node.js or CLI.**

Currently, it is configured with this by default:
```
{
    preventAssignment: true,
    'process.env.NODE_ENV': JSON.stringify('production'),
};
```

---

# Contact

Questions regarding the code may be asked as issues to this GitHub repository.

## For NAV-employees

Interne henvendelser kan sendes via Slack i kanalen #personbruker-teknisk.
