# flexfs

Flexible and easy to use wrapper for node's fs or subclasses. Works in both the browser and nodeJS. If a browser environment is chosen, flexfs will initialize and wrap an instance of BrowserFS.

### Installation

Please use npm to install.

`npm i flexfs`

##### Browser

To use in the browser, please use browserify or webpack to include and build flexfs. No standalone browser library is currently implemented, but can be if requested.

### Usage

To use flexfs, first you must first choose a configuration and then initialize and instance. If no configuration is provided, one will be supplied based on the runtime environment.

For configuration, flexfs adapted the format used by `BrowserFS`

```
const flexfs = require('flexfs')
let config = {
  fs: 'InMemory'
}
flexfs(config).then(tfs => {
  // tfs is a wrapped fs instance
})
```

There are some exceptions and changes which flexfs implements. The first difference is that if the config has an 'fs' key, it will be wrapped as-is. This is useful for nodeJS environments, when the standard fs is insufficient.

Another difference is the new `prefix` option. If a prefix is supplied in the config, all fs methods will prepend that prefix to path arguments.

### Promise API

Every function is either natively written for Promises or is converted using [pify](https://github.com/sindresorhus/pify).

### Extras

The following functions were also implemented. Some are standard fs function which we re-wrote and some are non-standard value adds.

| Function | Description |
|----------|-------------|
| mkdirp   | Make a directory and any parent directories which didn't exists. |
| cpr | Copy a directory recursively. |
| copyFile | Copy a file from old location to new. (standard) |
