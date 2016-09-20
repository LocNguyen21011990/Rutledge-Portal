angular
  .module('portal.client.home', ['ui.router'])
  .config(homeStatesConfig);

homeStatesConfig.$inject = ["$stateProvider", "$urlRouterProvider"]

function homeStatesConfig(stateProvider, urlRouterProvider) {
  urlRouterProvider.otherwise('/home');
	stateProvider
  	.state('home', {
      url: '/home',
      views: {
        '': { templateUrl: 'client/components/portal/home.html' },
        'register@home': {
          templateUrl: 'client/components/register/form.html',
          controller: 'RegisterCtrl', controllerAs: 'register'
        },
        'login@home': {
          templateUrl: 'client/components/login/form.html',
          controller: 'LoginCtrl', controllerAs: 'login'
        }
      }
 		})
    .state('home.forgot', {
      url: '',
      views: {
        'login@home': {
          templateUrl: 'client/components/reset/forgot.html',
          controller: 'ForgotCtrl', controllerAs: 'forgot'
        }
      }
    })
}
