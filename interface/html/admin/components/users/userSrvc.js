angular.module('portal.admin.users')
  .constant('BackAPIs', getAPIs())
  .factory('EasyHttpSrvc', urlHttp)

function getAPIs() {
  var server = 'localhost';
  var api = `http://${server}:8082/api`;
  return {
    user: api + '/user/:id', // `:id` must be replaced by an actual id
    new: api + '/user/new',
    list: api + '/user/list',
    tenants: api + '/tenant/list?short=true',
    admin: {
      user: api + '/sysadmin/:id',
      new: api + '/sysadmin/new',
      list: api + '/sysadmin/list',
    }
  };
}

urlHttp.$inject = ['$http']
function error_resp() {
  return { error: "Sorry! CAN'T DO anything right now!", token: 0 };
}
function urlHttp($http) {
  // simple enough functions for HTTP methods
  return {
    get: function (apiurl, handle) {
      $http.get(apiurl).success(handle)
        .error(function(resp) { handle([]); });
    },

    delete: function (apiurl, handle) {
      $http.delete(apiurl).success(handle)
        .error(function(resp) {
          handle(error_resp());
          console.log(resp);
        });
    },

    save: function (apiurl, data, handle, newUser) {
      if (typeof data !== 'object') data = {};
      var save_mthd = !!newUser ? 'post' : 'put';
      $http[save_mthd](apiurl, data).success(handle)
        .error(function(resp) {
          handle(error_resp());
          console.log(resp);
        });
    }
  }

}
