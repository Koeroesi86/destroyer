const { resolve } = require('path')
const rimraf = require('rimraf')
const fs = require('fs')
const electronBuilder = require('electron-builder')

const cwd = resolve(__dirname, '../')

console.log('Packaging started...')

const isWin = process.platform === 'win32'
const isMac = process.platform === 'darwin'
const isLinux = process.platform === 'linux'

// process.env.DEBUG = 'electron-builder' // TODO: find another way to log
// process.env.NODE_OPTIONS = '--max-old-space-size=2048'

const distPath = resolve(cwd, './dist')
if (fs.existsSync(distPath)) {
  rimraf.sync(distPath)
  console.log('Removed previous build.')
}

if (isWin) {
  electronBuilder
    .build({
      platform: 'windows'
    })
    .then(() => {
      console.log('Windows package created.')
      process.exit(0)
    })
}

if (isMac) {
  electronBuilder
    .build({
      platform: 'darwin'
    })
    .then(() => {
      console.log('Mac OS package created.')
      process.exit(0)
    })
}

if (isLinux) {
  electronBuilder
    .build({
      platform: 'linux'
    })
    .then(() => {
      console.log('Linux package created.')
      process.exit(0)
    })
}
