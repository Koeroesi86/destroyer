const { execSync } = require('child_process')
const { resolve } = require('path')
const webpack = require('webpack')
const webpackConfig = require('../config/webpack.config.prod')

const cwd = resolve(__dirname, '../')

console.log('Prebuild started...')
execSync(`yarn prebuild`, { cwd, stdio: 'inherit' })

process.env.NODE_ENV = 'production'

console.log('Build started...')
const compiler = webpack(webpackConfig)
compiler.run((err, stats) => {
  if (err) {
    console.error(err)
  }
  console.log(stats.toString({
    chunks: false,
    colors: true
  }))
})
