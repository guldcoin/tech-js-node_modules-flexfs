/* global describe:false it:false before:false */
const chai = require('chai')
const pify = require('pify')
const nodefs = pify(require('fs'))
const { flexfs, readOrFetch } = require('./flexfs.js')
const prefix = require('os').tmpdir()
let zipdata
const BrowserFS = require('browserfs')
const Buffer = require('buffer/').Buffer

describe('passthrough', function () {
  describe('no-prefix', function () {
    var config = {
      'fs': nodefs
    }
    before(async () => {
      this.fs = await flexfs(config)
      await nodefs.writeFile('/tmp/tmp.txt', 'hello world')
    })
    it('sees existing files', async () => {
      var content = await this.fs.readFile('/tmp/tmp.txt', 'utf8')
      chai.assert.equal(content, 'hello world')
    })
  })
  describe('prefix', function () {
    var config = {
      'fs': nodefs,
      'prefix': prefix
    }
    before(async () => {
      this.fs = await flexfs(config)
    })
    it('sees files already in new root', async () => {
      var content = await this.fs.readFile('/tmp.txt', 'utf8')
      chai.assert.equal(content, 'hello world')
    })
    it('cannot see outside files', async () => {
      var content
      try {
        content = await this.fs.readFile('/tmp/tmp.txt', 'utf8')
        chai.assert.fail('should have thrown an error')
      } catch (e) {
        chai.assert.equal(content, undefined)
      }
    })
    it('can write files', async () => {
      await this.fs.writeFile('/tmp2.txt', 'hello world', {'encoding': 'utf8'})
      var contents = await nodefs.readFile(`${prefix}/tmp2.txt`, 'utf8')
      chai.assert.equal(contents, 'hello world')
    })
  })
  describe('readOrFetch', () => {
    it('gets the test fixture', async () => {
      var data = await readOrFetch('./fixtures/guld.zip')
      chai.assert.exists(data)
      zipdata = new Buffer(data)
    })
  })
  describe('zip', () => {
    it('sees files already in new root', async () => {
      this.fs = await pify(BrowserFS.FileSystem.ZipFS.Create)({
        zipData: zipdata,
        filename: '/'
      })
      this.fs = await flexfs({fs: this.fs})
      var list = await this.fs.readdir('/ledger')
      chai.assert.equal(list.length, 3)
    })
    it('copies file out of hybrid root', async () => {
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
              'zipData': zipdata,
              filename: '/BLOCKTREE/guld'
            }
          }
        }
      }
      this.fs = await flexfs(config)
      var list = await this.fs.readdir('/BLOCKTREE/guld/ledger')
      chai.assert.equal(list.length, 3)
      await this.fs.cpr(`/BLOCKTREE/guld`, `/BLOCKTREE/pokerface`)
      list = await this.fs.readdir('/BLOCKTREE/guld/ledger')
      chai.assert.equal(list.length, 3)
      list = await this.fs.readdir('/BLOCKTREE')
      chai.assert.equal(list.length, 2)
      list = await this.fs.readdir('/BLOCKTREE/pokerface/ledger')
      chai.assert.equal(list.length, 3)
    }).timeout(600000)
  })
})
