
angular.module('portal.client').controller('ServicesCtrl', ctrlService);

ctrlService.$inject = ['$scope', 'ServicesSrvc']

function ctrlService($scope, getServices) {


	$scope.lstcategories = null;
	$scope.lstData = [];
	 getServices.getAllCategories(getCategoriesDone, getCategoriesError);
	 getServices.getServices(done, failed);

	 function getCategoriesDone(resp) {
	 	$scope.lstcategories = resp.data;
	 }

	 function getCategoriesError(resp) {
	 	console.log(resp);
	 	alert('Sorry! Your registration can\'t be done right now!');
	 }

	 function done(resp) {

	 	var categories = resp.data;
	 	_.each($scope.lstcategories, function (category) {
	 		category.services = [];
	 		_.each(categories, function (cate){
	 			if(cate.categoryId === category.categoryId) {

	 				category.services.push(cate);
	 			}
	 		}) 
	 		$scope.lstData.push(category);
	 	})
	 }

	 function failed(resp) {
	 	console.log(resp);
	 	alert('Sorry! Your registration can\'t be done right now!');
	 }


	 function gotoServiceDetail(id) {
	 	alert(id);
	 }
}
