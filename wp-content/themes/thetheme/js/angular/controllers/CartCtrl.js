function CartCtrl($scope, $rootScope, $filter, $location, stepUpdateService, regroupCartService, couponService) {
    $scope.initSimpleCart = function () {
        simpleCart.bind('afterSave', regroupCartService.regroup);
    };

    $scope.hasItems = function(){
	    var hasItems = false;
	    if(typeof($rootScope.cartItems) != "undefined" && $rootScope.cartItems.length > 0)
			hasItems = true;
		return hasItems;
	};
	
    $scope.updateSimpleCart = function(){
		simpleCart.save();
		simpleCart.update();
	};

    $scope.updateQuantity = function(variation, item){
		var simpleCartItemID = variation["id"];
		
		if(simpleCartItemID == null){
			$scope.addItemToSimpleJsCart(item["json"], variation["price"], variation["quantity"], 
										 item["tourId"], variation["name"], item["date"]);
		}else{
			var item = simpleCart.find(simpleCartItemID);
			item.quantity(variation["quantity"]);
		}
		stepUpdateService.updateStep(0);
		$scope.updateSimpleCart();
	};

    $scope.removeCartDate = function (item) {
        variations = item["variations"];

        jQuery.each(variations, function (index, variation) {
            var item_id = variation["id"];
            if (item_id) {
                var simple_cart_item = simpleCart.find(item_id);

                if (simple_cart_item) {
                    simple_cart_item.remove();
                    simpleCart.save();
                } else {
                    console.log("No item found with id " + item_id + " so couldn't be removed");
                }
            }
        });
        $scope.updateSimpleCart();
    };

    $scope.addToSimpleJsCart = function (json, tourDate) {
		angular.forEach(json.variations, function(variation, index){
		    if(typeof(variation.quantity) != "undefined" && variation.quantity != null && variation.quantity > 0){
			    if(typeof(tourDate) == "undefined" && json.package_items.length > 0 && json.package_items[0].tourDate){
					tourDate = json.package_items[0].tourDate; // todo:order these by the earliest date, but use first for now
				}
				if(typeof(tourDate) != "undefined"){
					$scope.addItemToSimpleJsCart(json, variation.price, variation.quantity, variation.tour_id, 
												 variation.name, tourDate, json.departureTime);
				}
			}
		});
		stepUpdateService.updateStep(0);
	    $scope.updateSimpleCart();
		window.location = "/checkout/#/cart"
    };

    $scope.addItemToSimpleJsCart = function(json, price, quantity, tourId, variationName, tourDate, tourTime){
		var activityName = json["title"];
		var activityId = json["id"];
		var cartHash = {
            name: activityName + ' - ' + tourDate, // name - date makes it unique item
			date: tourDate,
			time: tourTime,
            price: price,
            tour_id: tourId,
            size: variationName,
            activity_id: activityId,
            quantity: quantity,
            json: json
        };
        simpleCart.add(cartHash);
	};

	$scope.isNotInfantVariation = function(variation){
		return variation.display_price.toLowerCase() != 'free';
	};
	
	$scope.checkTimeVariation = function(variation, item){
		var vid = variation.tourId;
		var tid = item.tourId;
		return typeof(vid) != "undefined" && typeof(tid) != "undefined" && vid == tid ? true : false;
	};
	
	$scope.initSimpleCart();
}
CartCtrl.$inject = ['$scope', '$rootScope', '$filter', '$location', 'stepUpdateService', 'regroupCartService', 'couponService'];
discoverModule.controller('CartCtrl', CartCtrl);