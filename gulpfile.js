'use strict';

var gulp = require('gulp');
var isparta = require('isparta');
var plugins = require('gulp-load-plugins')();
var runSequence = require('run-sequence');
var clear = require('clear');
var webpack = require('webpack');
var plumber = require('gulp-plumber');

gulp.task('default', ['build']);

gulp.task('lint:src', function() {
  return gulp
    .src(['src/**/*.js'])
    .pipe(plugins.eslint())
    .pipe(plugins.eslint.format())
    .pipe(plugins.eslint.failAfterError());
});

// Lint our test code
gulp.task('lint:test', function() {
  return gulp
    .src(['test/unit/**/*.js'])
    .pipe(plugins.eslint())
    .pipe(plugins.eslint.format())
    .pipe(plugins.eslint.failAfterError());
});

gulp.task('build', function(done) {
  runSequence('clean', 'build:node', 'build:browser', done);
});

gulp.task('test', function(done) {
  runSequence('clean', 'test:node', 'test:browser', done);
});

gulp.task('hooks:precommit', ['build'], function() {
  return gulp.src(['dist/*', 'lib/*']).pipe(plugins.git.add());
});

gulp.task('build:node', ['lint:src'], function() {
  return gulp
    .src('src/**/*.js')
    .pipe(plugins.babel())
    .pipe(gulp.dest('lib'));
});

gulp.task('build:browser', ['lint:src'], function() {
  return gulp
    .src('src/browser.js')
    .pipe(
      plugins.webpack({
        output: { library: 'StellarBase' },
        module: {
          loaders: [
            { test: /\.js$/, exclude: /node_modules/, loader: 'babel-loader' }
          ]
        },
        plugins: [
          // Ignore native modules (ed25519)
          new webpack.IgnorePlugin(/ed25519/)
        ]
      })
    )
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
});

gulp.task('test:init-istanbul', ['clean-coverage'], function() {
  return gulp
    .src(['src/**/*.js'])
    .pipe(
      plugins.istanbul({
        instrumenter: isparta.Instrumenter
      })
    )
    .pipe(plugins.istanbul.hookRequire());
});

gulp.task('test:node', ['build:node', 'test:init-istanbul'], function() {
  return gulp
    .src(['test/test-helper.js', 'test/unit/**/*.js'])
    .pipe(
      plugins.mocha({
        reporter: ['dot']
      })
    )
    .pipe(plugins.istanbul.writeReports());
});

gulp.task('test:browser', ['build:browser'], function(done) {
  var Server = require('karma').Server;
  var server = new Server({ configFile: __dirname + '/karma.conf.js' });
  server.start(function() {
    done();
  });
});

gulp.task('test:sauce', ['build:browser'], function(done) {
  var Server = require('karma').Server;
  var server = new Server({ configFile: __dirname + '/karma-sauce.conf.js' });
  server.start(function() {
    done();
  });
});

gulp.task('clear-screen', function(cb) {
  clear();
  cb();
});

gulp.task('clean', function() {
  return gulp.src(['dist', 'lib'], { read: false }).pipe(plugins.rimraf());
});

gulp.task('watch', ['build'], function() {
  gulp.watch('src/**/*', ['clear-screen', 'build']);
});

gulp.task('clean-coverage', function() {
  return gulp.src(['coverage'], { read: false }).pipe(plugins.rimraf());
});

gulp.task('submit-coverage', function() {
  return gulp.src('./coverage/**/lcov.info').pipe(plugins.coveralls());
});
