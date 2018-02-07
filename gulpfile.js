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

// require('./src/assets/data');


//console.log(require("typescript").transpile(require("fs").readFileSync("./src/models/lamp.ts").toString()));

//let Lamp = eval(require("typescript").transpile(require("fs").readFileSync("./src/models/lamp.ts").toString()));

// let z = new Lamp();
// z.init({});

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


const checkURL = function (url, countObj) {
  const options = {
    method: 'HEAD',
    host: 'lamptest.ru',
    path: url,
    timeout: 360000
  }
  http.get(options, function(response) {
    response.on('data', function (chunk) {
      // discard data if any
    });
    response.on('end', function () {
      if (response.statusCode !== 200 && response.statusCode !== 301) {
        console.log('On ' + countObj.total + ': Failed ' + response.statusCode + ' ' + url);
        process.exit();
      } else {
        countObj.total += 1;
        console.log('On ' + countObj.total + ': OK ' + response.statusCode);
      }
    });
  });
}


if (!String.prototype.padStart) {
  String.prototype.padStart = function padStart(targetLength,padString) {
      targetLength = targetLength>>0; //truncate if number or convert non-number to 0;
      padString = String((typeof padString !== 'undefined' ? padString : ' '));
      if (this.length > targetLength) {
          return String(this);
      }
      else {
          targetLength = targetLength-this.length;
          if (targetLength > padString.length) {
              padString += padString.repeat(targetLength/padString.length); //append to original to ensure we are longer than needed
          }
          return padString.slice(0,targetLength) + String(this);
      }
  };
}

const transliterate = function (str) {
  let cyr2latChars = [
    ['а', 'a'], ['б', 'b'], ['в', 'v'], ['г', 'g'],
    ['д', 'd'], ['е', 'e'], ['ё', 'yo'], ['ж', 'zh'], ['з', 'z'],
    ['и', 'i'], ['й', 'y'], ['к', 'k'], ['л', 'l'],
    ['м', 'm'], ['н', 'n'], ['о', 'o'], ['п', 'p'], ['р', 'r'],
    ['с', 's'], ['т', 't'], ['у', 'u'], ['ф', 'f'],
    ['х', 'kh'], ['ц', 'c'], ['ч', 'ch'], ['ш', 'sh'], ['щ', 'shch'],
    ['ъ', ''], ['ы', 'y'], ['ь', ''], ['э', 'e'], ['ю', 'iu'], ['я', 'ia'],

    ['А', 'A'], ['Б', 'B'], ['В', 'V'], ['Г', 'G'],
    ['Д', 'D'], ['Е', 'E'], ['Ё', 'YO'], ['Ж', 'ZH'], ['З', 'Z'],
    ['И', 'I'], ['Й', 'Y'], ['К', 'K'], ['Л', 'L'],
    ['М', 'M'], ['Н', 'N'], ['О', 'O'], ['П', 'P'], ['Р', 'R'],
    ['С', 'S'], ['Т', 'T'], ['У', 'U'], ['Ф', 'F'],
    ['Х', 'KH'], ['Ц', 'C'], ['Ч', 'CH'], ['Ш', 'SH'], ['Щ', 'SHCH'],
    ['Ъ', ''], ['Ы', 'Y'],
    ['Ь', ''],
    ['Э', 'E'],
    ['Ю', 'IU'],
    ['Я', 'IA']
  ];

  let newStr = '';

  for (let i = 0; i < str.length; i++) {
    let ch = str.charAt(i);
    let newCh = ch;

    for (let j = 0; j < cyr2latChars.length; j++) {
      if (ch === cyr2latChars[j][0]) {
        newCh = cyr2latChars[j][1];
      }
    }

    newStr += newCh;
  }

  return newStr;
}

