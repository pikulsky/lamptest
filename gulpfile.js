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
var http = require('http');
var fs = require('fs');
var iconv = require('iconv-lite');

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
        android: 'build/net.pcholnick.lamptest.apk'
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

gulp.task('update-db', function (done) {
  // Download lamps CSV file
  http.get('http://lamptest.ru/led.csv', function(response) {
    var chunks = [];
    response.on('data', function (chunk) {
      chunks.push(chunk);
    });
    response.on('end', function () {
      var csv = iconv.decode(Buffer.concat(chunks), 'win1251');
      var lines = csv.match(/[^\r\n]+/g);
      var lampsJson = [];

      for (var i = 1; i < lines.length; i++) {
        var values = lines[i].split(';');

        lampsJson.push({
          id: values[0],
          brand: values[1],
          model: values[2],
          P: values[3],
          link: values[4],
          prop5: values[5],
          price_rur: values[6],
          price_usd: values[7],
          upc: values[8],
          diameter: values[9],
          height: values[10],
          voltage: values[11],
          base_type: values[12],
          class: values[13],
          type: values[14],
          subtype: values[15],
          matte: values[16],
          lm: values[17],
          ekv: values[18],
          color: values[19],
          cri: values[20],
          age: values[21],
          p: values[22],
          dimmer_support: values[24],
          switch_indicator_support: values[25],
          measured: {
            P: values[26],
            lm: values[27],
            ekv: values[28],
            color: values[29],
            colorRange: values[30],
            angle: values[32],
            pulsation: values[33]
          },
          test_date: values[35],
          rating: values[36],
          relevant: values[39]
        });
      }

      lampsJson = lampsJson.sort(function (a, b) {
        var first = a.brand.toUpperCase() + a.model.toUpperCase();
        var second = b.brand.toUpperCase() + b.model.toUpperCase();
        if (first < second) {
          return -1;
        }

        if (first > second) {
          return 1;
        }

        return 0;
      });

      fs.writeFile('./www/js/data.js', 'var data = ' + JSON.stringify(lampsJson) + ';', function(err) {
        if(err) {
          return console.log(err);
        }

        done();
      });
    });
  });
});
