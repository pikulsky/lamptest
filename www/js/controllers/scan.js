function ScanCtrl($log, $state, ionicToast) {
  var self = this;

  self.lookupBarcode = function(barcode) {
    if (window.data[barcode]) {
      $log.info('Barcode lookup successful, data was found');
      $state.go('lamp', {upc: barcode});
    }
    else {
      ionicToast.show('Barcode not found in database.', 'middle', false, 1000);
    }
  };

  self.scanBarcode = function() {
    if (!window.cordova || !window.cordova.plugins || !window.cordova.plugins.barcodeScanner) {
      ionicToast.show('Barcode not found in database.', 'middle', false, 1000);
      return;
    }

    window.cordova.plugins.barcodeScanner.scan(
      function (result) {

        $log.debug('Scanner result: ' + angular.toJson(result));

        if (result.text && !result.cancelled) {
          $log.info('Recognized data: ' + result.text);
          self.lookupBarcode(result.text);
        }
      },
      function (error) {
        $log.error('Scanner failed: ' + angular.toJson(error));
      }
    );
  };

  self.scanBarcode();
}

angular.module('lampTest')
  .controller('ScanCtrl', ScanCtrl);