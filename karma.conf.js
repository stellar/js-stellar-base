var webpackConfig = require('./webpack.config.browser.js');
delete webpackConfig.plugins;
delete webpackConfig.output;

module.exports = function(config) {
  config.set({
    frameworks: ['mocha', 'sinon-chai'],
    browsers: ['Firefox'],

    files: ['dist/stellar-base.js', 'test/unit/**/*.js'],

    preprocessors: {
      'test/unit/**/*.js': ['webpack']
    },

    webpack: webpackConfig,

    webpackMiddleware: {
      noInfo: true
    },

    singleRun: true,

    reporters: ['dots']
  });
};
