
angular.module('portal.client').controller('ServiceDetailCtrl', ctrlService);

ctrlService.$inject = ['$scope', '$http', '$state', 'ServicesSrvc']

function ctrlService($scope, $http, $state, getServices) {
	$scope.serviceId = $state.params.id;
	$http.get('http://172.16.0.74:8082/api/pricing/service/' + $scope.serviceId).success(function (res) {
		$scope.service = res.service;
		$scope.prices  = res.prices;
	})
}