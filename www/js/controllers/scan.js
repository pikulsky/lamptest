(function (angular) {

  angular.module('lampTest')
    .controller('ScanCtrl', ScanCtrl);

  /**
   * @ngdoc function
   * @param $log
   * @param $state
   * @param $translate
   * @param $ionicLoading
   * @param ionicToast
   * @constructor
   */
  function ScanCtrl($log, $state, $translate, $ionicLoading, ionicToast) {

    var self = this;

    var strBarcodeNotFound;
    var strBarcodeScannerNotSupported;

    self.lookupBarcode = lookupBarcode;
    self.scanBarcode = scanBarcode;

    /**
     * @ngdoc method
     * @methodOf ScanCtrl
     * @param {String} barcode
     * @description
     * Looks up scanned barcode in the database, and redirects to lamp page if barcode is found.
     */
    function lookupBarcode(barcode) {
      if (window.data[barcode]) {
        $log.info('Barcode lookup successful, data was found');
        $state.go('tab.lamp', {upc: barcode});
        $ionicLoading.hide();
      }
      else {
        $state.go('tab.list');
        $ionicLoading.hide();
        ionicToast.show(strBarcodeNotFound, 'middle', false, 1500);
      }
    }

    /**
     * @ngdoc method
     * @methodOf scanBarcode
     * @description
     * Scans a barcode.
     */
    function scanBarcode() {
      if (!window.cordova || !window.cordova.plugins || !window.cordova.plugins.barcodeScanner) {
        ionicToast.show(strBarcodeScannerNotSupported, 'middle', false, 2000);
        return;
      }

      $ionicLoading.show();

      window.cordova.plugins.barcodeScanner.scan(
        function (result) {

          $log.debug('Scanner result: ' + angular.toJson(result));

          if (result.text && !result.cancelled) {
            $log.info('Recognized data: ' + result.text);
            return self.lookupBarcode(result.text);
          }

          if (result.cancelled) {
            $ionicLoading.hide();
            $state.go('tab.list');
          }
        },
        function (error) {
          $ionicLoading.hide();
          $log.error('Scanner failed: ' + angular.toJson(error));
          $state.go('tab.list');
        }
      );
    }

    $translate('BARCODE_INITIALIZING')
      .then(function (labelBarcodeInitializing) {
        return $ionicLoading.show({
          template: labelBarcodeInitializing
        });
      })
      .then(function () {
        return $translate('BARCODE_NOT_FOUND');
      })
      .then(function (labelBarcodeNotFound) {
        strBarcodeNotFound = labelBarcodeNotFound;
        return $translate('BARCODE_SCANNER_NOT_SUPPORTED');
      })
      .then(function (labelBarcodeScannerNotSupported) {
        strBarcodeScannerNotSupported = labelBarcodeScannerNotSupported;
        self.scanBarcode();
        $ionicLoading.hide();
      });
  }

}(angular));
