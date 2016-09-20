angular.module('portal.admin').controller('AssetsCtrl', assetsCtrl);

assetsCtrl.$inject = [
	'$scope', '$http', '$state', '$compile', 'DTOptionsBuilder', 'DTColumnBuilder'
];

function assetsCtrl ($scope, $http, $state, $compile, DTOptionsBuilder, DTColumnBuilder) {
	$scope.dtOptions = DTOptionsBuilder.fromSource('http://localhost:8082/api/asset/all').withDataProp('data')
    
    $scope.dtOptions.withOption('fnRowCallback', function (nRow, aData, iDisplayIndex, iDisplayIndexFull) {
        $compile(nRow)($scope);
    });

    $scope.dtColumns = [
        DTColumnBuilder.newColumn('file_name').withTitle('File Name'),
        DTColumnBuilder.newColumn('datemodified').withTitle('Last updated'),
        DTColumnBuilder.newColumn('id').withTitle('Actions').renderWith(getOnlyId)
    ];


    function getOnlyId(data, type, full, meta) {
        var parsstring = "\'" + data + "\'";
        return '<button class="btn btn-warning" ng-click="edit(' + parsstring + ')">' +
            '   <i class="fa fa-edit"></i>' +
            '</button>&nbsp;' +
            '<button class="btn btn-danger" ng-click="delete(' + parsstring + ')">' +
            '   <i class="fa fa-trash-o"></i>' +
            '</button>';
    }

    $scope.add = function(id) {
        $state.go('admin.asset.form', {id:id});
    };


    $scope.edit = function(id) {
        alert(id);
    };


    $scope.delete = function(id) {
        alert(id);
    };

	$scope.listDir = function(srcpath) {
	  return fs.readdirSync(srcpath).filter(function(file) {
	    return fs.statSync(path.join(srcpath, file)).isDirectory();
	  });
	}
}