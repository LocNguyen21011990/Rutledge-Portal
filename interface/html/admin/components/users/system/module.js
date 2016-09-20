angular
  .module(
    'portal.admin.users.system',
    [
      'ui.router',
      'datatables'
    ]
  )
  .config(systemUsers);

systemUsers.$inject = ["$stateProvider", "$urlRouterProvider"]
function systemUsers(statePrvd, urlRouterPrvd) {
  urlRouterPrvd.otherwise('/login');
  statePrvd
    .state('admin.sysuser', {
      url: 'system/admins',
      views: {
        'content@': {
          templateUrl: 'components/users/layout/table.html',
          controller: 'AdminListCtrl as list'
        }
      }
    })
    .state('admin.sysuser.infos', {
      url: '/detail/:id',
      views: {
        'content@': {
          templateUrl: 'components/users/layout/form.html',
          controller: 'AdminFormCtrl as form'
        }
      }
    })
    .state('admin.sysuser.create', {
      url: '/new',
      views: {
        'content@': {
          templateUrl: 'components/users/layout/form.html',
          controller: 'AdminFormCtrl as form'
        }
      }
    })
    ;
}
