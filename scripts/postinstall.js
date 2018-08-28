const { execSync } = require('child_process')

const isWin = process.platform === 'win32'

console.log('Fixing compiled dependencies')
execSync(
  'electron-builder install-app-deps',
  {
    shell: true,
    env: Object.assign({}, process.env),
    stdio: 'inherit'
  }
)
