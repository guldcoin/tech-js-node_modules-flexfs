/* global fs:false */
const path = require('path')

function getAssignProperty (self, prop) {
  if (self.hasOwnProperty(prop)) return self[prop]
  if (fs && fs.hasOwnProperty(prop)) {
    self[prop] = fs[prop]
    return self[prop]
  } else throw new ReferenceError(`object has no property ${prop}`)
}

async function copyFile (p, np) {
  return getAssignProperty(this, 'writeFile')(np, (await getAssignProperty(this, 'readFile')(p)))
}

async function mkdirp (p) {
  return this.mkdir(p).catch(async (e) => {
    var parent = path.dirname(p)
    if (e && e.code && e.code === 'ENOENT' && parent !== '/') {
      await this.mkdirp(parent)
      return this.mkdirp(p)
    }
  })
}

async function cpr (p, np) {
  var stats = await this.stat(p)
  if (stats.isDirectory()) {
    await this.mkdirp(np)
    var list = await this.readdir(p)
    return Promise.all(list.map(async (l) => {
      return this.cpr(path.join(p, l), path.join(np, l))
    }))
  } else {
    return this.copyFile(p, np)
  }
}

async function mvr (p, np) {
  var stats = await this.stat(p)
  if (stats.isDirectory()) {
    await this.mkdirp(np)
    var list = await this.readdir(p)
    return Promise.all(list.map(async (l) => {
      await this.cpr(path.join(p, l), path.join(np, l))
      await this.rimraf(path.join(p, l))
    }))
  } else {
    return this.rename(p, np)
  }
}

async function rimraf (p) {
  var stats = await this.stat(p)
  if (stats.isDirectory()) {
    var list = await this.readdir(p)
    return Promise.all(list.map(async (l) => {
      return this.rimraf(path.join(p, l))
    }))
  } else {
    return this.unlink(p)
  }
}

const supplimentFS = {
  copyFile: copyFile
}

const extraFS = {
  mkdirp: mkdirp,
  cpr: cpr,
  mvr: mvr,
  rimraf: rimraf
}

module.exports = {
  supplimentFS: supplimentFS,
  extraFS: extraFS
}
