function ScanCtrl($log, $state, $translate, ionicToast) {
  var self = this;

  var strBarcodeNotFound, strBarcodeScannerNotSupported;

  self.lookupBarcode = function(barcode) {
    if (window.data[barcode]) {
      $log.info('Barcode lookup successful, data was found');
      $state.go('tab.lamp', {upc: barcode});
    }
    else {
      ionicToast.show(strBarcodeNotFound, 'middle', false, 1500);
    }
  };

  self.scanBarcode = function() {
    if (!window.cordova || !window.cordova.plugins || !window.cordova.plugins.barcodeScanner) {
      ionicToast.show(strBarcodeScannerNotSupported, 'middle', false, 2000);
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

  $translate('BARCODE_NOT_FOUND')
    .then(function (str) {
      strBarcodeNotFound = str;
      return $translate('BARCODE_SCANNER_NOT_SUPPORTED');
    })
    .then(function (str) {
      strBarcodeScannerNotSupported = str;
    })
    .then(function (str) {
      self.scanBarcode();
    });
}

angular.module('lampTest')
  .controller('ScanCtrl', ScanCtrl);