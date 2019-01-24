/* eslint-disable arrow-body-style */

const path = require('path');
const gulp = require('gulp');
const isparta = require('isparta');
const plugins = require('gulp-load-plugins')();
const runSequence = require('run-sequence');
const webpack = require('webpack');
const clear = require('clear');
const karma = require('karma');

gulp.task('default', ['build']);

gulp.task('lint:src', () => {
  return gulp
    .src(['src/**/*.js'])
    .pipe(plugins.eslint())
    .pipe(plugins.eslint.format())
    .pipe(plugins.eslint.failAfterError());
});

// Lint our test code
gulp.task('lint:test', () => {
  return gulp
    .src(['test/unit/**/*.js'])
    .pipe(plugins.eslint())
    .pipe(plugins.eslint.format())
    .pipe(plugins.eslint.failAfterError());
});

// this task doesn't fail on error so it doesn't break a watch loop
gulp.task('lint-for-watcher:src', () => {
  clear();
  return gulp
    .src(['src/**/*.js'])
    .pipe(plugins.eslint())
    .pipe(plugins.eslint.format());
});

gulp.task('lint:watch', ['lint-for-watcher:src'], () => {
  gulp.watch('src/**/*', ['lint-for-watcher:src']);
});

gulp.task('build', (done) => {
  runSequence('clean', 'build:node', 'build:browser', done);
});

gulp.task('test', (done) => {
  runSequence('clean', 'test:node', 'test:browser', done);
});

gulp.task('hooks:precommit', ['build'], () => {
  return gulp.src(['dist/*', 'lib/*']).pipe(plugins.git.add());
});

gulp.task('build:node', ['lint:src'], () => {
  return gulp
    .src('src/**/*.js')
    .pipe(plugins.babel())
    .pipe(gulp.dest('lib'));
});

gulp.task('build:browser', ['lint:src'], () => {
  return gulp
    .src('src/browser.js')
    .pipe(
      plugins.webpack({
        output: { library: 'StellarBase' },
        module: {
          loaders: [
            { test: /\.js$/, exclude: /node_modules/, loader: 'babel-loader' },
          ],
        },
        plugins: [
          // Ignore native modules (ed25519)
          new webpack.IgnorePlugin(/ed25519/),
        ],
      }),
    )
    .pipe(plugins.rename('stellar-base.js'))
    .pipe(gulp.dest('dist'))
    .pipe(
      plugins.uglify({
        output: {
          ascii_only: true,
        },
      }),
    )
    .pipe(plugins.rename('stellar-base.min.js'))
    .pipe(gulp.dest('dist'));
});

gulp.task('test:init-istanbul', ['clean-coverage'], () => {
  return gulp
    .src(['src/**/*.js'])
    .pipe(
      plugins.istanbul({
        instrumenter: isparta.Instrumenter,
      }),
    )
    .pipe(plugins.istanbul.hookRequire());
});

gulp.task('test:node', ['build:node', 'test:init-istanbul'], () => {
  return gulp
    .src(['test/test-helper.js', 'test/unit/**/*.js'])
    .pipe(
      plugins.mocha({
        reporter: ['dot'],
      }),
    )
    .pipe(plugins.istanbul.writeReports());
});

gulp.task('test:browser', ['build:browser'], (done) => {
  const Server = karma.Server;
  const s = new Server({ configFile: path.join(__dirname, '/karma.conf.js') });
  s.start(() => {
    done();
  });
});

gulp.task('test:sauce', ['build:browser'], (done) => {
  const Server = karma.Server;
  const s = new Server({
    configFile: path.join(__dirname, '/karma-sauce.conf.js'),
  });
  s.start(() => {
    done();
  });
});

gulp.task('clean', () => {
  return gulp.src(['dist', 'lib'], { read: false }).pipe(plugins.rimraf());
});

gulp.task('watch', ['build'], () => {
  gulp.watch('lib/**/*', ['build']);
});

gulp.task('clean-coverage', () => {
  return gulp.src(['coverage'], { read: false }).pipe(plugins.rimraf());
});

gulp.task('submit-coverage', () => {
  return gulp.src('./coverage/**/lcov.info').pipe(plugins.coveralls());
});
