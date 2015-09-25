module.exports = function(config) {
  var customLaunchers = {
    sl_chrome: {
      base: 'SauceLabs',
      browserName: 'chrome',
      version: '44'
    },
    sl_firefox: {
      base: 'SauceLabs',
      browserName: 'firefox',
      version: '39'
    },
    sl_ie_11: {
      base: 'SauceLabs',
      browserName: 'internet explorer',
      version: '11'
    }
  };

  config.set({
    sauceLabs: {
      testName: 'js-stellar-base',
      recordScreenshots: false,
      recordVideo: false
    },

    browserDisconnectTimeout : 10000,
    browserDisconnectTolerance : 1,
    browserNoActivityTimeout : 4*60*1000,
    captureTimeout : 4*60*1000,

    frameworks: ['mocha', 'sinon-chai'],
    customLaunchers: customLaunchers,
    browsers: Object.keys(customLaunchers),

    files: [
      'dist/stellar-base.min.js',
      'test/unit/**/*.js'
    ],

    preprocessors: {
      'test/unit/**/*.js': ['webpack']
    },

    webpack: {
      module: {
        loaders: [
          { test: /\.js$/, exclude: /node_modules/, loader: 'babel-loader'}
        ]
      }
    },

    webpackMiddleware: {
      noInfo: true
    },

    singleRun: true,

    reporters: ['dots', 'saucelabs']
  });
};
