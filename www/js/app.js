angular.module('lampTest', ['ionic'])

.config(function($stateProvider, $urlRouterProvider) {
  $stateProvider
      .state('scan', {
        url: '/scan',
        templateUrl: 'templates/scan.html',
        controller: 'ScanCtrl',
        controllerAs: 'scanCtrl'
      });

  $urlRouterProvider.otherwise('/scan');
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