var dateRanges = new Array;

function refreshMap(){
	//	(ol3_layers[_defaultLayer].getSource()).updateDimensions(nasa_layers[_defaultLayer].resolutions);
	var randNumber = Math.floor((Math.random()*100)+1);
	(ol3_layers[_defaultLayer].getSource()).updateDimensions([1,randNumber]);
}

/**
 * Function used to update the current date 
 * @returns {undefined}
 */
function updateLayerDate(){

	var newDate = $("#datepicker").val();
	var tempLayer= ol3_layers[_defaultLayer];
	var layerSource = tempLayer.getSource();
	var superTileUrlFunction = layerSource.tileUrlFunction;
	
	refreshMap();
	
	layerSource.tileUrlFunction = function() {
		var url = superTileUrlFunction.apply(layerSource, arguments);
		//Checks if the url already has a TIME parameter
		if(url){
			if(url.indexOf('TIME') !== -1){
				//Remove old time
				url = url.substring(0, url.length - 16);
			}
			url += "&TIME="+newDate; 
//			saveCurrentRequests(url);
			return url; 
		} };
	
}

/**
 * Initializes the date textfields 
 * @returns {undefined}
 */
function initDatePickers(){

	$("#clearRanges").click(clearDateRanges);

	// Initialize the calendar. 
	$("#datepicker").datepicker({
		dateFormat:'yy-mm-dd',
		changeMonth: true,
		changeYear: true,
		maxDate: "+d"
	});

	var yesterday = new Date(); 
	yesterday.setDate(yesterday.getDate() - 1);

	$("#datepicker").val($.datepicker.formatDate('yy-mm-dd', yesterday));
	$("#datepicker").change(updateLayerDate);
	
	$( "#from" ).datepicker({
		dateFormat: 'yy-mm-dd',
		defaultDate: "-1d",
		changeMonth: true,
		numberOfMonths: 1,
		changeYear: true,
		maxDate: "-1d",
		onClose: function( selectedDate ) {
			$( "#to" ).datepicker( "option", "minDate", selectedDate );
		}
    });
    $( "#to" ).datepicker({
		dateFormat: 'yy-mm-dd',
		defaultDate: "+d",
		maxDate: "+d",
		changeMonth: true,
		changeYear: true,
		numberOfMonths: 1,
		onClose: function( selectedDate ) {
			$( "#from" ).datepicker( "option", "maxDate", selectedDate );
		}
    });
}

function validateDates(){
	var startInput = $("#from");
	var endInput = $("#to");
	var startdate = startInput.val();
	var enddate = endInput.val();
	
	var startGrp = $("#grpDateFrom"); 
	var endGrp = $("#grpDateTo"); 
	
	//Verify if the user has selected start and end dates
	var startClass = startdate? "has-success":"has-error";
	var endClass = enddate? "has-success":"has-error";
	
	// Remove classes from the form   groups
	startGrp.removeClass("has-success has-error");
	endGrp.removeClass("has-success has-error");
	
	//Adds the correct classes to the inputs
	startGrp.addClass(startClass);
	endGrp.addClass(endClass);
	
	if(startdate && enddate){
		var startDateStr = startdate.split("-");
		var endDateStr = enddate.split("-");
		
		var d1 = new Date(startDateStr[0],startDateStr[1],startDateStr[2]);
		var d2 = new Date(endDateStr[0],endDateStr[1],endDateStr[2]);
		
		var n1 = d1.getTime();
		var n2 = d2.getTime();
		var totaldays = (n2-n1+1)/86400000;
		
		var c1 = new Date(0);
		var yyyy = d2.getFullYear();
		selectedYear = yyyy;
		
		dates = new Array();
		currentDate  =  n1;
		var partdatelist = new Array;
		for(i = 0;i<=totaldays;i++){
			c1.setTime(currentDate);
			var dd = ("0" + c1.getDate() ).slice(-2);
			var mm = ("0" + (c1.getMonth() )).slice(-2);
			
			partdatelist[i] = selectedYear+"-"+mm+"-"+dd;	
			dates.push(partdatelist[i]);
			currentDate+=86400000;
		}
		dateRanges = dateRanges.concat(partdatelist);
		
		var tempStart = selectedYear+"/"+d1.getMonth()+"/"+d1.getDate();
		var tempEnd = selectedYear+"/"+d2.getMonth()+"/"+d2.getDate();
		addDateRangeText(tempStart,tempEnd);
		
		// Remove classes from the form   groups
		startGrp.removeClass("has-success has-error");
		endGrp.removeClass("has-success has-error");
		
		return true;
	}
	return false;
}

