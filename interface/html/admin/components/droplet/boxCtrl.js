angular
  .module('portal.admin.uploads')
  .controller('DropletCtrl', ctrlDroplet);

ctrlDroplet.$inject = ['$scope','$timeout']
function ctrlDroplet ($scope, $timeout) {

  $scope.interface = {}; /** @property interface @type {Object} */
  $scope.uploadCount = 0; /** @property uploadCount @type {Number} */
  $scope.success = false; /** @property success @type {Boolean} */
  $scope.error = false; /** @property error @type {Boolean} */

  // Listen for when the interface has been configured.
  $scope.$on('$dropletReady', function whenDropletReady() {

    $scope.interface.allowedExtensions(['png', 'jpg', 'bmp', 'gif', 'svg', 'torrent']);
    $scope.interface.setRequestUrl('/uploads');
    $scope.interface.defineHTTPSuccess([/2.{2}/]);
    $scope.interface.useArray(false);
    console.log($scope.interface.FILE_TYPES);

  });

  // Listen for when the files have been successfully uploaded.
  $scope.$on('$dropletSuccess', function onDropletSuccess(event, response, files) {

    $scope.uploadCount = files.length;
    $scope.success     = true;
    console.log(response, files);

    $timeout(function timeout() {
        $scope.success = false;
    }, 5000);

  });

  // Listen for when the files have failed to upload.
  $scope.$on('$dropletError', function onDropletError(event, response) {

    $scope.error = true;
    console.log(response);

    $timeout(function timeout() {
        $scope.error = false;
    }, 5000);

  });

}
