angular
  .module('portal.client')
  .controller('PricingCtrl', ctrlPlans)

ctrlPlans.$inject = ['$http', 'BackendSrvc']

function ctrlPlans(http, backAPI) {
  var vm = this;
  vm.pricePlans = [];

  http.get(backAPI.pricings)

    .success(function(resp) {
      console.log(resp);
      vm.pricePlans = resp;
    })

    .error(function(resp) {
      console.log(resp);
    });

}
