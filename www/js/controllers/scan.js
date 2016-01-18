function ScanCtrl($state) {
  var self = this;

  self.scanBarcode = function() {
    if (!window.cordova || !window.cordova.plugins || !window.cordova.plugins.barcodeScanner) {
      alert('Barcode scanner not available');
      return;
    }

    window.cordova.plugins.barcodeScanner.scan(
      function (result) {

        self.result += JSON.stringify(result);

        if (result.cancelled) {
          self.result += 'Cancelled: ' + result.cancelled;
        }
        else if (result.text) {
          self.result += 'Recognized: ' + result.text;
          self.lookupBarcode(result.text);
        }
      },
      function (error) {
        alert("Scanning failed: " + error);
      }
    );
  };

  self.scanBarcode();

  self.lookupBarcode = function(barcode) {
    if (window.data[barcode]) {
      $state.go('lamp', {upc: barcode});
    }
    else {
      self.result += 'Barcode not found in database.';
    }
  };
}

angular.module('lampTest')
  .controller('ScanCtrl', ScanCtrl);