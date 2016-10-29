angular.module('lampTest', ['ionic', 'ionic-toast', 'pascalprecht.translate', 'ionic.rating'])

.config(function($stateProvider, $urlRouterProvider, $ionicConfigProvider, $translateProvider) {
  $stateProvider
    .state('tab', {
      url: '/tab',
      abstract: true,
      templateUrl: 'templates/tabs.html'
    })
    .state('tab.scan', {
      url: '/scan',
      cache: false,
      views: {
        scan: {
          templateUrl: 'templates/scan.html',
          controller: 'ScanCtrl',
          controllerAs: 'scanCtrl'
        }
      }
    })
    .state('tab.list', {
      url: '/list',
      views: {
        list: {
          templateUrl: 'templates/list.html',
          controller: 'ListCtrl',
          controllerAs: 'listCtrl'
        }
      }
    })
    .state('tab.lamp', {
      url: '/lamp/:upc',
      views: {
        list: {
          templateUrl: 'templates/lamp.html',
          controller: 'LampCtrl',
          controllerAs: 'lampCtrl'
        }
      }
    })
    .state('tab.about', {
      url: '/about',
      views: {
        about: {
          templateUrl: 'templates/about.html'
        }
      }
    });

  $urlRouterProvider.otherwise('/tab/list');

  $ionicConfigProvider.tabs.position('bottom');

  $translateProvider.translations('en', {
    SCAN_BARCODE_HEADER: 'Scan a barcode!',
    LAMP_LIST_HEADER: 'Lamps List',
    LAMP_DETAILS_HEADER: 'Lamp Info',
    SCAN_BARCODE_BTN: 'Scan',
    LOOKUP_BARCODE_BTN: 'Lookup',
    CLEAR_BTN: 'Clear',
    DATA_SOURCE: 'Data is provided by ',
    LAMP_FOUND: 'Lamp found',
    VIEW_ON_SITE: 'View on site',
    BARCODE_INITIALIZING: 'Barcode scanner is initializing',
    BARCODE_NOT_FOUND: 'Barcode not found',
    BARCODE_SCANNER_NOT_SUPPORTED: 'Barcode scanner not supported on this platform'
  })
  .translations('ru', {
    SCAN_BARCODE_HEADER: 'Отсканируйте штрих-код!',
    LAMP_LIST_HEADER: 'Список ламп',
    LAMP_DETAILS_HEADER: 'Информация о лампе',
    SCAN_BARCODE_BTN: 'Сканировать',
    LOOKUP_BARCODE_BTN: 'Искать',
    CLEAR_BTN: 'Очистить',
    DATA_SOURCE: 'Данные предоставлены сайтом ',
    LAMP_FOUND: 'Лампа найдена',
    VIEW_ON_SITE: 'Посмотреть на сайте',
    BARCODE_INITIALIZING: 'Инициализируется сканнер баркодов',
    BARCODE_NOT_FOUND: 'Штрихкод не найден',
    BARCODE_SCANNER_NOT_SUPPORTED: 'Сканер штрихкодов на данной платформе не поддерживается'
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
