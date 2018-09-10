const { execSync } = require('child_process')
const { resolve } = require('path')
const electronBuilder = require('electron-builder')

const cwd = resolve(__dirname, '../')

execSync('rm -r dist || true', { cwd, stdio: 'inherit' })

console.log('Packaging started...')

const isWin = process.platform === 'win32'
const isMac = process.platform === 'darwin'

process.env.DEBUG = 'electron-builder' // TODO: find another way to log

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
      platform: 'macos'
    })
    .then(() => {
      console.log('Mac OS package created.')
      process.exit(0)
    })
}
