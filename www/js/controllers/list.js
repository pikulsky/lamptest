(function (angular) {

  angular.module('lampTest')
    .controller('ListCtrl', ListCtrl);

  /**
   * @ngdoc function
   * @param {Object} $state
   * @constructor
   */
  function ListCtrl($state, $timeout, $ionicScrollDelegate, Lamps) {
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
        self.lamps = Lamps.getList();
        var originalListLength = self.lamps.length;

        if (keyword) {
          var normalizedKeyword = keyword.toLowerCase();
          self.lamps = self.lamps.filter(function (lamp) {
            if (lamp.normalizedTitle.indexOf(normalizedKeyword) === 0) {
              return true;
            }
            return false;
          });
        }

        if (originalListLength != self.lamps.length) {
          $ionicScrollDelegate.scrollTop();
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
