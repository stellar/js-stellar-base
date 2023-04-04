var webpackConfig = require('./webpack.config.browser.js');
delete webpackConfig.output;
webpackConfig.entry = {}; // karma fills these in
webpackConfig.plugins.shift(); // drop eslinter plugin

module.exports = function (config) {
  config.set({
    frameworks: ['mocha', 'sinon-chai'],
    browsers: ['FirefoxHeadless', 'ChromeHeadless'],

    files: [
      '../dist/stellar-base.js', // webpack should build this first
      '../test/unit/**/*.js'
    ],

    preprocessors: {
      '../test/unit/**/*.js': ['webpack']
    },

    webpack: webpackConfig,
    webpackMiddleware: {
      noInfo: true
    },

    colors: true,
    singleRun: true,

    reporters: ['dots', 'coverage'],
    coverageReporter: {
      type: 'text-summary',
      instrumenterOptions: {
        istanbul: { noCompact: true }
      }
    }
  });
};
