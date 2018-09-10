const baseConfig = require('./webpack.config.base')

const prodConfig = Object.assign({}, baseConfig, {
  optimization: {
    minimize: true
  }
})

module.exports = prodConfig
