angular
  .module(
    'portal.admin.asset',
    [ 'ngFileUpload' ]
  )
  .config(mediaStates);

  mediaStates.$inject = ["$stateProvider", "$urlRouterProvider"]
  function mediaStates(statePrvd, urlRouterPrvd) {
    urlRouterPrvd.otherwise('/');
    statePrvd
      .state(
        'admin.asset', {
          url: 'asset',
          views: {
            'content@': {
              templateUrl: 'components/asset/form.html',
              controller: 'UploadCtrl as upload'
            }
          }
        })
      .state(
        'admin.asset.box', {
          abstract: true,
          views: {
            'content@': { templateUrl: 'components/asset/box.html', }
          }
        })
      .state(
        'admin.asset.box.upload', {
          url: '/uploads',
          views: {
            'media': {
              templateUrl: 'components/asset/form.html',
              controller: 'UploadCtrl as upload'
            }
          }
        })
      ;
  }
