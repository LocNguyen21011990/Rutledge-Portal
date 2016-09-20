angular.module('portal.client').directive('blockService', function () {
	return {
		restrict: 'E',
		scope: {
			block: '='
		},
		templateUrl: 'client/components/services/blockService.html'
	}
});