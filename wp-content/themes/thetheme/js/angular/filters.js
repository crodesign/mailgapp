discoverModule.filter('range', function() {
  return function(input, min, max) {
    min = parseInt(min); //Make string input int
    max = parseInt(max);
    for (var i=min; i<=max; i++)
      input.push(i);
    return input;
  };
});

discoverModule.filter('neg_range', function() {
  return function(input, min, max) {
    min = parseInt(min); //Make string input int
    max = parseInt(max);
    for (var i=max; i>=min; i--)
      input.push(i);
    return input;
  };
});

discoverModule.filter('date_parts', function() {
    return function(input) {
	  var output = {};
	  var fullDate = new Date(input);
	  if(fullDate.getFullYear() > 0){ // validate date
		var monthNames = ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"];
		  var day, month, year;
		  if(typeof(input) != "undefined"){
			day = fullDate.getDate();
			month = monthNames[fullDate.getMonth()];
			year = fullDate.getFullYear();
		  }
		  output =  {day: day, month: month, year: year};
	  }
      return output;
    }
});

discoverModule.filter('visible_variations', function() {
    return function(variations) {
	  var output = [];
	  angular.forEach(variations, function(variation, index){ 
		if(variation.visible)
			output.push(variation); 
	  });
      return output;
    }
});

function SplitCentsFilter($filter) {
    return function(amount, hideDollar, freeText) {
	  	var parts = ['$0', '00'];
	    var amountLabel = '';
	    if(freeText && amount == 0){
			amountLabel = freeText;
	    }else{
			if(typeof(amount) != "undefined" && amount != null && amount != 0){
			    amount = $filter('currency')(amount);
				parts = amount.toString().split('.')
			}
			if(hideDollar){
				parts[0] = parts[0].replace('$','');
		    }
			amountLabel = parts[0] + '.' + '<sup>' + parts[1] + '</sup>'
	    }
		return amountLabel;
    }
};
discoverModule.filter('split_cents', ['$filter', SplitCentsFilter]);