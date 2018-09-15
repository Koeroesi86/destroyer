const webpack = require('webpack')
const webpackConfig = require('../config/webpack.config.prod')

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
