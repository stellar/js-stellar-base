var webpackConfig = require('./webpack.config.browser.js');
delete webpackConfig.output;
webpackConfig.entry = {}; // karma fills these in

module.exports = function(config) {
  var customLaunchers = {
    sl_chrome: {
      base: 'SauceLabs',
      browserName: 'chrome',
      platform: 'Windows 8.1',
      version: '49'
    },
    sl_firefox: {
      base: 'SauceLabs',
      browserName: 'firefox',
      platform: 'Windows 8.1',
      version: '44'
    },
    sl_ie_11: {
      base: 'SauceLabs',
      browserName: 'internet explorer',
      platform: 'Windows 8.1',
      version: 'latest'
    }
  };

  config.set({
    sauceLabs: {
      testName: 'js-stellar-base',
      recordScreenshots: false,
      recordVideo: false
    },
    frameworks: ['mocha', 'sinon-chai'],
    customLaunchers: customLaunchers,
    browsers: Object.keys(customLaunchers),

    files: ['../dist/stellar-base.min.js', '../test/unit/**/*.js'],

    preprocessors: {
      '../test/unit/**/*.js': ['webpack']
    },

    webpack: webpackConfig,
    webpackMiddleware: {
      noInfo: true
    },

    singleRun: true,

    reporters: ['dots', 'saucelabs']
  });
};
