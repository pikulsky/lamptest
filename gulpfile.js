var gulp = require('gulp');
var gutil = require('gulp-util');
var bower = require('bower');
var concat = require('gulp-concat');
var sass = require('gulp-sass');
var rename = require('gulp-rename');

gulp.task('default', []);

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// Deploy builds to HockeyApp
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
function hockeyAppDeploy(platformConfig) {
  return new Promise(function(resolve, reject) {
    var options = {
      url: 'https://rink.hockeyapp.net/api/2/apps/' + platformConfig.id + '/app_versions/upload',
      headers: {
        'X-HockeyAppToken': config.hockeyApp.apiToken
      },
      formData: {
        ipa: fs.createReadStream(__dirname + '/build/' + platformConfig.file),
        notify: 0,
        status: 2,
        teams: config.hockeyApp.buildTeams
      }
    };

    request.post(options, function(err, response, body) {
      if (err) {
        reject(err);
      }
      else if (response.statusCode != 201) {
        reject({
          status: response.statusCode,
          body: response.body
        });
      }

      resolve(response);
    });
  });
}
gulp.task('hockeyapp-android', [], function(done) {
  hockeyAppDeploy(config.hockeyApp.platforms.android).then(
    function success(response) {
      gutil.log(response.body);
      done();
    },
    function failure(err) {
      gutil.log(err);
      done();
    }
  );
});
gulp.task('hockeyapp-wp', [], function(done) {
  hockeyAppDeploy(config.hockeyApp.platforms.wp).then(
    function success() {
      gutil.log(response.body);
      done();
    },
    function failure(err) {
      gutil.log(err);
      done();
    }
  );
});
gulp.task('hockeyapp-ios', ['phonegap-build'], function(done) {
  hockeyAppDeploy(config.hockeyApp.platforms.ios).then(
    function success() {
      gutil.log(response.body);
      done();
    },
    function failure(err) {
      gutil.log(err);
      done();
    }
  );
});
gulp.task('hockeyapp-all', ['phonegap-build'], function(done) {
  var promises = [
    hockeyAppDeploy(config.hockeyApp.platforms.android),
    hockeyAppDeploy(config.hockeyApp.platforms.ios)
  ];
  Promise.all(promises).then(
    function success(values) {
      gutil.log('Android response:');
      gutil.log(values[0].body);
      gutil.log('iOS response:');
      gutil.log(values[1].body);
      done();
    },
    function failure(err) {
      gutil.log(err);
      done();
    }
  );
});