angular.module('portal.admin').controller('formServicesCtrl', ['$scope', '$http' , '$state', function($scope, $http, $state) {
    $scope.serviceId = $state.params.id;
    $scope.titlePage = 'Editing Service';
    // $scope.dataservice = {};
    // $scope.categories = [];
    // $scope.prices = [];

    $http.get('http://localhost:8082/api/service/listcategory').success(function (res) {
        $scope.categories = res.data;
    });

    $http.get('http://localhost:8082/api/service/listpricing').success(function (res) {
        $scope.prices = res.data;
    });

    $http.get('http://localhost:8082/api/pricing/service/' + $scope.serviceId).success(function(res) {
        if(Object.keys(res).length > 2) {
            $scope.dataservice =  res.service;
            $scope.dataservice.id = $scope.serviceId;
            $scope.dataservice.categoryId = res.category[0].id;
            if(typeof $scope.dataservice !== "undefined") {
                $scope.dataservice.active = $scope.dataservice.active != 1 ? false : true;
            }
            $scope.dataservice.pricing = [];
            for(var i=0; i < res.prices.length; i ++) {
                $scope.dataservice.pricing.push(res.prices[i].id);
            }
        }
    });


    $scope.cancel = function () {
    	$state.go('admin.services');
    }

    $scope.submit = function () {
        if($scope.serviceId == 0 ) {
            $http.post('http://localhost:8082/api/service/new', $scope.dataservice).success(function(res) {
                $state.go('admin.services');
            });
        }
        else {
            $http.put('http://localhost:8082/api/service/' + $scope.serviceId, $scope.dataservice).success(function(res) {
                $state.go('admin.services');
            });
        }
       
    }
}]);