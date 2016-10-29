(function (angular) {

  angular.module('lampTest')
    .controller('ListCtrl', ListCtrl);

  /**
   * @ngdoc function
   * @param {Object} $state
   * @constructor
   */
  function ListCtrl($state, $timeout) {
    var self = this;

    self.lampClicked = lampClicked;
    self.onSearchChanged = onSearchChanged;

    self.lamps = [];
    self.keywordSearch = '';

    updateLampList();

    /**
     * @ngdoc function
     * @param {String} keyword - Optional search keyword which will be applied to the lamps list if present.
     * @description
     * Redraw lamps list.
     */
    function updateLampList(keyword) {
      // Wrap in timeout to prevent list update from blocking UI until it will be completed
      $timeout(function () {
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

          if (keyword) {
            var normalizedKeyword = keyword.toLowerCase();
            self.lamps = self.lamps.filter(function (lamp) {
              if (lamp.title && lamp.title.toLowerCase().indexOf(normalizedKeyword) === 0) {
                return true;
              }
              return false;
            });
          }
        }
      }, 1);

    }

    /**
     * @ngdoc method
     * @methodOf ListCtrl
     * @description
     * Search form change handler.
     */
    function onSearchChanged() {
      updateLampList(self.keywordSearch);
    }

    /**
     * @ngdoc method
     * @methodOf ListCtrl
     * @param {String} upc
     * @returns {Promise}
     */
    function lampClicked(upc) {
      return $state.go('tab.lamp', {upc: upc});
    }
  }

}(angular));
