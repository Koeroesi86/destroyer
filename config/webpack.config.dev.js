const baseConfig = require('./webpack.config.base')
const { resolve } = require('path')

const devConfig = Object.assign({}, baseConfig, {
  mode: 'development'
})

module.exports = devConfig
