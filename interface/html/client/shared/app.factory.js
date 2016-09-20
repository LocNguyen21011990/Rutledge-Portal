angular.module('portal.client')
  .factory('BackendSrvc', srvcBackend)
  .factory('CountryListSrvc', srvcCntryList)

function srvcBackend() {
  var dev = 'localhost';
  var prod = '172.16.0.69';
  var api = `http://${dev}:8082/api`;
  return {
    tenant: api + '/tenant',
    user: api + '/user',
    countries: api + '/country/list',
    pricings: api + '/pricing/list',
    service: api + '/service/listwithcategory',
    category: api + '/service/listcategory',
    categories: api + '/category/new'
  };
}

srvcCntryList.$inject = ['$http', 'BackendSrvc']
function srvcCntryList($http, backAPI) {
  var list = [];
  $http.get(backAPI.countries)
    .success(function(resp) {
      list = resp;
    })
    .error(function(resp) {
      console.log(resp);
    })
  return list;
}
