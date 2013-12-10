function CheckoutCtrl($scope, $rootScope, $filter, $http, $location, $routeParams, stepUpdateService, regroupCartService, couponService){
	$scope.cartTitle = 'Shopping Cart';
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
		console.log("redefined");
		if(typeof($rootScope.billingData) == "undefined"){
			$rootScope.billingData = {}
			$rootScope.billingData.agree = true;
			$rootScope.billingData.emails = $rootScope.billingData.emails || [{}]; // default to one email that's empty so can repeat on fields
			$rootScope.billingData.country = 'United States';
		}
	}
	$scope.defineBillingData();
	
	
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
	
	$scope.nextSixYears = function(){
		var years = [];
		var date = new Date();
		var year = date.getFullYear();
		for(var i = 0; i < 6; i++){
			years.push(year + i);
		}
		return years;
	}
	
	$scope.itemRequiresMoreInfo = function(item){
		var requiresMore = false;
		var requiredFields = ["shoe_size_required", "weight_required", "height_required", "lunches_required"];
		for(var i = 0; i < requiredFields.length; i++){
			var field = requiredFields[i];
			if(item.json && item.travelerOptions[field]){
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
	    if($scope.currentForm.$valid && !$scope.isLastStep()) {
		   console.log("fuck up");
		   $location.path('checkout/step' + ($scope.step + 2));
		   $scope.saveDataToSimpleCart();
	    }else if($scope.isLastStep()){
			if($rootScope.billingData.agree && $scope.currentForm.$valid){
				$scope.submitCheckout();
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
				   simpleCartItem.set('json', item.json);
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
		$scope.defineBillingData();
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
	
	$scope.arActivities = [];
	$scope.loadNextARActivity = function(cartIndex){
		if(typeof($rootScope.cartItems[cartIndex]) == "object"){
			var item = $rootScope.cartItems[cartIndex];
			$ar.checkout.activity({
				id: item.arActivity.id,
				timestamp: new Date(item.date + " " + item.time)
			}).load(function(resp){
				if(resp.error)
					alert("Sorry, could not complete transaction at this time");
				else{
					$scope.arActivities.push(resp.message);
					if($rootScope.cartItems.length > (cartIndex + 1)){
						$scope.loadNextARActivity(cartIndex + 1);
					}else{
						// you're done load ar activities so lets create the tickets
						$scope.createARSale();
					}
				}
			});
		}
	};
	
	$scope.findAROptionIndex = function(items, value){
		var valueIndex = -1;
		angular.forEach(items, function(item, itemIndex){
			if(item.name == value){
				valueIndex = itemIndex;
			}
		});
		return valueIndex;
	};
	
	$scope.createARSale = function(){
		angular.forEach($scope.arActivities, function(activity, index){
			angular.forEach($rootScope.cartItems, function(item, cartItemIndex){
				
				angular.forEach(item.variations, function(variation, cartItemVariationIndex){
					if(variation.quantity > 0){
				angular.forEach(variation.data, function(traveler, variationTravelerIndex){
					
						var ticket = activity.generate_ticket(cartItemVariationIndex);
						
						var optionValue = null;
						angular.forEach(ticket.options, function(option, index){
							if(option.kind == "Dropdown"){
								var itemIndex = -1;
								if(option.name == "Lunch Choice"){
									itemIndex = $scope.findAROptionIndex(option.items, traveler.lunch);
								}
								if(itemIndex != -1)
									option.selectedItem = option.items[1];
							}
							if(option.name == "Body Weight"){//&& option.required == 1){ //todo fix this once ar fixes it
								optionValue = traveler.weight;
							}
							/*if(option.name == "Airline Required"){//&& option.required == 1){ //todo fix this once ar fixes it
								airlineRequired = true;
							}*///todo put dynamic first and last name and birthday in here
						});
						$scope.arSale.tickets.push(ticket); //add the ticket to the sale
						// todo how do i do this now???
							/*
							var option2 = $ar.checkout.option({
								name: 'beans',
								text: 'more beans',
								type: 'text'
							});
							*/
							/*ticket.options.push(option2);*/
					
				});
			}
				});
			});
		});
		var paymentType = null;
		if(typeof($scope.arPos.payment_types) == "object" && $scope.arPos.payment_types.length > 0){
			var payment = $scope.arPos.payment_types[0].clone();
            
			var paymentData = {
				first_name: $rootScope.billingData.firstname,
				last_name: $rootScope.billingData.lastname,
				phone: $rootScope.billingData.cell_phone,
				address: $rootScope.billingData.street,
				city: $rootScope.billingData.city,
				state: $rootScope.billingData.state,
				postal: $rootScope.billingData.zip,
				country: $rootScope.billingData.country
			};
            
			var cardData = {	
				number: $rootScope.billingData.cc_number,
				year: $rootScope.billingData.cc_expiration_year,
				month: $rootScope.billingData.cc_expiration_month,
				code: $rootScope.billingData.cc_ccv
			};
            
			payment.serialize({
				payee: paymentData,
				card: cardData,
				amount: $scope.arSale.total_due()
			});		
			$scope.arSale.payments = [payment];

		    $scope.arSale.serialize({
		    	leadGuest: { //make sure there's a lead guest
		    		first_name: $rootScope.billingData.firstname,
		    		last_name: $rootScope.billingData.lastname,
		    		email: $rootScope.billingData.emails[0].address,
		    		phone: $rootScope.billingData.cell_phone
		    	}
		    });

		    payment.serialize({
				amount: $scope.arSale.total()
			});
			if($scope.arSale.validate()){
				$scope.arSale.save(function(resp){
					$scope.successfulCheckout();
					/*for(var ni = 0; ni < sale.tickets.length; ni++){
						if(!sale.tickets[ni].cfa) continue;
						console.log("     ticket[" + sale.tickets[ni].id + "] pending. please call " + sale.tickets[ni].cfa + " for availability");
					}*/
				});
            }else{
				$scope.failCheckout($scope.arSale.errors);
			}
		}else{
			$scope.failCheckout("no payment type");
		}
	};
	
	$scope.submitCheckout = function(){
		if($rootScope.cartItems.length > 0)
			$scope.loadNextARActivity(0);
		else
			$scope.failCheckout("cart was empty");
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
		$rootScope.$$phase || $scope.$apply();
		$rootScope.$apply(function() {
		   $scope.cartTitle = 'Order';
		   $location.path('checkout/thanks');
		   
		});
	};
	
	$scope.failCheckout = function(msg){
		console.log(msg); // todo log the message somewhere
		alert("Sorry, the checkout was unsuccessful. Please try again later");
	};
	
	$scope.isCheckout = true;
	
	$scope.setStartStep = function(){
		console.log("set start step");
		if($routeParams.step_num){
			var stepNum;
			if($routeParams.step_num.indexOf('thanks') == -1){
				stepNum = parseInt($routeParams.step_num.replace('step', ''));
			}else{
				console.log("we went to thanks");
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
	
	$scope.arPos = $ar.di.get('pos');
	$scope.arPos.load('a3187b91a1d20a994533694b92b813dbbe96ab74528c028b101781.49241478', function(){
		$scope.arSale = $ar.checkout.sale();
	});
	regroupCartService.regroup();
}
CheckoutCtrl.$inject = ['$scope', '$rootScope', '$filter', '$http', '$location', '$routeParams', 'stepUpdateService', 'regroupCartService', 'couponService'];
discoverModule.controller('CheckoutCtrl', CheckoutCtrl);