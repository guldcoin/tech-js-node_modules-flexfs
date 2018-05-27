/* global describe:false it:false before:false */
const chai = require('chai')
const pify = require('pify')
const nodefs = pify(require('fs'))
const { SupplimentFS, ExtraFS } = require('./flexfs.js')
// const prefix = require('os').tmpdir()
const BrowserFS = require('browserfs')
const Buffer = require('buffer/').Buffer
const ocopy = require('object-copy')
const readOrFetch = require('read-or-fetch')

describe('BrowserFS', () => {
  it('extends BrowserFS instance seemlessly', async () => {
    var tfs
    await new Promise(resolve => {
      BrowserFS.configure({fs: 'InMemory'}, (e) => {
        if (e) throw e
        tfs = pify(BrowserFS.BFSRequire('fs'))
        resolve()
      })
    })
    await tfs.writeFile('/tmp.txt', 'hello world')
    ocopy(tfs, SupplimentFS)
    await tfs.copyFile('/tmp.txt', '/tmp.copy', 'utf8')
    var content = await tfs.readFile('/tmp.txt', 'utf8')
    chai.assert.equal(content, 'hello world')
    content = await tfs.readFile('/tmp.copy', 'utf8')
    chai.assert.equal(content, 'hello world')
  })
})
describe('ExtraFS', function () {
  before(async () => {
    this.zipData = new Buffer(await readOrFetch('./fixtures/guld.zip'))
  })
  describe('mkdir', () => {
    it('makes directories recursively', async () => {
      var config = {
        fs: 'MountableFileSystem',
        options: {
          '/': {
            fs: 'InMemory'
          }
        }
      }
      var tfs
      await new Promise(resolve => {
        BrowserFS.configure(config, (e) => {
          if (e) throw e
          tfs = pify(BrowserFS.BFSRequire('fs'))
          resolve()
        })
      })
      ocopy(tfs, ExtraFS)
      await tfs.mkdirp(`/BLOCKTREE/guld/ledger/GULD/.git`)
      chai.assert.isTrue(Array.isArray(await tfs.readdir('/BLOCKTREE')))
      chai.assert.isTrue(Array.isArray(await tfs.readdir('/BLOCKTREE/')))
      chai.assert.isTrue(Array.isArray(await tfs.readdir('/BLOCKTREE/guld')))
      chai.assert.isTrue(Array.isArray(await tfs.readdir('/BLOCKTREE/guld/ledger')))
      chai.assert.isTrue(Array.isArray(await tfs.readdir('/BLOCKTREE/guld/ledger/GULD')))
    })
  })
  describe('cpr', () => {
    it('copies file out of BrowserFS root', async () => {
      var config = {
        fs: 'MountableFileSystem',
        options: {
          '/': {
            fs: 'InMemory'
          },
          '/BLOCKTREE': {
            fs: 'InMemory'
          },
          '/BLOCKTREE/guld': {
            fs: 'ZipFS',
            options: {
              'zipData': this.zipData,
              filename: '/BLOCKTREE/guld'
            }
          }
        }
      }
      var tfs
      await new Promise(resolve => {
        BrowserFS.configure(config, (e) => {
          if (e) throw e
          tfs = pify(BrowserFS.BFSRequire('fs'))
          resolve()
        })
      })
      ocopy(tfs, SupplimentFS)
      ocopy(tfs, ExtraFS)
      var list = await tfs.readdir('/BLOCKTREE/guld/ledger')
      chai.assert.equal(list.length, 3)
      await tfs.cpr(`/BLOCKTREE/guld`, `/BLOCKTREE/pokerface`)
      list = await tfs.readdir('/BLOCKTREE/guld/ledger')
      chai.assert.equal(list.length, 3)
      list = await tfs.readdir('/BLOCKTREE')
      chai.assert.equal(list.length, 2)
      list = await tfs.readdir('/BLOCKTREE/pokerface/ledger')
      chai.assert.equal(list.length, 3)
    }).timeout(90000)
  })
})

describe('SupplimentFS', function () {
  describe('custom fs class', function () {
    before(async () => {
      await nodefs.writeFile('/tmp/tmp.txt', 'hello world')
    })
    it('can copy a file with this.*File', async () => {
      var tfs = {
        readFile: nodefs.readFile,
        writeFile: nodefs.writeFile,
        copyFile: SupplimentFS.copyFile
      }
      await tfs.copyFile('/tmp/tmp.txt', '/tmp/tmp.copy', 'utf8')
      var content = await tfs.readFile('/tmp/tmp.txt', 'utf8')
      chai.assert.equal(content, 'hello world')
      content = await tfs.readFile('/tmp/tmp.copy', 'utf8')
      chai.assert.equal(content, 'hello world')
    })
    it('can bootstrap functions from fs global', async () => {
      global.fs = nodefs
      await SupplimentFS.copyFile('/tmp/tmp.txt', '/tmp/tmp.copy2', 'utf8')
      var content = await SupplimentFS.readFile('/tmp/tmp.copy2', 'utf8')
      chai.assert.equal(content, 'hello world')
      delete global.fs
    })
  })
})

// describe('prefix', () => {
//  it('sees files already in new root', async () => {
//    var content = await this.fs.readFile('/tmp.txt', 'utf8')
//    chai.assert.equal(content, 'hello world')
//  })
//  it('cannot see outside files', async () => {
//    var content
//    try {
//      content = await this.fs.readFile('/tmp/tmp.txt', 'utf8')
//      chai.assert.fail('should have thrown an error')
//    } catch (e) {
//      chai.assert.equal(content, undefined)
//    }
//  })
//  it('can write files', async () => {
//    await this.fs.writeFile('/tmp2.txt', 'hello world', {'encoding': 'utf8'})
//    var contents = await nodefs.readFile(`${prefix}/tmp2.txt`, 'utf8')
//    chai.assert.equal(contents, 'hello world')
//  })
// })
