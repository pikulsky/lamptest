function LampCtrl($stateParams) {
  var self = this;

  if ($stateParams.upc && window.data && window.data[$stateParams.upc]) {
    var lamp = window.data[$stateParams.upc];

    var normalizedBrand = lamp.brand.toLowerCase().replace(/\s+/g, '-').replace(/[^A-Za-z0-9\-]/g, '');
    var normalizedModel = lamp.model.toLowerCase().replace(/\s+/g, '-').replace(/[^A-Za-z0-9\-]/g, '');

    self.pageLink = 'http://lamptest.ru/review/' + normalizedBrand + '-' + normalizedModel;
  }
}

angular.module('lampTest')
  .controller('LampCtrl', LampCtrl);