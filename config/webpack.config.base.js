const path = require('path')
const webpack = require('webpack')
const StaticSiteGeneratorPlugin = require('static-site-generator-webpack-plugin')
const MiniCssExtractPlugin = require('mini-css-extract-plugin')
const appConfig = require('./appConfig')

function recursiveIssuer (m) {
  if (m.issuer) {
    return recursiveIssuer(m.issuer)
  } else {
    for (let chunk of m._chunks) {
      return chunk['name']
    }
    return false
  }
}

const config = {
  mode: 'production',
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
      // {
      //   test: /\.(svg|png|jpg|webm|mp4|woff|woff2|ttf|eot)$/,
      //   loader: 'url-loader'
      // },
      // fonts/fonts/components/player-home/fonts/fonts/open-sans-regular.woff2
      // http://localhost:3000/assets/components/player-home/fonts/fonts/open-sans-regular.woff2
      {
        test: /\.(woff(2)?|ttf|eot)$/,
        use: [{
          loader: 'file-loader',
          options: {
            name: '[name]-[hash].[ext]',
            useRelativePath: true,
            outputPath: 'bundle/',
            publicPath: 'fonts/'
          }
        }]
      },
      {
        test: /\.(svg|png|jpg|webm|mp4)$/,
        loader: 'file-loader',
        options: {
          name: '[name]-[hash].[ext]',
          useRelativePath: true,
          outputPath: 'bundle/',
          publicPath: 'assets/'
        }
      },
      {
        test: /\.scss$/,
        use: [
          {
            loader: 'style-loader', // creates style nodes from JS strings
            options: {
              // sourceMap: process.env.NODE_ENV !== 'production'
              singleton: true
            }
          },
          // {
          //   loader: MiniCssExtractPlugin.loader,
          //   options: {
          //     // you can specify a publicPath here
          //     // by default it use publicPath in webpackOptions.output
          //     // publicPath: '../'
          //   }
          // },
          {
            loader: 'css-loader', // translates CSS into CommonJS
            options: {
              modules: true,
              importLoaders: 1,
              localIdentName: (process.env.NODE_ENV === 'production' ? '[sha1:hash:hex:4]' : '[name]__[local]')
              // localIdentName: '[sha1:hash:hex:4]'
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
  // optimization: {
  //   splitChunks: {
  //     cacheGroups: {
  //       clientStyles: {
  //         name: 'clientStyle',
  //         test: (m, c, entry = 'client') => m.constructor.name === 'CssModule' && recursiveIssuer(m) === entry,
  //         chunks: 'all',
  //         enforce: true
  //       },
  //       htmlGeneratorStyles: {
  //         name: 'htmlGeneratorStyle',
  //         test: (m, c, entry = 'htmlGenerator') => m.constructor.name === 'CssModule' && recursiveIssuer(m) === entry,
  //         chunks: 'all',
  //         enforce: true
  //       }
  //     }
  //   }
  // },
  plugins: [
    // new webpack.EnvironmentPlugin(['NODE_ENV']),
    // new MiniCssExtractPlugin({
    //   chunkFilename: '[id].css',
    //   filename: '[name].css'
    // }),
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
