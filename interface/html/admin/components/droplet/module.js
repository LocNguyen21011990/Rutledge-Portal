angular
  .module(
    'portal.admin.uploads',
    [ 'ngDroplet' ]
  )
  .config(mediaStates);

  mediaStates.$inject = ["$stateProvider", "$urlRouterProvider"]
  function mediaStates(statePrvd, urlRouterPrvd) {
    urlRouterPrvd.otherwise('/');
    statePrvd
      .state(
        'admin.uploads', {
          url: 'uploads',
          views: {
            'content@': {
              templateUrl: 'components/droplet/box.html',
              controller: 'DropletCtrl'
            }
          }
        }
      );
  }
