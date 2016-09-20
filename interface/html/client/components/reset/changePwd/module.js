angular
  .module('portal.client.reset', ['ui.router'])
  .config(resetStatesConfig);

resetStatesConfig.$inject = ["$stateProvider", "$urlRouterProvider"]

function resetStatesConfig(stateProvider, urlRouterProvider) {
  urlRouterProvider.otherwise('/home');
  stateProvider
    .state('reset', {
      url: '/reset/:id',
      templateUrl: 'client/components/reset/changePwd/form.html',
      controller: 'ResetCtrl', controllerAs: 'reset'
    })
}
