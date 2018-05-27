# flexfs

[![npm](https://img.shields.io/npm/v/flexfs.svg)](https://www.npmjs.com/package/flexfs) [![Build Status](https://travis-ci.org/isysd/flexfs.svg?branch=master)](https://travis-ci.org/isysd/flexfs) [![Coverage Status](https://coveralls.io/repos/github/isysd/flexfs/badge.svg?branch=master)](https://coveralls.io/github/isysd/flexfs?branch=master)

Flexible and easy to use mixins for node's fs or subclasses. Works in both the browser and nodeJS.

### Installation

Please use npm to install.

`npm i flexfs`

##### Browser

To use in the browser, please use browserify or webpack to include and build flexfs. Alternately, use the standalone package in `./dist/flexfs.js`.

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

### Promise API

Every function is either natively written for Promises or is converted using [pify](https://github.com/sindresorhus/pify).

### Mixins

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

