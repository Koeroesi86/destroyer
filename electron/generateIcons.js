const { execSync } = require('child_process')
const { resolve } = require('path')

const isWin = process.platform === 'win32'

module.exports = () => {
  const command = resolve(__dirname, `../node_modules/.bin/electron-icon-maker${isWin ? '.cmd' : ''}`).replace(/\\/g, '/')
  const cmd = `${command} --input="${resolve(__dirname, '../assets/icon.png').replace(/\\/g, '/')}" --output="${resolve(__dirname, '../')}"`
  console.log(cmd)
  execSync(cmd)
}
