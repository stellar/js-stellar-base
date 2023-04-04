var path = require('path');
var webpack = require('webpack');

var ESLintPlugin = require('eslint-webpack-plugin');
var TerserPlugin = require('terser-webpack-plugin');
var NodePolyfillPlugin = require('node-polyfill-webpack-plugin');

const config = {
  entry: {
    'stellar-base': path.resolve(__dirname, '../src/index.js'),
    'stellar-base.min': path.resolve(__dirname, '../src/index.js')
  },
  resolve: {
    fallback: {
      crypto: require.resolve('crypto-browserify'),
      stream: require.resolve('stream-browserify'),
      buffer: require.resolve('buffer')
    }
  },
  output: {
    clean: true,
    library: 'StellarBase',
    path: path.resolve(__dirname, '../dist')
  },
  mode: process.env.NODE_ENV,
  devtool: process.env.NODE_ENV === 'production' ? false : 'inline-source-map',
  module: {
    rules: [
      {
        test: /\.js$/,
        exclude: /node_modules/,
        use: ['babel-loader']
      },
      {
        test: /\.js$/,
        exclude: /node_modules\/(?!(crc)\/).*/,
        loader: 'babel-loader'
      }
    ]
  },
  optimization: {
    minimize: true,
    minimizer: [
      new TerserPlugin({
        include: /\.min\.js$/,
        terserOptions: {
          format: {
            ascii_only: true
          }
        }
      })
    ]
  },
  plugins: [
    // this must be first for karma to work (see line 5 of karma.conf.js)
    new ESLintPlugin({
      overrideConfigFile: path.resolve(__dirname, './.eslintrc.js')
    }),
    // Ignore native modules (sodium-native)
    new webpack.IgnorePlugin({ resourceRegExp: /sodium-native/ }),
    new NodePolyfillPlugin(),
    new webpack.ProvidePlugin({
      Buffer: ['buffer', 'Buffer']
    })
  ],
  watchOptions: {
    ignored: /(node_modules|coverage)/
  }
};

module.exports = config;
