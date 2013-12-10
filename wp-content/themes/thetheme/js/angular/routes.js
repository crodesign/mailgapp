discoverModule.config(['$routeProvider',
    function ($routeProvider) {
        $routeProvider.
        when('/activity/search/price/:range', {
            templateUrl: 'Book.html',
            controller: 'BookCtrl'
        }).
        when('/activity/search/:date', {
            templateUrl: 'Book.html',
            controller: 'BookCtrl'
        }).
        when('/activity/search/interests/:tag', {
            templateUrl: 'Book.html',
            controller: 'BookCtrl'
        }).
        when('/activity/search/:keyword', {
            templateUrl: 'Book.html',
            controller: 'BookCtrl'
        }).when('/activity/search/island/:island', {
            templateUrl: 'Book.html',
            controller: 'BookCtrl'
        }).
        when('/book/:activity_id', {
            templateUrl: 'Book.html',
            controller: 'BookCtrl'
        }).
        when('/cart', {
            templateUrl: 'Cart.html',
            controller: 'CartCtrl'
        }).
        when('/checkout/:step_num', {
            templateUrl: 'Checkout.html',
            controller: 'CheckoutCtrl'
        }).otherwise({
			redirectTo: '/cart'
	 	});
	 	}
]);