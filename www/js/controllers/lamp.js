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

      var normalizedBrand = lamp.brand.toLowerCase().replace(/[\s\/]+/g, '-').replace(/[^A-Za-zА-Яа-я0-9\-\_]/g, '');
      var normalizedModel = lamp.model.toLowerCase().replace(/[\s\/]+/g, '-').replace(/[^A-Za-zА-Яа-я0-9\-\_]/g, '');

      normalizedBrand = transliterate(normalizedBrand);
      normalizedModel = transliterate(normalizedModel);

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
      self.lamp.relevant = lamp.relevant && lamp.relevant == 1 ? 'есть в продаже' : 'не продается';
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

      self.measuredBetter = {};
      var measuredParams = ['P', 'lm', 'ekv', 'color'];
      var totalMeasuredParams = measuredParams.length;
      for (var i = 0; i < totalMeasuredParams; i++) {
        var key = measuredParams[i];
        self.measuredBetter[key] = false;
        if (self.lamp.measured[key] && self.lamp[key] && self.lamp.measured[key] >= self.lamp[key]) {
          self.measuredBetter[key] = true;
        }
      }
    }

    function transliterate(str) {
      var cyr2latChars = [
        ['а', 'a'], ['б', 'b'], ['в', 'v'], ['г', 'g'],
        ['д', 'd'],  ['е', 'ye'], ['ё', 'yo'], ['ж', 'zh'], ['з', 'z'],
        ['и', 'i'], ['й', 'y'], ['к', 'k'], ['л', 'l'],
        ['м', 'm'],  ['н', 'n'], ['о', 'o'], ['п', 'p'],  ['р', 'r'],
        ['с', 's'], ['т', 't'], ['у', 'u'], ['ф', 'f'],
        ['х', 'h'],  ['ц', 'c'], ['ч', 'ch'],['ш', 'sh'], ['щ', 'shch'],
        ['ъ', ''],  ['ы', 'y'], ['ь', ''],  ['э', 'e'], ['ю', 'yu'], ['я', 'ya'],

        ['А', 'A'], ['Б', 'B'],  ['В', 'V'], ['Г', 'G'],
        ['Д', 'D'], ['Е', 'E'], ['Ё', 'YO'],  ['Ж', 'ZH'], ['З', 'Z'],
        ['И', 'I'], ['Й', 'Y'],  ['К', 'K'], ['Л', 'L'],
        ['М', 'M'], ['Н', 'N'], ['О', 'O'],  ['П', 'P'],  ['Р', 'R'],
        ['С', 'S'], ['Т', 'T'],  ['У', 'U'], ['Ф', 'F'],
        ['Х', 'H'], ['Ц', 'C'], ['Ч', 'CH'], ['Ш', 'SH'], ['Щ', 'SHCH'],
        ['Ъ', ''],  ['Ы', 'Y'],
        ['Ь', ''],
        ['Э', 'E'],
        ['Ю', 'YU'],
        ['Я', 'YA']
      ];

      var newStr = new String();

      for (var i = 0; i < str.length; i++) {
        var ch = str.charAt(i);
        var newCh = ch;

        for (var j = 0; j < cyr2latChars.length; j++) {
          if (ch === cyr2latChars[j][0]) {
            newCh = cyr2latChars[j][1];
          }
        }

        newStr += newCh;
      }

      return newStr;
    }
  }

}(angular));
