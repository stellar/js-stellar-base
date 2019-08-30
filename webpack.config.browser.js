const webpack = require('webpack');

module.exports = {
  output: { library: 'StellarBase' },
  mode: 'development',
  module: {
    rules: [
      { test: /\.js$/, exclude: /node_modules/, loader: 'babel-loader' },
      {
        test: /\.js$/,
        exclude: /node_modules\/(?!(crc)\/).*/,
        loader: 'babel-loader'
      }
    ]
  },
  plugins: [
    // Ignore native modules (sodium-native)
    new webpack.IgnorePlugin(/sodium-native/)
  ]
};
