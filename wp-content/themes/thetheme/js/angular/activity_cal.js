var ActivityCal = {
    calObject: null,  
    activityId: null,         // calendar object
    startMoNum: null,          // month/year first calendar instantiated to
    startYr: null,  
    startTime: null,
    militaryStartTime: null,
    processAvailability: true,

    isDefined: function(obj){
		return typeof(obj) != "undefined";
	},

    init: function(options){ 
	    ActivityCal.activityId = options.activityId;
	    ActivityCal.elId = options.elementId; // id of calendar main div
	    jQuery('#' + ActivityCal.elId).html('');
        if(ActivityCal.isDefined(ActivityCal.elId)){ // && typeof(ActivityCal.activityId) != "undefined"){
			if(ActivityCal.isDefined(options.scope) && ActivityCal.isDefined(options.model) && ActivityCal.isDefined(options.scope.cellClick)){
				ActivityCal.setAvailableClick = options.scope.cellClick;
				ActivityCal.scope = options.scope;
				ActivityCal.model = options.model;
			}
            ActivityCal.createCal(options);
            ActivityCal.customizeHTML();
            ActivityCal.startMoNum = ActivityCal.getCurrMo();
            ActivityCal.startYr = ActivityCal.getCurrYr();
			if(!ActivityCal.isDefined(options.processAvailability) || !options.processAvailability){
				ActivityCal.processAvailability = false;
				ActivityCal.markAllAvailable();
			}else{
				ActivityCal.postForAvailability();
			}
        }else{
            jQuery('#' + ActivityCal.elId).hide();
        }
    },
    
    customizeHTML: function(){
        ActivityCal.addSelects();
        ActivityCal.disablePrevMonths();
        ActivityCal.addDateClasses();
        ActivityCal.removeEmptyRows();
        ActivityCal.setLoaderHeight(); //first customize all other html
        angular.element('.bcal-nav').bind('click', ActivityCal.clickCalNav);
		jQuery('.bcal-month-select, .bcal-year-select').bind('change', ActivityCal.dateSelectsChanged);
    },
    
    setLoaderHeight: function(){
        var tableHeight = jQuery('#' + ActivityCal.elId).find('table').outerHeight() + 10;
        var tableWidth = jQuery('#' + ActivityCal.elId).find('table').outerWidth();
        jQuery('#bcal-loader').width(tableWidth);
    },
    
    createCal: function(inputOptions){
	    var calOptions = {
            disablePast: true,
            selectOtherMonths: true,
            dayNames: ["S", "M", "T", "W", "T", "F", "S"],
            element: ActivityCal.elId,
            inline: true,
            months: 1,
            dateFormat: 'm/d/Y'
        };
        if(inputOptions.startYear)
			calOptions.year = inputOptions.startYear;
		if(inputOptions.startMonth)
			calOptions.month = inputOptions.startMonth;
        ActivityCal.calObject = new Calendar(calOptions);
        jQuery('#' + ActivityCal.elId).css('display', 'block');
    },

    removeEmptyRows: function(){
        jQuery('.bcal-empty').each(function(){
            var tr = jQuery(this).parent('tr');
            if(tr.find('.bcal-date').length == 0){
                tr.remove();
            }
        });
    },
    
    addDateClasses: function(){
        jQuery('.bcal-date').each(function(){
          var td =    jQuery(this);
          var dateStr = ActivityCal.getCurrMo() + '/' + td.text() + '/' +  ActivityCal.getCurrYr();
          td.attr('data-date', dateStr);
        });
    },

    addSelects: function(){
        var dateArray = jQuery('.bcal-month').text().split(' '); // 0 => month, 1 => year
        jQuery('.bcal-month').attr('class','bcal-date-selects');

        var currMoName = dateArray[0], currYr = parseInt(dateArray[1]);
        var currMoNum = jQuery.inArray(currMoName, ActivityCal.calObject.option('monthNamesFull')) + 1;

        jQuery('.bcal-date-selects').empty()
                                    .append('<span class=".bcal-month" />')
                                    .append('<select class="bcal-month-select" />')
                                    .append('<select class="bcal-year-select" />');

        ActivityCal.populateSelectOptions(currMoNum, currYr);
    },

    populateSelectOptions: function(mNum, yNum){
        var ySelect = jQuery('.bcal-year-select'), mSelect = jQuery('.bcal-month-select');
        for(var i=1;i<=12;i++){
            var shortName = ActivityCal.calObject.option('monthNames')[i - 1]; // from array of short months, ie Aug
            mSelect.append('<option value="' + i + '">' + shortName + '</option>');
        }
        var baseSelectYr = yNum;
        if(ActivityCal.startYr != null){
            baseSelectYr = ActivityCal.startYr;
        } 
        for(var i=0; i < 3; i++){
            ySelect.append('<option value="' + (baseSelectYr + i) + '">' + (baseSelectYr + i) + '</option>');
        }
        mSelect.val(mNum);
        ySelect.val(yNum);
    },

    disablePrevMonths: function(){
        var leftNav = jQuery('.bcal-nav').first();
        ActivityCal.getCurrMo() == ActivityCal.startMoNum ? leftNav.addClass('bcal-disabled-nav') : leftNav.removeClass('bcal-disabled-nav');
    },

    getCurrMo: function(){
        return parseInt(jQuery('.bcal-month-select').val());
    },

    getCurrYr: function(){
        return parseInt(jQuery('.bcal-year-select').val());
    },

    markAllAvailable: function(){
		jQuery('.bcal-date').addClass('bcal-available');
		ActivityCal.removePastDates();
		ActivityCal.setAvailableClick(ActivityCal.scope, ActivityCal.model);
    },

    markAvailability: function(all_months_json){
		var startTime = ActivityCal.getStartTime();
		var year = ActivityCal.getCurrYr();
		var monthNum = ActivityCal.getCurrMo();
		json = all_months_json[monthNum + '/' + year]; // assume json to already be parsed
		
        ActivityCal.hideLoader();
        jQuery('#' + ActivityCal.elId).find('.bcal-date').removeClass('bcal-available');
        jQuery.each(json, function(index,value){
            var bcalDateTD = jQuery('#' + ActivityCal.elId).find('.bcal-date[data-date="' + value + '"]');
            bcalDateTD.addClass('bcal-available');
            if(bcalDateTD.find('.bcal-available-price').length == 0){
                bcalDateTD.append('<span class="bcal-available-price"></span>');
            }
        });
        ActivityCal.removePastDates();
        
        ActivityCal.markPrices();
        ActivityCal.setAvailableClick();
    },

    removePastDates: function(){
		jQuery('#' + ActivityCal.elId).find('.bcal-past').removeClass('bcal-available');
    },
    
    markPrices: function(){
        var availablePrice = 'Add';
        var firstSelect = jQuery('.participants select').first();
        if(firstSelect.length > 0 && firstSelect.attr('data-price')){
            availablePrice = '$' + firstSelect.attr('data-price');
            if(availablePrice.indexOf('.00')!=-1){
                availablePrice = availablePrice.replace('.00','');
            }
        }
        jQuery('.bcal-available-price').html(availablePrice);
    },

    getSelectedDate: function(cell){
	    var cell = jQuery(cell);
		var cellCopy = cell.clone();
    	var hdht = jQuery('.bg-header').height();
        cellCopy.find('.bcal-available-price').remove();
        return ActivityCal.getCurrMo() + '/' + cellCopy.text() + '/' + ActivityCal.getCurrYr();
	},
    
    setAvailableClick: function(){
        // bind event was not working for some reason with calendar plugin
        jQuery('td.bcal-available').click(function(){
            var scope = angular.element('#' + ActivityCal.elId).scope();
            scope.tourDate = ActivityCal.getSelectedDate(this);
            scope.$apply();
        });
    },
    
    hideLoader: function(){
	    var cal = jQuery('#' + ActivityCal.elId)
	    var loader = cal.prev('.cal-loader');
	    if(loader.length > 0){
			cal.css('visibility', 'visible');
			loader.fadeOut();
	    }
    },
    
    showLoader: function(){
		var cal = jQuery('#' + ActivityCal.elId)
	    var loader = cal.prev('.cal-loader');
	    if(loader.length > 0){
			cal.css('visibility', 'hidden');
			loader.fadeIn();
	    }
    },

    clickCalNav: function(){
        ActivityCal.customizeHTML();
        ActivityCal.postForAvailability();
    },

    dateSelectsChanged: function(){
        var selectedMo = ActivityCal.getCurrMo() - 1;
        var selectedYear = ActivityCal.getCurrYr();
        
        ActivityCal.init({
			"startYear": selectedYear,
			"startMonth": selectedMo,
			"elementId": ActivityCal.elId,
			"activityId": ActivityCal.activityId,
			"processAvailability": ActivityCal.processAvailability,
			"scope": ActivityCal.scope,
			"model": ActivityCal.model
		});
    },
    
    getStartTime: function(){
        return ActivityCal.startTime;
    },
	
	postForNginxAvailability: function(startTime, year, monthNum){
		var data = {cart_action: 'get_availability', postId: ActivityCal.activityId, 
		            startTime: startTime, activityYr: year, activityMoNum: monthNum};
		var ajaxUrl = siteRoot + '/wp-admin/admin-ajax.php';
		jQuery.ajax({
		  url: ajaxUrl,
		  data: data,
		  success: ActivityCal.markAvailability,
		  error: function(){
			/*console.log("error");
			console.log("data", data);
			console.log("url", ajaxUrl);*/
		  }
		});
	},
	
	checkAvailabilityInJSON: function(json){
		var startTime = ActivityCal.getStartTime();
		var year = ActivityCal.getCurrYr();
		var monthNum = ActivityCal.getCurrMo();
		if(ActivityCal.isDefined(json) && json != null && json[monthNum + '/' + year]){
			ActivityCal.markAvailability(json);
		}else{
			ActivityCal.postForNginxAvailability(startTime, year, monthNum); // error json for the month wasn't in file
		}
	},
    
    postForAvailability: function(startTime, militaryTime){
	    if(ActivityCal.processAvailability){
			if(ActivityCal.isDefined(startTime)){
				ActivityCal.startTime = startTime;
			}
			if(ActivityCal.isDefined(militaryTime)){
				ActivityCal.militaryStartTime = militaryTime;
			}
	        ActivityCal.showLoader();
			var domain = document.domain.toString();
			//var cdnurl = '//cdn.discoverhawaiitours.com/';
			//if(domain == 'mirror.discoverhawaiitours.com')
			var cdnurl = "//s3.amazonaws.com/mirror.discoverhawaiitours.com/";

			var startTime = ActivityCal.getStartTime();
			var year = ActivityCal.getCurrYr();
			var monthNum = ActivityCal.getCurrMo();

			
			if(startTime && year && monthNum){
				if(domain != 'staging.discoverhawaiitours.com') { // do on everything but staging first, including on localhost
			        var cdnAjaxUrl = cdnurl + "staging_activity_json/" + ActivityCal.activityId + "/" + ActivityCal.militaryStartTime + ".json";
		            jQuery.ajax(
		            {
		                type: "GET",
		                dataType: "json",
		                url: cdnAjaxUrl,
		                success: ActivityCal.checkAvailabilityInJSON,
		                error: function(xhr, statusText) { // error could not find the json file
		                    ActivityCal.postForNginxAvailability(startTime, year, monthNum);
		                }
		            });
		        } else {
		            ActivityCal.postForNginxAvailability(startTime, year, monthNum);
		        }
			}
	        
		}else{
			ActivityCal.markAllAvailable();
		}
    }
};