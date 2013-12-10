function MatchDirective($parse) {
  return {
    require: 'ngModel',
    link: function(scope, elem, attrs, ctrl) {
      scope.$watch(function() {        
        return $parse(attrs.match)(scope) === ctrl.$modelValue;
      }, function(currentValue) {
        ctrl.$setValidity('mismatch', currentValue);
      });
    }
  };
};
discoverModule.directive('match', ['$parse', MatchDirective]);

discoverModule.directive('dynamicMask', function() {
  return {
    link: function(scope, elem, attrs) {
		var maskType = attrs.mask;
        if(maskType == 'cc'){
			jQuery("input.ccnumber").inputmask("9999 9999 9999 9999",{ "placeholder": " " });
			jQuery("cards li").removeClass('on');
        }else if(maskType == 'phone'){
			jQuery("input.phonefield").inputmask("(999) 999-9999",{ "placeholder": " " });
        }
    }
  };
});

discoverModule.directive('step', function($parse) {
  return {
    link: function(scope, elem, attrs) {
	   // do something here later
    }
  };
});

function PopoverCalDirective($templateCache, $compile){
  return function(scope, element, attrs) {
	    var model = attrs.ngModel;
	    var placement = attrs.placement || 'bottom';
	    var popoverClass = attrs.popoverClass || 'inline-popover-cal';
	    var processAvailability = (attrs.availability == true) || false;
	    var activityId = attrs.activityId || null;
		scope.cellClick = function(scope, model){
			jQuery('td.bcal-available').click(function(){
	            var dateStr = ActivityCal.getSelectedDate(this);
				scope.$apply(model + " = '" + dateStr + "'");
				jQuery('.popover-cal').popover('hide');
	        });
		};
		element.addClass('popover-cal');
		scope.calendarId = 'popover-cal';
		element.popover({
			trigger: 'click',
			html: true,
			placement: placement,
			content: function(){ 
				jQuery('#popover-cal').remove(); // remove id instantly
				jQuery('.popover-cal').not(element).popover('hide'); // wait for calendar to hide
				return jQuery.trim($templateCache.get('Calendar.html'));
			}
		}).on('shown.bs.modal', function (e) {
			
			var popoverElement = angular.element('.popover-content');
			
			$compile(popoverElement.contents())(scope);
			scope.$apply();
			var calOptions = {
			  "elementId": scope.calendarId,
			  "processAvailability": processAvailability,
			  "scope": scope,
			  "model": model,
			  "activityId": activityId,
			}
			ActivityCal.init(calOptions);
			angular.element('.popover').addClass(popoverClass);
		});
  }
};
discoverModule.directive('popoverCal', ['$templateCache', '$compile', PopoverCalDirective]);

discoverModule.directive('popoverCalAddon', function() {
  return {
    link: function(scope, elem, attrs) {
	   elem.on('click', function(){
		elem.prev('input').click();
	   });
    }
  };
});

discoverModule.directive('dynamicPopover', function() {
  return function(scope, element, attrs) {
	var placement = attrs.placement;
	if(typeof(placement) == "undefined" || !placement){
		placement = 'right';
	}
	element.popover({
		html: true,
	    trigger: 'hover', 
	    placement: placement
	});
  }
});

discoverModule.directive('validateCard', function() {
  return function(scope, element, attrs) {
	jQuery(document).ready(function(){
		if(jQuery('.ccnumber').length > 0){
			CreditCardValidator.init('.ccnumber');
		}
	});
  }
});