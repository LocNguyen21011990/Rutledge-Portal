angular
  .module(
    'portal.admin.users.normal',
    [
      'ui.router',
      'datatables'
    ]
  )
  .config(normalUsers);

normalUsers.$inject = ["$stateProvider", "$urlRouterProvider"]
function normalUsers(statePrvd, urlRouterPrvd) {
  urlRouterPrvd.otherwise('/login');
  statePrvd
    .state('admin.users',{
      url: 'users',
      views: {
        'content@': {
          templateUrl: 'components/users/layout/table.html',
          controller: 'ListCtrl', controllerAs: 'list'
        }
      }
    })
    .state('admin.users.detail', {
      url: '/detail/:id',
      views: {
        'content@': {
          templateUrl: 'components/users/layout/form.html',
          controller: 'FormCtrl', controllerAs: 'form'
        }
      }
    })
    .state('admin.users.new', {
      url: '/new',
      views: {
        'content@': {
          templateUrl: 'components/users/layout/form.html',
          controller: 'FormCtrl', controllerAs: 'form'
        }
      }
    })
    ;
}
