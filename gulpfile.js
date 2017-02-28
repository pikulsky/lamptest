let gulp = require('gulp');
let livereload = require('gulp-livereload');
let gutil = require('gulp-util');
let sequence = require('gulp-sequence');
let phonegapBuild = require('gulp-phonegap-build');
let del = require('del');
let merge = require('merge-stream');
let process = require('process');
let express = require('express');
let connectLr = require('connect-livereload');
let http = require('http');
let fs = require('fs');
let iconv = require('iconv-lite');

let config = require('./gulp.config.local.js');

gulp.task('default', ['phonegap-build-android']);

gulp.task('clean', function(done) {
  del.sync([
    'build/*'
  ]);
  done();
});

gulp.task('assemble-assets', ['clean'], function() {
  let configCopy = gulp.src('config.xml')
    .pipe(gulp.dest('build/www'));

  let srcCopy = gulp.src('www/**/*')
    .pipe(gulp.dest('build/www'));

  let resourcesCopy = gulp.src('resources/**/*')
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
    let chunks = [];
    response.on('data', function (chunk) {
      chunks.push(chunk);
    });
    response.on('end', function () {
      let csv = iconv.decode(Buffer.concat(chunks), 'win1251');
      let lines = csv.match(/[^\r\n]+/g);
      let lampsArray = [];

      for (let i = 1; i < lines.length; i++) {
        let values = lines[i].split(';');

        // Skip lamps without UPC
        if (!values[8]) {
          continue;
        }

        lampsArray.push({
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
          weight: values[11],
          voltage: values[12],
          base_type: values[13],
          class: values[14],
          type: values[15],
          subtype: values[16],
          matte: values[17],
          lm: values[18],
          ekvP: values[19],
          color: values[20],
          ra: values[21],
          age: values[22],
          warranty: values[23],
          manufacture_date: values[24],
          dimmer_support: values[25],
          switch_indicator_support: values[26],
          measured: {
            P: values[27],
            lm: values[28],
            ekvP: values[29],
            color: values[30],
            cri: values[31],
            cqs: values[32],
            r9: values[33],
            angle: values[34],
            pulsation: values[35],
            pf: values[36]
          },
          test_date: values[37],
          rating: values[38],
          min_voltage: values[39],
          driver: values[40],
          temp_max: values[41],
          relevant: values[42]
        });
      }

      lampsArray = lampsArray.sort(function (a, b) {
        let first = a.brand.toUpperCase() + a.model.toUpperCase();
        let second = b.brand.toUpperCase() + b.model.toUpperCase();
        if (first < second) {
          return -1;
        }

        if (first > second) {
          return 1;
        }

        return 0;
      });

      let lampsJson = {};
      for (let i = 1; i < lampsArray.length; i++) {
        let upc = lampsArray[i].upc;
        if (!lampsJson[upc]) {
          lampsJson[upc] = [];
        }
        else {
          console.log('Duplicate UPC: ' + upc);
        }
        lampsJson[upc].push(lampsArray[i]);
      }

      fs.writeFile('./src/assets/data.js', 'var data = ' + JSON.stringify(lampsJson) + ';', function(err) {
        if(err) {
          return console.log(err);
        }

        done();
      });
    });
  });
});
