function ListCtrl($state) {
  var self = this;

  self.lamps = [];

  if (window.data) {

    for (var upc in window.data) {
      if (window.data.hasOwnProperty(upc)) {
        self.lamps.push({
          title: window.data[upc].brand + ' ' + window.data[upc].model,
          upc: upc
        });
      }
    }
  }

  self.lampClicked = function(upc) {
    return $state.go('tab.lamp', {upc: upc});
  }
}

angular.module('lampTest')
  .controller('ListCtrl', ListCtrl);