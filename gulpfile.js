var gulp = require('gulp');
var livereload = require('gulp-livereload');
var gutil = require('gulp-util');
var sequence = require('gulp-sequence');
var phonegapBuild = require('gulp-phonegap-build');
var del = require('del');
var merge = require('merge-stream');
var process = require('process');
var express = require('express');
var connectLr = require('connect-livereload');

var config = require('./gulp.config.local.js');

gulp.task('default', ['phonegap-build-android']);

gulp.task('clean', function(done) {
  del.sync([
    'build/*'
  ]);
  done();
});

gulp.task('assemble-assets', ['clean'], function() {
  var configCopy = gulp.src('config.xml')
    .pipe(gulp.dest('build/www'));

  var srcCopy = gulp.src('www/**/*')
    .pipe(gulp.dest('build/www'));

  var resourcesCopy = gulp.src('resources/**/*')
    .pipe(gulp.dest('build/www/resources'));

  return merge(configCopy, srcCopy, resourcesCopy);
});

// Start local express server
gulp.task('serve', ['assemble-assets'], function () {
  express()
    .use(connectLr())
    .use(express.static('build/www'))
    .get('/cordova.js', function (req, res) {
      return res.status(200).send('// mocked cordova.js response to prevent 404 errors during development')
    })
    .listen(8100)
});

gulp.task('watch', ['serve'], function () {
  livereload.listen();
  return gulp.watch([
    'www/index.html'
    , 'www/css/**/*'
    , 'www/js/**/*'
    , 'www/templates/**/*'
  ], ['compile-reload']);
});

gulp.task('compile-reload', function() {
  return sequence('assemble-assets', 'reload')();
});

gulp.task('reload', function () {
  livereload.changed('project');
});

gulp.task('phonegap-build-android', ['assemble-assets'], function(done) {
  gulp.src('build/www/**/*')
    .pipe(phonegapBuild({
      appId: config.phonegapBuild.appId,
      user: config.phonegapBuild.user,
      keys: config.phonegapBuild.keys,
      download: {
        android: 'build/android.apk'
      }
    }))
    .on('pg-error', function(err) {
      gutil.log(err);
      process.exit(1);
    })
    .on('pg-sent', function() {
      done();
    });
});
