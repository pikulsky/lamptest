(function (angular) {

  angular.module('lampTest')
    .controller('AboutCtrl', AboutCtrl);


  /**
   * @ngdoc function
   * @constructor
   */
  function AboutCtrl() {
    var self = this;

    var totalLamps = 0;
    var latestUpdate = moment('1970-01-01');
    for (var upc in window.data) {
      if (window.data.hasOwnProperty(upc)) {
        totalLamps++;
        var testDate = moment(window.data[upc].test_date, 'DD.MM.YYYY');
        if (testDate > latestUpdate) {
          latestUpdate = testDate;
        }
      }
    }
    self.totalLamps = totalLamps;
    self.latestUpdate = latestUpdate.format('Do MMMM, YYYY');
  }

}(angular));
