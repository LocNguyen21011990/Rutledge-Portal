angular.module('portal.client')
  .factory('ServicesSrvc', srvcServiceReg)

srvcServiceReg.$inject = ['$http', 'BackendSrvc']

function srvcServiceReg($http, backAPI) {
  return {
  	getServices: getServices,
  	getAllCategories: getAllCategories
  };

  function getServices(done, failed) {
    $http.get(backAPI.service)
      .success(done)
      .error(failed)
  }

  function getAllCategories(done, failed) {
  	$http.get(backAPI.category)
  	.success(done)
  	.error(failed)
  }
}
