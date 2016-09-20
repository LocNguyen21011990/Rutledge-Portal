angular
  .module('portal.admin', [
    'ui.router', 'datatables',
    'portal.admin.users',
    'portal.admin.uploads',
    'portal.admin.asset'
  ])
  .config(statesConfig);

statesConfig.$inject = ["$stateProvider", "$urlRouterProvider"]

function statesConfig(stateProvider, urlRouterProvider) {
  	urlRouterProvider.otherwise('/login');
  	stateProvider
		.state('login', {
			url: '/login',
			views: {
				'content': {
					templateUrl: 'components/login/login.html'
				}
			}
		})
		.state('admin',{
			url: '/',
			views: {
				'header': {
					templateUrl: 'shared/header.html'
				},
				'leftmenu': {
					templateUrl: 'shared/leftmenu.html'
				},
				'content': {
					templateUrl: 'components/dashboard/dashboard.html'
				},
				'footer': {
					templateUrl: 'shared/footer.html'
				}
			}
		})
		.state('admin.assets' , {
			url: 'assets',
			views: {
				'content@': {
	                templateUrl: 'components/assets/index.html',
	                controller: 'AssetsCtrl'
	            }
			}
		})
		.state('admin.services', {
			url: 'services',
			views: {
				'content@': {
	                templateUrl: 'components/services/index.html',
	                controller: 'ServicesCtrl'
	            }
			}
		})
		.state('admin.form', {
			url: 'services/form/id=:id',
			views: {
				'content@': {
	                templateUrl: 'components/services/form.html',
	                controller: 'formServicesCtrl'
	            }
			}
		})
}
