angular.module('lampTest', ['ionic', 'pascalprecht.translate'])

.config(function($stateProvider, $urlRouterProvider, $translateProvider) {
  $stateProvider
    .state('scan', {
      url: '/scan',
      templateUrl: 'templates/scan.html',
      controller: 'ScanCtrl',
      controllerAs: 'scanCtrl'
    })
    .state('lamp', {
      url: '/lamp/:upc',
      templateUrl: 'templates/lamp.html',
      controller: 'LampCtrl',
      controllerAs: 'lampCtrl'
    });

  $urlRouterProvider.otherwise('/scan');

  $translateProvider.translations('en', {
    SCAN_BARCODE_HEADER: 'Scan a barcode!',
    SCAN_BARCODE_BTN: 'Scan',
    LOOKUP_BARCODE_BTN: 'Lookup',
    CLEAR_BTN: 'Clear',
    DATA_SOURCE: 'Data is provided by '
  })
  .translations('ru', {
    SCAN_BARCODE_HEADER: 'Отсканируйте штрих-код!',
    SCAN_BARCODE_BTN: 'Сканировать',
    LOOKUP_BARCODE_BTN: 'Искать',
    CLEAR_BTN: 'Очистить',
    DATA_SOURCE: 'Данные предоставлены сайтом '
  });

  $translateProvider.preferredLanguage('ru');
})

.run(function($ionicPlatform) {
  $ionicPlatform.ready(function() {
    if (window.cordova && window.cordova.plugins && window.cordova.plugins.Keyboard) {
      // Hide the accessory bar by default (remove this to show the accessory bar above the keyboard
      // for form inputs)
      window.cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);

      // Don't remove this line unless you know what you are doing. It stops the viewport
      // from snapping when text inputs are focused. Ionic handles this internally for
      // a much nicer keyboard experience.
      window.cordova.plugins.Keyboard.disableScroll(true);
    }
    if (window.StatusBar) {
      StatusBar.styleDefault();
    }
  });
});