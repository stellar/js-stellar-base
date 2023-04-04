var webpack = require('webpack');
var NodePolyfillPlugin = require('node-polyfill-webpack-plugin');

var baseConfig = require('./webpack.config.js');

delete baseConfig.entry['stellar-base.min'];
baseConfig.output.clean = false;
baseConfig.optimization = {};
baseConfig.plugins = [
  // Ignore native modules (sodium-native)
  new webpack.IgnorePlugin({ resourceRegExp: /sodium-native/ }),
  new NodePolyfillPlugin(),
  new webpack.ProvidePlugin({
    Buffer: ['buffer', 'Buffer']
  })
];

module.exports = baseConfig;
