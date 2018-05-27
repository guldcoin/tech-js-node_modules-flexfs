# flexfs

Flexible and easy to use mixins for node's fs or subclasses. Works in both the browser and nodeJS.

### Installation

Please use npm to install.

`npm i flexfs`

##### Browser

To use in the browser, please use browserify or webpack to include and build flexfs. No standalone browser library is currently implemented, but can be if requested.

### Usage

To use flexfs, first you must initialize an instance of your favorite `fs` library. For example, node's native [fs](https://nodejs.org/api/fs.html) and [BrowserFS](https://github.com/jvilk/BrowserFS) are used in tests.

```
const { SupplimentFS, ExtraFS } = require('flexfs')
const fs = require('fs')
// now extend with flexfs mixin
fs.mkdirp = ExtraFS.mkdirp
fs.cpr = ExtraFS.cpr
```

### Promise API

Every function is either natively written for Promises or is converted using [pify](https://github.com/sindresorhus/pify).

### Mixins

##### ExtraFS

The following functions were implemented as extras, available through ExtraFS.

| Function | Description |
|----------|-------------|
| mkdirp   | Make a directory and any parent directories which didn't exists. |
| cpr | Copy a directory recursively. |

##### SupplimentFS

The following functions are alternate implementation of core fs functionality. They are useful for incomplete or new fs implementations.

| Function | Description |
|----------|-------------|
| copyFile | Copy a file from old location to new. (standard) |

