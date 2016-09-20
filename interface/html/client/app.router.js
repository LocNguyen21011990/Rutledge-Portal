angular
    .module('portal.client', [
      'ui.router',
      'portal.client.home',
      'portal.client.reset'
    ])
    .config(statesConfig);

statesConfig.$inject = ["$stateProvider", "$urlRouterProvider"]

function statesConfig(stateProvider, urlRouterProvider) {
	urlRouterProvider.otherwise('/home');
	stateProvider
    .state('services', {
      url: '/services',
      templateUrl: 'client/components/services/listServices.html',
      controller: 'ServicesCtrl'
    })
    .state('detail', {
      url: '/detail/:id',
      templateUrl: 'client/components/services/serviceDetail.html',
      controller: 'ServiceDetailCtrl'
    })
    .state('pricings', {
      url: '/pricings',
      templateUrl: 'client/components/pricing/pricingPlans.html',
      controller: 'PricingCtrl',
      controllerAs: 'pricing'
    })
}
