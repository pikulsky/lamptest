function ScanCtrl() {
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
          self.lookupBarcode(result.text);
        }
      },
      function (error) {
        alert("Scanning failed: " + error);
      }
    );
  };

  self.lookupBarcode = function(barcode) {
    if (window.data[barcode]) {
      self.result += JSON.stringify(window.data[barcode], null, 2);
    }
    else {
      self.result += 'Barcode not found in database.';
    }
  };

  self.clear = function() {
    self.result = '';
  };
}

angular.module('lampTest')
  .controller('ScanCtrl', ScanCtrl);