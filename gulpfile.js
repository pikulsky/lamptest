var gulp = require('gulp');
var gutil = require('gulp-util');
var phonegapBuild = require('gulp-phonegap-build');
var del = require('del');
var merge = require('merge-stream');
var process = require('process');

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
