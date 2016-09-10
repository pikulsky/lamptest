(function () {

  angular.module('lampTest')
    .controller('ListCtrl', ListCtrl);

  /**
   * @ngdoc function
   * @param {Object} $state
   * @constructor
   */
  function ListCtrl($state) {
    var self = this;

    self.lampClicked = lampClicked;

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

    /**
     * @ngdoc method
     * @methodOf ListCtrl
     * @param {String} upc
     * @returns {Promise}
     */
    function lampClicked(upc) {
      return $state.go('tab.lamp', {upc: upc});
    };
  }

}());
