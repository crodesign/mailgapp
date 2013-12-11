function PostDatesCtrl($scope, $rootScope, $http, $routeParams, $filter, $location){ 
  var member1 = {"name": "Ben Scheib", "id": 1234};
  var member2 = {"name": "Denis Crowder", "id": 12345};
  var member3 = {"name": "Leo Malagan", "id": 123456};
  $scope.companies = [{"name": "Company1", "id": 12345, "members": [member1, member2]},
  					  {"name": "Company2", "id": 12345, "members": [member3]}];
  $scope.postDate = {"parcels": []};
  $scope.addParcel = function(){
	$scope.postDate.parcels.push({});
  }
  $scope.postDateValid = function(){
	$valid = false;
	try{
		var $postDate = new Date($scope.postDate.date);
		if($postDate != 'Invalid Date'){
			$valid = true;
		}
	}catch(Error){
	}
	return $valid;
  }
}
PostDatesCtrl.$inject = ['$scope', '$rootScope', '$http', '$routeParams', '$filter', '$location'];
app.controller('PostDatesCtrl', PostDatesCtrl);