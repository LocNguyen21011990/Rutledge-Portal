angular.module('portal.admin').controller('ServicesCtrl', ['$scope', '$http', '$state', '$compile', 'DTOptionsBuilder', 'DTColumnBuilder', function($scope, $http, $state, $compile, DTOptionsBuilder, DTColumnBuilder) {

    $scope.dtOptions = DTOptionsBuilder.fromSource('http://localhost:8082/api/service/listwithcategory').withDataProp('data')
    
    $scope.dtOptions.withOption('fnRowCallback', function (nRow, aData, iDisplayIndex, iDisplayIndexFull) {
        $compile(nRow)($scope);
    });

    $scope.dtColumns = [
        DTColumnBuilder.newColumn('serviceId').withTitle('ID'),
        DTColumnBuilder.newColumn('serviceName').withTitle('Service Name'),
        DTColumnBuilder.newColumn('teaser').withTitle('Teaser'),
        DTColumnBuilder.newColumn('categoryName').withTitle('Category'),
        DTColumnBuilder.newColumn('active').withTitle('Active').renderWith(setActiveText),
        DTColumnBuilder.newColumn('serviceId').withTitle('Actions').renderWith(getOnlyId)
    ];

    function setActiveText(data, type, full, meta) {
        var txt = '';
        if(data === 1) {
            txt = 'Yes';
        }
        else {
            txt = 'No'
        }
        return txt;
    }

    function getOnlyId(data, type, full, meta) {
        var parsstring = "\'" + data + "\'";
        return '<button class="btn btn-warning" ng-click="edit(' + parsstring + ')">' +
            '   <i class="fa fa-edit"></i>' +
            '</button>&nbsp;' +
            '<button class="btn btn-danger" ng-click="delete(' + parsstring + ')">' +
            '   <i class="fa fa-trash-o"></i>' +
            '</button>';
    }

    //get one row value (object)
   //  function rowCallback(tabRow, data, dataIndex) {
	 	// $(tabRow).unbind('click');
   //      $(tabRow).on('click', function() {
   //          var tr = $(tabRow);
   //          var table = $scope.dtInstance.DataTable;
   //          var row = table.row(tr);
   //          $scope.edit(row.data().id);
   //      });
   //  }

    $scope.dtInstance = {};


	$scope.add = function(id) {
        $state.go('admin.form', {id:id});
    };


    $scope.edit = function(id) {
        $state.go('admin.form', {id:id});
    };


    $scope.delete = function(id) {
        $http.delete('http://localhost:8082/api/service/' + id).success(function(res) {
            window.location.reload();
        });
    };
}]);
