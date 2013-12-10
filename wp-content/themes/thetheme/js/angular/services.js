function ModalService($modal, $rootScope, $location) {
  var modeler = {modal: null};

  modeler.openModal = function() {
	if(modeler.modal == null){
		modeler.modal = $modal.open({
	      template: '<div ng-view></div>'
	    });
	    
		modeler.modal.result.then(function () {}, function () { modeler.resetPath();}); // modal dismissed so resetting it
	}
    modeler.broadcastOpened();
  };

  modeler.resetPath = function() {
	modeler.modal = null; 
	$location.path('');
  };

  modeler.closeModal = function() {
	if(modeler.modal){
		modeler.modal.close();
		modeler.resetPath();
	}
    modeler.broadcastClosed();
  };

  modeler.broadcastOpened = function() {
    $rootScope.$broadcast('modalOpened');
  };

  modeler.broadcastClosed = function() {
    $rootScope.$broadcast('modalClosed');
  };

};
discoverModule.factory('modalService', ['$rootScope', '$modal', '$location', ModalService]);

function StepUpdateService($rootScope) {
  var stepUpdate = {};

  stepUpdate.message = '';

  stepUpdate.updateStep = function(step) {
    this.step = step;
    this.broadcastItem();
  };

  stepUpdate.broadcastItem = function() {
    $rootScope.$broadcast('stepUpdated');
  };

  return stepUpdate;
};
discoverModule.factory('stepUpdateService', ['$rootScope', StepUpdateService]);

function CouponService($rootScope, $filter) {
  var couponUpdate = {totalDiscounts: 0, coupons: []};

  couponUpdate.addCoupons = function(coupons) {
	var addCount = 0;
	angular.forEach(coupons, function(coupon, index){
		if(typeof(coupon) != "undefined" && coupon && !couponUpdate.codeExists(couponUpdate.coupons, coupon)){
			couponUpdate.coupons.push(coupon);
			couponUpdate.broadcastAdd();
			addCount += 1;
		}
	});
	return addCount;
  };

  couponUpdate.broadcastAdd = function() {
    $rootScope.$broadcast('couponAdded');
  };

  // check an array of coupons for a specific one
  couponUpdate.codeExists = function(coupons, givenCoupon){
  	var exists = false;
  	angular.forEach(coupons, function(coupon, index){
  		if(coupon.code == givenCoupon.code) exists = true;
  	});
  	return exists;
  };

  couponUpdate.processCoupons = function(){
	var saveCart = false;
	
  	angular.forEach(couponUpdate.coupons, function(coupon, index){
  		simpleCart.each(function (item, x) {
	        var currentItemCoupons = item.get('coupons') || [];
			
			// apply the coupon to this item if it wasn't yet applied
			if(!couponUpdate.codeExists(currentItemCoupons, coupon)){
				saveCart = true;
				currentItemCoupons.push(coupon);
	            item.set('coupons', currentItemCoupons);

	            var price = item.get('price');
	            var discount = item.get('discount') || 0;
	            if(coupon.is_percentage == "1" && typeof(coupon.value) != "undefined" && typeof(coupon.code) != "undefined"){
		            discount += price*(coupon.value/100);
					price = price - discount;
				    price = $filter('currency')(price);
				}
				item.set('discount', discount);
				item.set('price', price);
			}
        });
  	});
    couponUpdate.updateDiscounts();
    if(saveCart) simpleCart.save();
  };

  couponUpdate.updateDiscounts = function(){
	    couponUpdate.totalDiscounts = 0;
		simpleCart.each(function (item, x) {
			var discount = item.get('discount') || 0;
			couponUpdate.totalDiscounts += discount;
		});
  };
   
  return couponUpdate;
};
discoverModule.factory('couponService', ['$rootScope', '$filter', CouponService]);

