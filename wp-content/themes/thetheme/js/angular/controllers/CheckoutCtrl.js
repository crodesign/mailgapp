function CheckoutCtrl($scope, $rootScope, $filter, $http, $location, $routeParams, stepUpdateService, regroupCartService, couponService){
	$scope.cartTitle = 'Your Shopping Cart';
	$scope.orderTitle = 'Purchase Summary';
	$scope.bookingText = 'Complete Booking';
	$scope.processingOrder = false; // set to true when processing occurring
	$scope.selectedDate = 'not filled in';
	$scope.currentForm = null;
	$scope.months = [
					{"name" : "Jan", "num" : 1}, {"name" : "Feb", "num" : 2}, {"name" : "Mar", "num" : 3},
					{"name" : "Apr", "num" : 4}, {"name" : "May", "num" : 5}, {"name" : "Jun", "num" : 6},
					{"name" : "Jul", "num" : 7}, {"name" : "Aug", "num" : 8}, {"name" : "Sep", "num" : 9},
					{"name" : "Oct", "num" : 10 }, {"name" : "Nov", "num" : 11}, {"name" : "Dec", "num" : 12},
					];
	$scope.steps = ['one', 'two', 'thanks'];
	
	$scope.multipleIslands = false;
	
	$scope.$on('stepUpdated', function() {
	  $scope.step = stepUpdateService.step; 
	});
	
	$scope.defineBillingData = function(){
		if(typeof($rootScope.billingData) == "undefined"){
			$rootScope.billingData = {}
			$rootScope.billingData.agree = true;
			$rootScope.billingData.emails = $rootScope.billingData.emails || [{}]; // default to one email that's empty so can repeat on fields
			$rootScope.billingData.country = 'United States';
		}
	}
	$scope.defineBillingData();
	
	// todo remove this function
	$scope.checkEmailRequired = function(field)
	{
	}
	
	$scope.addEmail = function(form){
		// only add another email if the current email is filled in and valid
		if(form.$valid){
			$rootScope.billingData.emails.push({});
		}
	}
	
	$scope.removeEmail = function(index){
		if(index != 0 && index <= ($rootScope.billingData.emails.length - 1))
			$rootScope.billingData.emails.splice(index, 1); // remove from array
	}
	
	// do the next six years on init
	$scope.initNextSixYears = function(){
		var today = new Date();
		var currentMonth = today.getMonth() + 1;
		var currentYear = today.getFullYear();
		var firstOfMonth = new Date(currentMonth + '/1/' + currentYear);
		
		if(typeof($rootScope.billingData) != "undefined" && typeof($rootScope.billingData.cc_expiration_month) != "undefined"){
			currentMonth = $rootScope.billingData.cc_expiration_month;
		}
		
		var compareDate = new Date(currentMonth + '/1/' + currentYear);
		if(compareDate < firstOfMonth){
			currentYear += 1;
		}
		$scope.nextSixYears = [];
		for(var i = 0; i < 6; i++)
			$scope.nextSixYears.push(currentYear + i);
	}
	$scope.initNextSixYears();
	
	$scope.itemRequiresMoreInfo = function(item){
		var requiresMore = false;
		var requiredFields = ["shoe_size_required", "weight_required", "height_required", "lunches_required"];
		for(var i = 0; i < requiredFields.length; i++){
			var field = requiredFields[i];
			if(item.json && item.json[field]){
				requiresMore = true;
			}
		}
		return requiresMore;
	};
	
	
	$scope.isCurrentStep = function(step) {
	  return $scope.step === step;
	};
    
	$scope.setCurrentStep = function(step) {
	  $scope.step = step;
	};
    
	$scope.getCurrentStep = function() {
	  return $scope.steps[$scope.step];
	};
	
	$scope.isFirstStep = function() {
	        return $scope.step === 0;
	};
    
	$scope.isLastStep = function() {
	    return $scope.step == $scope.steps.length - 2; // the step to submit - before the thanks step
	};
	
	$scope.isThanksStep = function() {
	    return $scope.step == $scope.steps.length - 1; // the step to submit - before the thanks step
	};
	
	$scope.areMultipleItems = function() {
		if(typeof($rootScope.cartItems) != "undefined" && $rootScope.cartItems != null)
	    	return $rootScope.cartItems.length > 1;
	};
    
	$scope.getNextLabel = function() {
	    return ($scope.isLastStep()) ? 'SUBMIT' : 'NEXT STEP'; 
	};
    
	$scope.handlePrevious = function() {
		if(!$scope.isFirstStep()){
			$location.path('checkout/step' + ($scope.step));
		}
	};
    
	$scope.handleNext = function() {
		if(typeof($routeParams) != "undefined" && $routeParams.step_num && $rootScope.cartItems.length == 0){
			$location.path('cart');
		}else{
			if($scope.currentForm.$valid && !$scope.isLastStep()) {
			   $location.path('checkout/step' + ($scope.step + 2));
			   $scope.saveDataToSimpleCart();
		    }else if($scope.isLastStep()){
				if($rootScope.billingData.agree && $scope.currentForm.$valid){
					$scope.submitCheckout();
				}
			}
		}
	};
	
	$scope.saveDataToSimpleCart = function(){
		regroupCartService.unflattenTravelers(); // remove flat array of travelers (separate) from variations
		angular.forEach($rootScope.cartItems, function(item, itemIndex){
				angular.forEach(item.variations, function(variation, variationIndex){
		        var simpleCartId = variation.id;
		        if(simpleCartId){ // simple cart item id, if quantity is 0 it won't have one
		 		   var simpleCartItem = simpleCart.find(simpleCartId);
		           if(itemIndex == 0 && variationIndex == 0){
						simpleCartItem.set('billing', $scope.santizeBillingDataForSave()); // todo strip out cc info here
				   }
		 		   simpleCartItem.set('data', variation.data);
		 		   simpleCart.save();
		 		}
		 	});
		});
	};
	
	$scope.santizeBillingDataForSave = function(){
		var data = angular.copy($rootScope.billingData);
		var banFields = ['cc_expiration_month', 'cc_expiration_year', 'cc_ccv', 'cc_number'];
		for(var i = 0; i < banFields.length; i++){
			var field = banFields[i];
			delete data[field];
		}
		return data;
	};
	
	$scope.setCurrentItem = function(item){
		$rootScope.currentItem = item;
	};
	
	$scope.setHotels = function(){
		var islandName = $rootScope.billingData.island.toLowerCase();
		$scope.hotels = $scope.hotelsByIsland[islandName];
	};
	
	$scope.setHotelsByIsland = function(data, status){
		$scope.hotelsByIsland = data;
		$scope.updateIslands();
	};
	$rootScope.$watch('cartItemIslands', $scope.updateIslands);
	
	$scope.updateIslands = function(){
		if(typeof($rootScope.billingData) == "undefined"){
			$rootScope.billingData = {};
		}
		if(typeof($rootScope.cartItemIslands) != "undefined" && $rootScope.cartItemIslands != null &&
		   $rootScope.cartItemIslands.length != 0){
			$rootScope.billingData.island = $rootScope.cartItemIslands[0];
			if($rootScope.cartItemIslands.length > 1){
				$scope.multipleIslands = true;
			}
		}else{
			$rootScope.billingData.island = "oahu"; // default to oahu
		}
		$scope.setHotels();
	};

    $scope.fetchHotels = function() {
      $scope.jsonURL = "https://s3.amazonaws.com/mirror.discoverhawaiitours.com/hotels.json";
      $http.get($scope.jsonURL).success($scope.setHotelsByIsland);
    }

    $scope.fetchHotels();

    $scope.initCCValidator = function(){
		CreditCardValidator.init('.ccnumber');
	};
	
	$scope.setCurrentForm = function(form){
		$scope.currentForm = form;
	};
	
	$scope.submitCheckout = function(){
	    $scope.checkoutUrl = "http://" + document.domain + "/checkout/process";
	    var data = {billingData: $scope.billingData, cartItems: $scope.cartItems, coupons: couponService.coupons};
	    $scope.processingOrder = true;
	    $scope.bookingText = "Processing Order ...";
		$http.post($scope.checkoutUrl, data).success($scope.successfulCheckout).error(function(data, status, headers, config) {
		    alert("Sorry, we could not complete your transaction at this time. Please try again later.");
		});
	};
	
	$scope.successfulCheckout = function(){
	    $scope.step += 1;
		$rootScope.finalBillingData = angular.copy($rootScope.billingData);
		$rootScope.finalCartItems = angular.copy($rootScope.cartItems);
		$rootScope.finalSubtotal = angular.copy($rootScope.subtotal);
		$rootScope.finalTotal = angular.copy($rootScope.total);
		$rootScope.finalTax = angular.copy($rootScope.tax);
		$rootScope.finalDiscounts = angular.copy($rootScope.discounts);
		simpleCart.empty();
		simpleCart.save();
		$scope.$$phase || $scope.$apply();
		/*$rootScope.$$phase || $rootScope.$apply(function() {
		});*/
		$location.path('checkout/thanks');
	};
	
	$scope.failCheckout = function(){
		alert("Sorry, the checkout was unsuccessful. Please try again later");
	};
	
	$scope.isCheckout = true;
	
	$scope.setStartStep = function(){
		if($routeParams.step_num){
			var stepNum;
			if($routeParams.step_num.indexOf('thanks') == -1){
				stepNum = parseInt($routeParams.step_num.replace('step', ''));
			}else{
				if(typeof($rootScope.finalTotal) != "undefined" && $rootScope.finalTotal){	
					stepNum = $scope.steps.length; // go to last step, non-zero index to match path indexing
				}else{
					return $location.path('cart');
				}
			}
			if(stepNum && stepNum <= $scope.steps.length){
				$scope.step = stepNum - 1;
			}
		}else{
			$scope.step = 0;
			$location.path('checkout/step1');
		}
	};
	$scope.setStartStep();
	
	$scope.maskCC = function($event){
		var value = jQuery($event.currentTarget).inputmask("unmaskedvalue");
		var parsedCCNumber = value.replace(/ /g,"");
		$scope.currentForm.ccnumber.$setViewValue(parsedCCNumber); // fix view value from input mask
		if (value.length === 0 ) {
		    jQuery(".cards li").removeClass('on');
		} else if (value.length === 2 && value === "37") {
		    jQuery("input.ccnumber").inputmask("9999 999999 99999",{ "placeholder": " " });
		    jQuery(".cards li").removeClass('on');
		    jQuery("li.amex").addClass('on');
		} else if (value.length === 2 && value === "40") {
		    jQuery("input.ccnumber").inputmask("9999 9999 9999 9999",{ "placeholder": " " });
		    jQuery(".cards li").removeClass('on');
		    jQuery("li.visa").addClass('on');
		} else if (value.length === 2 && value === "41") {
		    jQuery("input.ccnumber").inputmask("9999 9999 9999 9999",{ "placeholder": " " });
		    jQuery(".cards li").removeClass('on');
		    jQuery("li.visa").addClass('on');
		} else if (value.length === 2 && value === "51") {
		    jQuery("input.ccnumber").inputmask("9999 9999 9999 9999",{ "placeholder": " " });
		    jQuery(".cards li").removeClass('on');
		    jQuery("li.mastercard").addClass('on');
		} else if (value.length === 2 && value === "60") {
		    jQuery("input.discover").inputmask("9999 9999 9999 9999",{ "placeholder": " " });
		    jQuery(".cards li").removeClass('on');
		    jQuery("li.discover").addClass('on');
		}
	}
    
	$scope.maskPhone = function($event){
		var value = jQuery($event.currentTarget).inputmask("unmaskedvalue").replace(/ /g,"");
		$scope.currentForm.cell.$setViewValue(value); // fix problem with jquery plugin not setting view value
	};
	
	$scope.zips = []; // cache the zips to prevent dup requests
	$scope.zipLookup = function($event){
		$event.preventDefault();
		var city, state, country;
        currentValue = $rootScope.billingData.zip;
        if(typeof(currentValue) != "undefined" && currentValue.length >= 4 && $event.which != 69){
	        if(typeof($scope.zips[$rootScope.billingData.country]) != "undefined" && 
	           $scope.zips[$rootScope.billingData.country][currentValue]){
		        city = $scope.zips[$rootScope.billingData.country][currentValue].city;
		        state = $scope.zips[$rootScope.billingData.country][currentValue].state;
				$scope.setCityState(city, state);
	        }else{
				var url = 'https://maps.googleapis.com/maps/api/geocode/json?address=' + currentValue + '&sensor=false';
				$http.get(url).success(function(data){
					if(data.status == "OK" && data.results.length > 0){
						var components = data.results[0].address_components;
						for(var i = 0; i < components.length; i++){
							var component = components[i];
							var types = component.types;
							if(jQuery.inArray('administrative_area_level_1', types) != -1){ // this is a state
								state = component.short_name;
							}else if(jQuery.inArray('locality', types) != -1){
								city = component.long_name;
							}else if(jQuery.inArray('country', types) != -1){
								country = component.long_name;
							}
						}
						if(!city || !state || !country){
							$scope.clearCityState();
						}else if(country == $rootScope.billingData.country){
							$scope.setCityState(city, state);
							if(typeof($scope.zips[country]) == "undefined"){
								$scope.zips[country] = [];
							}
							$scope.zips[country][currentValue] = {"city": city, "state": state};
						}
					}else{
						$scope.clearCityState();
					}
				}).error(function(){
					$scope.clearCityState();
				});
	        }
		}
	}
	
	$scope.setCityState = function(city, state){
		$scope.currentForm.state.$setViewValue(''); // make the field dirty
		$rootScope.billingData.state = state;
		$scope.currentForm.city.$setViewValue(''); // make the field dirty
		$rootScope.billingData.city = city;
	}
	
	$scope.clearCityState = function(){
		$scope.currentForm.city.$setPristine();
		$scope.currentForm.state.$setPristine();
		$rootScope.billingData.state = null;
		$rootScope.billingData.city = null;
	}
	
	$scope.changeCountry = function(){
		$rootScope.billingData.zip = null;
		$scope.currentForm.zip.$setPristine();
		$scope.clearCityState();
	}
	
	regroupCartService.regroup();
}
CheckoutCtrl.$inject = ['$scope', '$rootScope', '$filter', '$http', '$location', '$routeParams', 'stepUpdateService', 'regroupCartService', 'couponService'];
discoverModule.controller('CheckoutCtrl', CheckoutCtrl);