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

      self.lamp.subtype = lamp.subtype ? lamp.subtype : 'Н/Д';
      self.lamp.cri = lamp.cri ? lamp.cri : 'Н/Д';
      self.lamp.price_rur = lamp.price_rur ? lamp.price_rur : 'Н/Д';
      self.lamp.price_usd = lamp.price_usd ? lamp.price_usd : 'Н/Д';
      self.lamp.matte = lamp.matte ? 'матовая' : 'нет';
      self.lamp.effectiveness = (lamp.measured.lm / lamp.measured.P).toFixed(1);
      self.lamp.relevant = lamp.relevant ? 'есть в продаже' : 'не продается';
      self.lamp.dimmer_support = lamp.dimmer_support ? 'поддерживается' : 'нет';

      var switchIndicatorSupport = 'Н/Д';
      switch (parseInt(lamp.switch_indicator_support)) {
        case 0:
          switchIndicatorSupport = 'нет';
          break;
        case 1:
          switchIndicatorSupport = 'поддерживается';
          break;
        case 2:
          switchIndicatorSupport = 'слабо светится';
          break;
        case 3:
          switchIndicatorSupport = 'вспыхвает';
          break;
      }
      self.lamp.switch_indicator_support = switchIndicatorSupport;
    }
  }

}(angular));
