const { execSync } = require('child_process')
const { resolve } = require('path')
const fs = require('fs')
const rimraf = require('rimraf')

const isWin = process.platform === 'win32'
const cwd = resolve(__dirname, '../')

const bundlePath = resolve(cwd, './build')
if (fs.existsSync(bundlePath)) {
  rimraf.sync(bundlePath)
  console.log('Removed previous build.')
}

const command = resolve(__dirname, `../node_modules/.bin/electron-icon-maker${isWin ? '.cmd' : ''}`).replace(/\\/g, '/')
const cmd = `${command} --input="${resolve(__dirname, '../assets/icon.png').replace(/\\/g, '/')}" --output="${resolve(__dirname, '../')}"`
console.log(cmd)
execSync(cmd, { cwd, stdio: 'inherit' })
console.log('Generated app icons.')
