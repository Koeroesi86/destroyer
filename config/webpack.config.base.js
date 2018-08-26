const path = require('path')
const webpack = require('webpack')
const StaticSiteGeneratorPlugin = require('static-site-generator-webpack-plugin')
const appConfig = require('./appConfig')

const config = {
  entry: {
    client: path.resolve(__dirname, '../client/app.js'),
    htmlGenerator: path.resolve(__dirname, '../client/htmlGenerator.js')
  },
  output: {
    pathinfo: true,
    libraryTarget: 'umd',
    path: path.resolve(__dirname, '../bundle'),
    publicPath: './',
    globalObject: 'this',
    filename: '[name].js'
  },
  target: 'electron-renderer',
  module: {
    rules: [
      {
        test: /\.(js|jsx)$/,
        exclude: /node_modules/,
        loader: 'babel-loader',
        query: {
          cacheDirectory: true
        }
      },
      {
        test: /\.(svg|png|jpg|webm|mp4|woff|woff2)$/,
        loader: 'url-loader'
      },
      {
        test: /\.scss$/,
        use: [
          {
            loader: 'style-loader' // creates style nodes from JS strings
          },
          {
            loader: 'css-loader', // translates CSS into CommonJS
            options: {
              modules: true,
              importLoaders: 1,
              localIdentName: (process.env.NODE_ENV === 'production' ? '[sha1:hash:hex:4]' : '[path][name]__[local]--[hash:base64:5]')
            }
          },
          {
            loader: 'sass-loader' // compiles Sass to CSS
          }
        ]
      }
    ]
  },
  resolve: {
    extensions: ['.js', '.jsx']
  },
  plugins: [
    // new webpack.EnvironmentPlugin(['NODE_ENV']),
    new StaticSiteGeneratorPlugin({
      entry: 'htmlGenerator',
      paths: appConfig.paths,
      locals: appConfig.locals
    })
  ]
}

if (process.env.NODE_ENV === 'production') {
  config.plugins.push(
    new webpack.optimize.UglifyJsPlugin({
      comments: false
    })
  )
}

module.exports = config
