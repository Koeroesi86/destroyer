const { execSync } = require('child_process')

const isWin = process.platform === 'win32'

if (isWin) {
  console.log('Fixing dependencies for Windows')
  execSync(
    'electron-builder install-app-deps',
    {
      shell: true,
      env: process.env,
      stdio: 'inherit'
    }
  )
}
