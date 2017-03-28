
/**
 * Function used to update to a new layer. Called when the dropdown of layer
 * has changed 
 * @returns {undefined}
 */
function initBaseLayers(){
	$("#baseLayers").change(function() {
		var new_idx = parseInt($("select option:selected").val());
		updateBaseLayer(new_idx);
	});
}

/**
 * Function used to modify the current layer of the map 
 * @param {type} new_idx
 * @returns {undefined}
 */
function updateBaseLayer(new_idx){
	// Remove current layers
	 
	//The order of these 4 instructions is important, do not change
	_map.removeLayer(ol3_layers[_defaultLayer]);//Remove  current default layer
	_map.removeLayer(layercanvas);// Remove the layercanvas layer
	_map.addLayer(ol3_layers[_coastlinesLayer]);// Removing the coastlines layer

	_defaultLayer = new_idx;
	updateLayerDate();// This is required to update the date of the new layer

	// Add new layers
	_map.addLayer(ol3_layers[new_idx]);
	_map.addLayer(layercanvas);
	_map.addLayer(ol3_layers[_coastlinesLayer]);//Adding coastlines
	
	// Clear the animation canvas
//	clearCanvas();
	if(anim_status.current === anim_status.playing){
		startAnimation();
	}

	var firstDate = (nasa_layers[_defaultLayer].from).split('-');
//	if(firstDate !== ""){
	if(false){
		var lastDate= (nasa_layers[_defaultLayer].to).split('-');;
		
		var firstYear = parseInt(firstDate[0]);
		var lastYear= parseInt(lastDate[0]);
		
		var selectedYear = $("#selectedYear");
		selectedYear.empty();
		
		for(var i=firstYear; i< lastYear; i++){
			option = new Option(i, i);
			selectedYear.append(option);
		}
	}
}

/**
 * Fills the main dropdown with all the NASA layers.
 * @param {type} nasa_layers
 * @param {type} _defaultLayer
 * @param {type} url
 * @returns {undefined}
 */
function fillDropdown(nasa_layers,_defaultLayer){
	
	//Filling the base layers dropdown
	var select = $("#baseLayers");
	for(var i=0; i<nasa_layers.length ;i++){
		option = new Option(nasa_layers[i].title, i)
		if(i === _defaultLayer){
			option.selected = true;
		}
		select.append(option);
	}
}