/* global fetch */
const pify = require('pify')
const BrowserFS = require('browserfs')
const path = require('path')
var fs

async function mkdirp (p) {
  try {
    return fs.mkdir(p)
  } catch (e) {
    var parent = path.dirname(p)
    if (e && e.code && e.code === 'ENOENT' && parent !== '/') {
      await mkdirp(parent)
      return mkdirp(p)
    }
  }
}

async function cpr (p, np) {
  var stats = await fs.stat(p)
  if (stats.isDirectory()) {
    await fs.mkdirp(np)
    var list = await fs.readdir(p)
    return Promise.all(list.map(async (l) => {
      return cpr(path.join(p, l), path.join(np, l))
    }))
  } else {
    return fs.copyFile(p, np)
  }
}

async function copyFile (p, np) {
  return fs.writeFile(np, (await fs.readFile(p)))
}

function wrapFS (tfs, prefix) {
  prefix = prefix || require('os').tmpdir('flexfs')
  var newfs = Object.create(Object.getPrototypeOf(tfs))
  Object.keys(tfs).forEach(f => {
    if (typeof tfs[f] === 'function') {
      newfs[f] = function (...args) {
        args[0] = `${prefix}${args[0]}`
        return tfs[f](...args)
      }
    } else newfs[f] = tfs[f]
  })
  return newfs
}

function getDefaultConfig () {
  if (typeof chrome !== 'undefined' && chrome.storage) {
    return {
      fs: 'ChromeStorage',
      options: {
        'storeType': 'local',
        'cacheSize': 500,
        '/BLOCKREE/GULD': {
          fs: 'InMemory'
        }
      }
    }
  } else {
    try {
      return {
        fs: require('fs')
      }
    } catch (e) {
      return {
        fs: 'InMemory'
      }
    }
  }
}

async function readOrFetch (p) {
  try {
    return require('fs').readFileSync(p)
  } catch (e) {
    // TODO sort by error type, maybe throw
    if (typeof fetch === 'function') {
      let response = await fetch(p)
      if (response.ok) {
        return response.blob()
      } else {
        throw e
      }
    } else throw e
  }
}

async function flexfs (config) {
  config = config || getDefaultConfig()
  function finishFS (tfs) {
    fs = pify(tfs)
    fs.mkdirp = mkdirp
    if (!fs.hasOwnProperty('copyFile')) fs.copyFile = copyFile
    fs.cpr = cpr
    if (config.prefix) fs = wrapFS(fs, config.prefix)
    return fs
  }
  if (config.fs && (typeof config.fs !== 'string')) {
    return finishFS(config.fs)
  }
  return pify(BrowserFS.configure)(config).then(() => {
    return finishFS(BrowserFS.BFSRequire('fs'))
  })
}

module.exports = {
  flexfs: flexfs,
  readOrFetch: readOrFetch,
  getDefaultConfig: getDefaultConfig,
  wrapFS: wrapFS
}
