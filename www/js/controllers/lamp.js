(function (angular) {

  angular.module('lampTest')
    .controller('LampCtrl', LampCtrl);


  /**
   * @ngdoc function
   * @param {Object} $stateParams
   * @constructor
   */
  function LampCtrl($stateParams) {
    var self = this;

    if ($stateParams.upc && window.data && window.data[$stateParams.upc]) {
      var lamp = window.data[$stateParams.upc];

      var normalizedBrand = lamp.brand.toLowerCase().replace(/[\s\/]+/g, '-').replace(/[^A-Za-z0-9\-]/g, '');
      var normalizedModel = lamp.model.toLowerCase().replace(/[\s\/]+/g, '-').replace(/[^A-Za-z0-9\-]/g, '');

      self.pageLink = 'http://lamptest.ru/review/' + normalizedBrand + '-' + normalizedModel;
      self.lampPhoto = 'http://lamptest.ru/images/photo/' + normalizedBrand + '-' + normalizedModel + '.jpg';
      self.lampGraph = 'http://lamptest.ru/images/graph/' + normalizedBrand + '-' + normalizedModel + '.png';

      self.lamp = lamp;

      self.lamp.matte = lamp.matte ? 'матовая' : 'нет';
      self.lamp.effectiveness = (lamp.realLm / lamp.realP).toFixed(2);
    }
  }

}(angular));