function RegroupCartService($rootScope, $filter, $location, $routeParams, couponService) {
  var regrouper = {};

  regrouper.regroup = function() {
        $rootScope.cartItems = [];
        $rootScope.cartItemIslands = [];
        var items = {};
        simpleCart.each(function (item, x) {
			couponService.addCoupons(item.get("coupons"));
			
            var itemName = item.get("name");
            var nameIndex = itemName.split(' - ')[0];
            var itemDate = itemName.split(' - ')[1]; // just using the first date for now here

            if (typeof (items[nameIndex]) == "undefined" || items[nameIndex] == null || items[nameIndex].length == 0) {
                items[nameIndex] = {};
            }
            if (typeof (items[nameIndex][itemDate]) == "undefined" || items[nameIndex][itemDate] == null || items[nameIndex][itemDate].length == 0) {
                items[nameIndex][itemDate] = [];
            }

            items[nameIndex][itemDate].push(item);
        });
        jQuery.each(items, function (activityName, dates) {
            jQuery.each(dates, function (activity_date, date_items) {
				var json = date_items[0].get('json');
				var island = json['island'].toLowerCase();
				if(typeof(island) != "undefined" && island != null 
				   && island.length != 0 && jQuery.inArray(island, $rootScope.cartItemIslands) == -1){
					$rootScope.cartItemIslands.push(island);
				}

                var thumbUrl = json['photo_url'];
 				var activityVariations = json['variations'];
				var cartVariations = [];
				var itemSubtotal = 0;
				var tourId = json['tourId']; 
				var tourTime = json['departureTime'];

				jQuery.each(activityVariations, function (activityVariationIndex, variation) {
					var price = variation["price"];
					var displayPrice = price == 0.00 ? 'Free' : '$' + price;
					var quantity = 0;
					var id = null; // id of the simple cart object
					var name = variation["name"];
					var data = []; // data for the variation (ie first/last name for each traveler/quantity)

					// find the simple cart object matching the variation
					jQuery.each(date_items, function (cartItemsIndex, item) {
						if(name == item.get('size') && tourId == item.get('tour_id')){ 
							quantity = parseInt(item.get('quantity'));
							id = item.get('id');
							var itemData = item.get('data');
							var billingData = item.get('billing');
							if(typeof(itemData) != "undefined" && itemData != null){
								data = item.get('data');
							}
							if(typeof(billingData) == "object")
								jQuery.extend($rootScope.billingData, billingData);
						}
					});

					if(tourId == variation['tour_id']){
						itemSubtotal += quantity*price;
						
						if(data.length == 0){ // no data previously entered for this variation
							for(var i = 0; i<quantity; i++){ data.push({}); } // data from the checkout process to go right here
						}
						
						cartVariations.push({
	                        "name": name,
	                        "id": id,
	                        "price": price,
							"tourId": tourId,
	                        "display_price": displayPrice,
	                        "quantity": quantity,
							"data": data
	                    });
					}
				});
				var item = {
                    "name": activityName,
                    "date": activity_date,
                    "variations": cartVariations,
					"subtotal": itemSubtotal,
					"json": json,
					"tourId": tourId,
					"time": tourTime,
					"thumb": thumbUrl,
                };
                regrouper.flattenTravelers(item);
                $rootScope.cartItems.push(item);
            });
        });
		regrouper.updateTotals();
    	regrouper.broadcastRegroup();
		$rootScope.itemCount = null;
		var pathBlank = typeof($location.path()) == "undefined" || !$location.path();
        if(pathBlank || ($location.path().indexOf('cart') == -1 && $location.path().indexOf('checkout') == -1)){
			if($rootScope.cartItems.length == 0){
				$rootScope.itemCount = "Your cart is empty";
			}
			else if($rootScope.cartItems.length >= 1){
				$rootScope.itemCount = $rootScope.cartItems.length + " Item";
				if($rootScope.cartItems.length > 1) $rootScope.itemCount += "s";
			}
		}
        
        $rootScope.$$phase || $rootScope.$apply(function(){
			if(typeof($routeParams) != "undefined" && $routeParams.step_num && $rootScope.cartItems.length == 0){
				$location.path('cart');
			}
        });
  };

	// flattening the variations travelers for the purposes of a flat ng-repeat display
	regrouper.flattenTravelers = function(item){
		item.travelers = [];
		for(var i = 0; i < item.variations.length; i++){
			var variation = item.variations[i];
			for(var j = 0; j < variation.data.length; j++){
				var traveler = variation.data[j];
				traveler.variationName = variation.name;
				traveler.variationTravelerIndex = j;
				item.travelers.push(traveler);
			}
		}
	}
	
	regrouper.unflattenTravelers = function(){
		for(var i = 0; i < $rootScope.cartItems.length; i++){
			var item = $rootScope.cartItems[i];
			delete item.travelers;
		}
		$rootScope.$$phase || $rootScope.$apply();
	}

   regrouper.updateTotals = function(){
	couponService.processCoupons();
	$rootScope.total = $filter('split_cents')(simpleCart.grandTotal());
	$rootScope.subtotal = $filter('split_cents')(parseFloat(simpleCart.total()) + parseFloat(couponService.totalDiscounts));
	$rootScope.discounts = $filter('split_cents')(couponService.totalDiscounts);
	$rootScope.tax = $filter('split_cents')(simpleCart.tax());
  };

  regrouper.broadcastRegroup = function() {
    $rootScope.$broadcast('regroupDone');
  };

  return regrouper;
}
discoverModule.factory('regroupCartService', ['$rootScope', '$filter', '$location', '$routeParams', 'couponService', RegroupCartService]);