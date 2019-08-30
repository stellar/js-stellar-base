'use strict';

var gulp = require('gulp');
var isparta = require('isparta');
var plugins = require('gulp-load-plugins')();
var coveralls = require('@kollavarsham/gulp-coveralls');
var clear = require('clear');
var webpackConfigBrowser = require('./webpack.config.browser.js');
var webpack = require('webpack-stream');
var del = require('del');

gulp.task('lint:src', function lintSrc() {
  return gulp
    .src(['src/**/*.js'])
    .pipe(plugins.eslint())
    .pipe(plugins.eslint.format())
    .pipe(plugins.eslint.failAfterError());
});

// Lint our test code
gulp.task('lint:test', function lintTest() {
  return gulp
    .src(['test/unit/**/*.js'])
    .pipe(plugins.eslint())
    .pipe(plugins.eslint.format())
    .pipe(plugins.eslint.failAfterError());
});

gulp.task(
  'build:node',
  gulp.series('lint:src', function buildNode() {
    return gulp
      .src('src/**/*.js')
      .pipe(plugins.babel())
      .pipe(gulp.dest('lib'));
  })
);

gulp.task(
  'build:browser',
  gulp.series('lint:src', function buildNode() {
    return gulp
      .src('src/browser.js')
      .pipe(webpack(webpackConfigBrowser))
      .pipe(plugins.rename('stellar-base.js'))
      .pipe(gulp.dest('dist'))
      .pipe(
        plugins.uglify({
          output: {
            ascii_only: true
          }
        })
      )
      .pipe(plugins.rename('stellar-base.min.js'))
      .pipe(gulp.dest('dist'));
  })
);

gulp.task('clean-coverage', function cleanCoverage() {
  return del(['coverage/']);
});

gulp.task(
  'test:init-istanbul',
  gulp.series('clean-coverage', function testInitIstanbul() {
    return gulp
      .src(['src/**/*.js'])
      .pipe(
        plugins.istanbul({
          instrumenter: isparta.Instrumenter
        })
      )
      .pipe(plugins.istanbul.hookRequire());
  })
);

gulp.task(
  'test:node',
  gulp.series('build:node', 'test:init-istanbul', function testNode() {
    return gulp
      .src(['test/test-helper.js', 'test/unit/**/*.js'])
      .pipe(
        plugins.mocha({
          reporter: ['dot']
        })
      )
      .pipe(plugins.istanbul.writeReports());
  })
);

gulp.task(
  'test:browser',
  gulp.series('build:browser', function testBrowser(done) {
    var Server = require('karma').Server;
    var server = new Server(
      { configFile: __dirname + '/karma.conf.js' },
      (exitCode) => {
        if (exitCode !== 0) {
          done(new Error(`Bad exit code ${exitCode}`));
        } else {
          done();
        }
      }
    );
    server.start();
  })
);

gulp.task(
  'test:sauce',
  gulp.series('build:browser', function testSauce(done) {
    var Server = require('karma').Server;
    var server = new Server(
      { configFile: __dirname + '/karma-sauce.conf.js' },
      (exitCode) => {
        if (exitCode !== 0) {
          done(new Error(`Bad exit code ${exitCode}`));
        } else {
          done();
        }
      }
    );
    server.start();
  })
);

gulp.task('clear-screen', function clearScreen(cb) {
  clear();
  cb();
});

gulp.task('clean', function clean() {
  return del(['dist/', 'lib/']);
});

gulp.task('build', gulp.series('clean', 'build:node', 'build:browser'));

gulp.task('test', gulp.series('clean', 'test:node', 'test:browser'));

gulp.task('default', gulp.series('build'));

gulp.task(
  'watch',
  gulp.series('build', function watch() {
    gulp.watch('src/**/*', ['clear-screen', 'build']);
  })
);

gulp.task('submit-coverage', function submitCoverage() {
  return gulp.src('./coverage/**/lcov.info').pipe(coveralls());
});
