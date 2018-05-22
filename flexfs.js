/* global chrome */
const pify = require('pify')
const BrowserFS = require('browserfs')
const path = require('path')
const global = require('window-or-global')

async function mkdirp (p) {
  try {
    return global.fs.mkdir(p)
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
    return await fs.copyFile(p, np)
  }
}

async function copyFile (p, np) {
  return await fs.writeFile(np, (await fs.readFile(p)))
}

function wrapFS (tfs, prefix) {
  prefix = prefix || require('os').tmpdir('flexfs')
  var newfs = Object.create(Object.getPrototypeOf(tfs))
  Object.keys(tfs).forEach(f => {
    if (typeof tfs[f] === 'function') {
      newfs[f] = function(...args) {
        args[0] = `${prefix}${args[0]}`
        return tfs[f](...args)
      }
    } else newfs[f] = tfs[f]
  })
  return newfs
}

function getDefaultConfig () {
  if (chrome && chrome.storage) {
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

module.exports = async function flexfs (config) {
  config = config || getDefaultConfig()
  function finishFS (tfs) {
    global.fs = pify(tfs)
    global.fs.mkdirp = mkdirp
    if (!global.fs.hasOwnProperty('copyFile')) global.fs.copyFile = copyFile
    global.fs.cpr = cpr
    if (config.prefix) global.fs = wrapFS(global.fs, config.prefix)
    return global.fs
  }
  if (config.fs && (typeof config.fs !== 'string')) {
    return finishFS(config.fs)
  }
  return pify(BrowserFS.configure)(config).then(() => {
    return finishFS(BrowserFS.BFSRequire('fs'))
  })
}
