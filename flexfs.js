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

function getDefaultConfig () {
  if (chrome && chrome.storage) {
    return {
      fs: 'ChromeStorage',
      options: {
        'storeType': 'local',
        'cacheSize': 500,
        '/BLOCKTREE/guld': {
          fs: 'InMemory'
        }
      }
    }
  } else {
    return {
      fs: 'InMemory'
    }
  }
}

module.exports = async function setFS (config) {
  config = config || getDefaultConfig()
  return pify(BrowserFS.configure)(config, function (e) {
    if (e) throw e
    global.fs = pify(BrowserFS.BFSRequire('fs'))
    global.fs.mkdirp = mkdirp
    return global.fs
  })
}
