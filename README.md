# npm-to-esm

`npm-to-esm` is a utility for making ESM bundles out of npm-modules fetched off of the npm registry located at registry.npmjs.org.

## Description

It does this by fetching a specified NPM-module from the registry to your file system, and using a specified entrypoint, it runs the contents of the module through a Rollup build that is setup and executed [here](https://github.com/navikt/npm-to-esm), putting the resulting contents in an outputFile of your choice (or `./index.esm.js` from where you are running it by default). 

It has been tested using modules that are on CommonJS and ESM formats respectively. However, _it should be considered a best-effort and it may not work for your use-case_ - this util is still very much a work in progress.

You may specify an import-map to have imports in the finished bundle translated to be imported from a URL instead, made possible by [this great rollup-plugin](https://www.npmjs.com/package/@eik/rollup-plugin) (Thanks a ton for making it! :pray:).

You may want to include the dependencies of the module you are fetching in the ESM build, in which case you may pass an option to the util to have that done (`--includeDependencies`). If you include dependencies, but also specify an import map for a certain dependency, the import map will take precedence and thus, the code of that dependency will not be made part of the bundle.

# Getting started

To install the package from the NPM registry:

```npm install -g @navikt/npm-to-esm```

Usage example:

```npm-to-esm --package @navikt/ds-react --v 0.14.3-beta.1 --entry ./esm/index.js```

## Options

| Option | Description | Required / Optional | Default value | Example |
| --- | --- | --- | --- | --- |
| `--package <packageName>` | The desired package from NPM registry | required | | |
| `--v <version>` | Version of the desired package | required | | |
| `--entry <path to entrypoint>` | Custom entrypoint to build from (relative to root of the specified package) | optional | | |
| `--includeDependencies` | Whether or not to include dependencies of the module | optional | | |
| `--importMap <path to file>` | Import map | optional | | `{ "react": "https://<my-cool-cdn>/react.esm.js" }` |
| `--outputFile <path to file>` | Where to output the finished bundle | optional | `./index.js` | |

---

# Contact

Questions regarding the code may be asked as issues to this GitHub repository.

## For NAV-employees

Interne henvendelser kan sendes via Slack i kanalen #frontendplattform.