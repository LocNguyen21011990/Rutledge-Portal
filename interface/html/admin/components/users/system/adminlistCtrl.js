angular
  .module('portal.admin.users')
  .controller('AdminListCtrl', ctrlAdminList);

ctrlAdminList.$inject = [
  'BackAPIs', 'EasyHttpSrvc', '$state',
  'DTOptionsBuilder', 'DTColumnBuilder',
  '$compile', '$scope',
];
function ctrlAdminList(
  // each params row matched above injecting array
  api, ehttp, $state,
  optBlder, colBlder,
  $compile, $scope
) {
  var vm = this;
  vm.title = 'System Administors';
  vm.add = add;
  vm.edit = edit;
  vm.remove = remove;

  // controller functions

  function add() { $state.go('admin.sysuser.create'); }
  function edit(usrid) { $state.go('admin.sysuser.infos', { id: usrid }); }
  function remove(usrid) {
    ehttp.delete(
      api.admin.user.replace(':id', usrid),
      function(resp) {
        var failed = resp.token == 0;
        var msg = failed ? 'CANNOT delete this user right now!'
          : 'This user has been removed!';
        alert(resp.error || msg);
        if (!failed) $state.reload();
      }
    );
  }

  // show got user list on the datatable
  vm.instance = {};
  vm.opts = optBlder.fromSource(api.admin.list)
    .withOption('initComplete', initComplete);
  vm.cols = [
    colBlder.newColumn('id', '').notSortable().renderWith(mockIDActions),
    colBlder.newColumn('display_name', 'Name'),
    colBlder.newColumn('login_id', 'Account'),
    colBlder.newColumn('email_address', 'Email'),
    colBlder.newColumn('active', 'Active').renderWith(mockActive),
    colBlder.newColumn('datecreated', 'Registered On').renderWith(mockTime),
    colBlder.newColumn('datemodified', 'Last Update').renderWith(mockTime),
  ];

  // helper functions
  function initComplete(settings) {
    // Recompiling so we can bind Angular directive to the DT
    $compile(angular.element('#' + settings.sTableId).contents())($scope);
  }
  // for rendering data of each cell
  function mockActive(data) { return data == 1 ? 'Yes' : 'No'; }
  function mockTime(data) { return new Date(data).toLocaleString(); }
  function mockIDActions(data) {
    var parsedID = "\'" + data + "\'";
    return '<button class="btn btn-xs" ng-click="list.edit(' + parsedID + ')">' +
      '<i class="fa fa-small fa-edit"></i></button>&nbsp;' +
      '<button class="btn btn-xs btn-danger" ng-click="list.remove(' + parsedID + ')">' +
      '<i class="fa fa-small fa-trash-o"></i></button>';
  }

}
