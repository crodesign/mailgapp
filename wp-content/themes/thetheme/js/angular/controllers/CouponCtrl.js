function CouponCtrl($scope, $rootScope, $http, $routeParams, $filter, couponService){ 
	$scope.fetchInfo = function() {
	  $scope.couponForm.coupon.$setValidity("alreadyUsed", true);
	  $scope.couponForm.coupon.$setValidity("invalidCode", true);
	
	  if(jQuery.trim($scope.coupon).length > 0){
		var ajaxUrl = siteRoot + '/wp-admin/admin-ajax.php?cart_action=apply_discount&coupon_num=';
		var couponURL = ajaxUrl + encodeURIComponent(jQuery.trim($scope.coupon));
	    $http.get(couponURL).success(function(coupon){
		    
		    if(coupon.value){
				if(couponService.addCoupons([coupon]) > 0){
					couponService.processCoupons(coupon);
				}else{
					$scope.couponForm.coupon.$setValidity("alreadyUsed", false);
				}
			}
			else{
				$scope.couponForm.coupon.$setValidity("invalidCode", false);
			}
			
	  	});
	  }
    };

    $rootScope.$on('couponAdded', function(){
	  if(couponService.coupons.length > 0){
		$rootScope.coupon = couponService.coupons[couponService.coupons.length - 1].code;
	  }
    });
};
CouponCtrl.$inject = ['$scope', '$rootScope', '$http', '$routeParams', '$filter', 'couponService'];
discoverModule.controller('CouponCtrl', CouponCtrl);