function addDateRange(){
	var startInput = $("#from");
	var endInput = $("#to");
	var startdate = startInput.val();
	var enddate = endInput.val();
	
	var startGrp = $("#grpDateFrom"); 
	var endGrp = $("#grpDateTo"); 
	
	//Verify if the user has selected start and end dates
	var startClass = startdate? "has-success":"has-error";
	var endClass = enddate? "has-success":"has-error";
	
	// Remove classes from the form   groups
	startGrp.removeClass("has-success has-error");
	endGrp.removeClass("has-success has-error");
	
	//Adds the correct classes to the inputs
	startGrp.addClass(startClass);
	endGrp.addClass(endClass);
	
	if(startdate && enddate){
		var startDateStr = startdate.split("-");
		var endDateStr = enddate.split("-");
		
		var d1 = new Date(startDateStr[0],startDateStr[1],startDateStr[2]);
		var d2 = new Date(endDateStr[0],endDateStr[1],endDateStr[2]);
		
		var n1 = d1.getTime();
		var n2 = d2.getTime();
		var totaldays = (n2-n1+1)/86400000;
		
		var c1 = new Date(0);
		selectedYear = parseInt($("#selectedYear").val());	
		var yyyy = d2.getFullYear();
		
		if(selectedYear > yyyy){
			selectedYear = yyyy;
		}
		
		dates = new Array();
		for(var j = 0;j <= (yyyy-selectedYear);j++){
			currentDate  =  n1;
			var partdatelist = new Array;
			for(i = 0;i<=totaldays;i++){
				c1.setTime(currentDate);
				var dd = ("0" + c1.getDate() ).slice(-2);
				var mm = ("0" + (c1.getMonth() )).slice(-2);
				
				partdatelist[i] = (yyyy-(yyyy-selectedYear)+j)+"-"+mm+"-"+dd;	
				dates.push(partdatelist[i]);
				currentDate+=86400000;
			}
			dateRanges = dateRanges.concat(partdatelist);
			
			var tempStart = (selectedYear+j)+"/"+d1.getMonth()+"/"+d1.getDate();
			var tempEnd = (selectedYear+j)+"/"+d2.getMonth()+"/"+d2.getDate();
			addDateRangeText(tempStart,tempEnd);
		}	
		//	console.log(dateRanges);
		
		// Remove classes from the form   groups
		startGrp.removeClass("has-success has-error");
		endGrp.removeClass("has-success has-error");
		
		startInput.val("");
		endInput.val("");
	}
	
}

/**
 * Function used to clear the selected time ranges 
 * @returns {undefined}
 */
function clearDateRanges(){
	dateRanges = new Array;
	
	var selectedRanges = $("#selectedRanges");
	selectedRanges.hide();
	
	var list = $("#selectedRangesTexts");
	list.empty();
	
	$("#btnAnimContainer").hide();
}

function addDateRangeText(from,to){
	var selectedRanges = $("#selectedRanges");
	
	if(!selectedRanges.is(':visible')){
		selectedRanges.show();
	}
	
	$("#btnAnimContainer").show();
	
	var list = $("#selectedRangesTexts");
	list.append("<li>"+from+" -- "+to+"</li>") 
	
}
var lastUpdateOfUrls = new Date();

/**
 * This function is used to save the current 'tiles' that the user is 'viewing' 
 * @param {type} url
 * @returns {undefined}
 */
function saveCurrentRequests(url){
	var currentUpdate = new Date();
	// We assume that requesting the layers takes less than 1 sec. 
	var threshold = 500; 
	if( (currentUpdate - lastUpdateOfUrls ) > threshold){
		lastUpdateOfUrls = currentUpdate;
		current_requests = new Array();
		console.log("---------- Clearing prev urls ----------");
	}
	
	var currUrl = url.split("&");
	var currCol = currUrl[currUrl.length - 3].split("=")[1]; 
	var currRow = currUrl[currUrl.length - 2].split("=")[1]; 
	console.log("Col: "+currCol+"  Row: "+currRow);
	var size = current_requests.length;
	current_requests[size] = url;
}