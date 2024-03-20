var path = require('path');
var webpack = require('webpack');

var ESLintPlugin = require('eslint-webpack-plugin');
var TerserPlugin = require('terser-webpack-plugin');
var NodePolyfillPlugin = require('node-polyfill-webpack-plugin');

const config = {
  target: 'web',
  // https://stackoverflow.com/a/34018909
  entry: {
    'stellar-base': path.resolve(__dirname, '../src/index.js'),
    'stellar-base.min': path.resolve(__dirname, '../src/index.js')
  },
  resolve: {
    fallback: {
      stream: require.resolve('stream-browserify'),
      buffer: require.resolve('buffer')
    },
    extensions: ['.ts', '.js']
  },
  output: {
    clean: true,
    library: 'StellarBase',
    path: path.resolve(__dirname, '../dist')
  },
  mode: process.env.NODE_ENV ?? 'development',
  devtool: process.env.NODE_ENV === 'production' ? false : 'source-map',
  module: {
    rules: [
      {
        test: /\.m?js$/,
        exclude: /node_modules/,
        use: {
          loader: 'babel-loader',
          options: {
            cacheDirectory: true
          }
        }
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
      Buffer: [path.resolve(__dirname, 'buffer.js'), 'default']
    })
  ],
  watchOptions: {
    ignored: /(node_modules|coverage|lib|dist)/
  }
};

module.exports = config;