const normalized = function (str) {
  const normalized = str
    .toLowerCase()
    .replace(/\//g, '-')
    .replace(/\s/g, '-')
    .replace(/&/g, '-')
    .replace(/[\s\/]+/g, '-')
  .replace(/=/g, '-')
    .replace(/[^*A-Za-zА-Яа-я0-9\-\_]/g, '');
  // .replace(/[&=\s\/]/g, '-')
    // .replace(/[^*A-Za-zА-Яа-я0-9\-\_]/g, '');
  return transliterate(normalized);
}


gulp.task('db2', function (done) {
  
  var data = JSON.parse(fs.readFileSync('./src/assets/data.json'));

  var lampCount = 0;
  var countObj = {
    total: lampCount
  }
  if (data) {
    //console.log(data);
    for (let upc in data) {
      if (data.hasOwnProperty(upc)) {

        for (let i = 0; i < data[upc].length; i++) {
          let lampData = data[upc][i];
          
          const normalizedId = lampData.id.padStart(5, '0');
          const normalizedModel = normalized(lampData.model);
          const normalizedBrand = normalized(lampData.brand);

          const parts = (lampData.brand === 'noname')
            ? [normalizedId, normalizedModel]
            : [normalizedId, normalizedBrand, normalizedModel];


          //const normalizedBrand = lampData.brand === 'noname' ? '' : normalized(lampData.brand);
          
          //const parts = [normalizedId, normalizedBrand, normalizedModel];
          const normalizedName = parts.join('-');

          //const normalizedName = normalizedId  + '-' + normalizedBrand + '-' + normalizedModel;
      
          const externalPageLink = 'http://lamptest.ru/review/' + normalizedName;
          const lampPhoto = 'http://lamptest.ru/images/photo/' + normalizedName + '.jpg';
          const lampGraph = 'http://lamptest.ru/images/graph/' + normalizedName + '.png';
          const lampCRIGraph = 'http://lamptest.ru/images/color-index/' + normalizedName + '.png';

          // console.log(externalPageLink);
          // console.log(lampPhoto);
          // console.log(lampGraph);
          // console.log(lampCRIGraph);

          //checkURL(externalPageLink);
          if (lampData.id >= 1500 && lampData.id < 1900) {

            checkURL(lampPhoto, countObj);
          }
          //checkURL(lampGraph, lampCount);
          //checkURL(lampCRIGraph, lampCount);

          lampCount += 1;
          //process.exit();
          
        }
      }
    }


    console.log('Total=' + lampCount);
  } else {
    console.log('no data');
  }
});

gulp.task('db', function (done) {

  // var fs = require('fs');
  // var d = JSON.parse(fs.readFileSync('./src/assets/data.json', 'win1251'));

  //const url = 'http://lamptest.ru/images/photo/00473-aigostar-led-9w-6400k-720-lm-e14.jpg';
  //checkURL(url, checkStatusCode);
  //const url2 = 'http://lamptest.ru/images/photo/00473-aigostark-led-9w-6400k-720-lm-e14.jpg';
  //checkURL(url2, checkStatusCode);



  // Download lamps CSV file
  const options = {
    method: 'HEAD',
    host: 'lamptest.ru',
    path: 'http://lamptest.ru/images/photo/00473-aigostar-led-9w-6400k-720-lm-e14.jpg'
  }
  http.get(options, function(response) {
    response.on('data', function (chunk) {
      //console.log('chunk=', chunk);
    });
    response.on('end', function () {
      //console.log('header=', response.headers);
      console.log('res=' + response.statusCode);
    });
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

      //console.log('headers=', response.headers);

      let csv = iconv.decode(Buffer.concat(chunks), 'win1251');
      let lines = csv.match(/[^\r\n]+/g);
      let lampsArray = [];

      let totalIncomingLamps = lines.length;

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

        //const data = lampsArray[lampsArray.length - 1];
        //let lamp = new Lamp();
        //if (lamp.init(data)) {
          //checkURL(lamp.externalPageLink, checkStatusCode);
        //}
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

      let totalLampsWithUpc = lampsArray.length;

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

      console.log('Total entries in CSV file: ' + totalIncomingLamps);
      console.log('Total lamps with UPC: ' + totalLampsWithUpc);

      fs.writeFile('./src/assets/data.js', 'var data = ' + JSON.stringify(lampsJson) + ';', function(err) {
        if(err) {
          return console.log(err);
        }

        done();
      });
    });
  });
});
