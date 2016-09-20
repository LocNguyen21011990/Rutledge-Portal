angular.module('portal.client')
  .factory('RegisterSrvc', srvcTenantReg)

srvcTenantReg.$inject = ['$http', 'BackendSrvc']

function srvcTenantReg($http, backAPI) {
  return reg;

  function reg(formdata, done, failed) {
    $http.post(backAPI.tenant + '/new', formdata)
      .success(done)
      .error(failed)
  }
}
