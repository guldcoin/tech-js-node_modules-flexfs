# flexfs

[![source](https://img.shields.io/badge/source-bitbucket-blue.svg)](https://bitbucket.org/guld/tech-js-node_modules-flexfs) [![issues](https://img.shields.io/badge/issues-bitbucket-yellow.svg)](https://bitbucket.org/guld/tech-js-node_modules-flexfs/issues) [![documentation](https://img.shields.io/badge/docs-guld.tech-green.svg)](https://guld.tech/lib/flexfs.html)

[![node package manager](https://img.shields.io/npm/v/flexfs.svg)](https://www.npmjs.com/package/flexfs) [![travis-ci](https://travis-ci.org/guldcoin/tech-js-node_modules-flexfs.svg)](https://travis-ci.org/guldcoin/tech-js-node_modules-flexfs?branch=guld) [![lgtm](https://img.shields.io/lgtm/grade/javascript/b/guld/tech-js-node_modules-flexfs.svg?logo=lgtm&logoWidth=18)](https://lgtm.com/projects/b/guld/tech-js-node_modules-flexfs/context:javascript) [![david-dm](https://david-dm.org/guldcoin/tech-js-node_modules-flexfs/status.svg)](https://david-dm.org/guldcoin/tech-js-node_modules-flexfs) [![david-dm](https://david-dm.org/guldcoin/tech-js-node_modules-flexfs/dev-status.svg)](https://david-dm.org/guldcoin/tech-js-node_modules-flexfs?type=dev)

Flexible and easy to use mixins for node's `fs` or subclasses, with Promises and value add functions.

### Install

##### Node

```sh
npm i flexfs
```

### Usage

To use flexfs, first you must initialize an instance of your favorite `fs` library. For example, node's native [fs](https://nodejs.org/api/fs.html) and [BrowserFS](https://github.com/jvilk/BrowserFS) are used in tests.

```
const { supplimentFS, extraFS } = require('flexfs')
const fs = require('fs')
// now dynamically attach functions from flexfs mixin
fs.mkdirp = extraFS.mkdirp
fs.cpr = extraFS.cpr
// use fs.mkdirp and fs.cpr
```

To use as an es6 class mixin, first use [object-to-class](https://github.com/isysd/object-to-class).

```
const o2c = require('object-to-class')
const ExtraFS = o2c(extraFS, 'ExtraFS')
class MyFS extends ExtraFS {}
let myfs = new MyFS()
myfs instanceof ExtraFS // true
```

#### Promise API

Every function is either natively written for Promises or is converted using [pify](https://github.com/sindresorhus/pify).

#### Mixins

##### extraFS

The following functions were implemented as extras, available through ExtraFS.

| Function | Description |
|----------|-------------|
| mkdirp   | Make a directory and any parent directories which didn't exists. |
| cpr | Copy a directory recursively. |

##### supplimentFS

The following functions are alternate implementation of core fs functionality. They are useful for incomplete or new fs implementations.

| Function | Description |
|----------|-------------|
| copyFile | Copy a file from old location to new. (standard) |

### License

MIT Copyright isysd <public@iramiller.com>
