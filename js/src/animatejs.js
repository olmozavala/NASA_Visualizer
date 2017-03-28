var countImages = 0;
var totalImages = 0;
var imagesData = new Array;
var imgSizes = 512;//TODO
var animSize = .50;//Percentage of height
var cols = new Array;
var rows = new Array;
var dates = new Array;
var urlTemplate = "";
var currentDate = 0;
var waitTimeBetweenFrames = 2000;

var offsetX = 0;
var offsetY = 0;
var scale = 1;
var currExtent;

var intervalHandler;// This is the handler of the 'interval' function
var imagesByDate = new Array();//Indicates which images are ready
var canvas = 0;
var ctx = 0;
var currentFrame = 0;
var currTileMatrix = 0;

var anim_status = {"current":"",
					"playing":"playing",
					"paused":"paused",
					"loading":"loading",
					"none":"none"};

function canvasFunction(extent, resolution, pixelRatio, size, projection) {	

	return;
	var layerOl3 = ol3_layers[_defaultLayer]; 
	var layer_metadata= nasa_layers[_defaultLayer]; 
	
	var currSource = layerOl3.getSource();
	var currGrid = currSource.getTileGrid();

	var allRes = layer_metadata.resolutions;	
	for(i = 0; i < allRes.length; i++){
		if(resolution > allRes[i]){
			currTileMatrix = i;
			break;
		}
	}
	
	// Creating this newExtent is required because the function obtains wrong results
	extent = [extent[0], -1*extent[3]+180,extent[2], -1*extent[1]+180];
	currExtent = extent;
	
	// Finding the offsets of the canvas
	var z = linearFindNearest(currGrid.getResolutions(), resolution, 0);
	scale = resolution / currGrid.getResolution(z);

	var myTileRange = {
						"minX": (scale * (extent[0] + 180) / (resolution * imgSizes)),
						"maxX": (scale * (extent[2] + 180) / (resolution * imgSizes)),
						"minY": (scale * (extent[1] - 90) /  (resolution * imgSizes)),	
						"maxY": (scale * (extent[3] - 90) /  (resolution * imgSizes))};	

	cols = _.range(Math.max(0,Math.floor(myTileRange.minX)),Math.max(0,Math.floor(myTileRange.maxX+1)));
	rows = _.range(Math.max(0,Math.floor(myTileRange.minY)),Math.max(0,Math.floor(myTileRange.maxY+1)));

	offsetX = _.min(cols) - myTileRange.minX;
	offsetY = _.min(rows) - myTileRange.minY;

	console.log("----------------------");
	console.log(myTileRange);
	console.log(cols);
	console.log(rows);
/*
	console.log(scale);
	console.log(extent);
	console.log("OX: "+offsetX+ "   OY: "+offsetY);
	*/
	
	canvas = document.getElementById("animationCanvas");
	ctx = canvas.getContext('2d');
	
    var canvasWidth = size[0];
    var canvasHeight = size[1];        
	
	canvas.width = canvasWidth;
	canvas.height = canvasHeight;   	
	
	clearCanvas();
	if(anim_status.current === anim_status.playing){
		startAnimation();
	}
//    return  document.getElementById("emptyCanvas");
    return  canvas;
}

function startAnimation(){

	if(validateDates()){
		ol3_layers[_defaultLayer].setVisible(false);
		clearAnimation();
		anim_status.current = anim_status.loading;
		updateAnimationControls();
		
		var layerObj = nasa_layers[_defaultLayer];
		urlTemplate = layerObj.wmts+"layer="+layerObj.name+
				"&style&tilematrixset="+layerObj.matrix+
				"&tilematrix="+currTileMatrix+
				"&Service=WMTS&Request=GetTile&Version=1.0.0&Format="+layerObj.format+"&";
		
//		console.log("Rows:"+rows);
//		console.log("Cols:"+cols);
		
		totalImages = dates.length*cols.length*rows.length;
		countImages = 0;
		currentFrame = 0;
		
		loadAnimationImages();
		playAnimation();
	}
}

function loadAnimationImages(){
	//Creates the image objects
	for(var j = 0; j < dates.length; j++){
		for(var row=0;row<rows.length;row++){
			for(var col=0;col<cols.length;col++){
				try{// Hack to test if the variable already exists
					eval('imageNumber'+j+'_'+row+'_'+col);
				}
				catch(e){
					eval('window.imageNumber'+j+'_'+row+'_'+col+';');
					eval("imageNumber"+j+"_"+row+"_"+col+" = document.createElement('img');");
					eval("imageNumber"+j+"_"+row+"_"+col+".src = '';");//Clear any previous animation
				}
			}
		}
	}
	
	for(var j = 0; j < dates.length; j++){
		//Adds the images for one date
		for(var row=0;row<rows.length;row++){
			for(var col=0;col<cols.length;col++){
				var coltxt = "TileCol="+cols[col];
				var rowtxt = "TileRow="+rows[row];
				var datetxt = "Time="+dates[j];
				var url = urlTemplate+coltxt+"&"+rowtxt+"&"+datetxt;
				eval("imageNumber"+j+"_"+row+"_"+col+".src = '"+url+"'");
				eval("imageNumber"+j+"_"+row+"_"+col+".row = "+row);
				eval("imageNumber"+j+"_"+row+"_"+col+".col = "+col);
				eval("imageNumber"+j+"_"+row+"_"+col+".width = 512");
				eval("imageNumber"+j+"_"+row+"_"+col+".heigth = 512");
				eval("imageNumber"+j+"_"+row+"_"+col+".id = "+col*row*j);
				eval("imageNumber"+j+"_"+row+"_"+col+".addEventListener('load', onLoadImage);");
				eval("imageNumber"+j+"_"+row+"_"+col+".addEventListener('error', errorFunction);");
			}//cols
		}//rows
	}
	
	startAnimationLoop();
}

/**
 * Log the error and try to load the image again 
 * @param {type} e
 * @returns {undefined}
 */
function errorFunction(e){
//	var currentImage = parseInt(e.target.id);
	//	var errorCount = parseInt(e.target.errorCount);
	e.srcElement.error = 1;
	countImages ++;
	if(countImages >= (totalImages-1) ){
		anim_status.current = anim_status.playing;
		updateAnimationControls();
//		console.log(countImages);
	}
}

function drawImage(img){
	if(img.error !== 1){
		ctx.drawImage(img,(1/scale) * ( (img.col+offsetX) * imgSizes),
		(1/scale) * ( (img.row+offsetY) * imgSizes),
		(1/scale) * imgSizes,
		(1/scale) * imgSizes);
	}else{
//		console.log("error on this image");
	}
}

/**
 * This function is the event listener for all the images
 * of the animation 
 * @returns {undefined}
 */
function onLoadImage(){
	countImages ++;
	if(countImages >= (totalImages-1) ){
		anim_status.current = anim_status.playing;
		updateAnimationControls();
//		console.log(countImages);

	}
	drawImage(this);
}

/**
 * Removes previously defined animation callback functions 
 * @returns {undefined}
 */
function clearLoopHandler(){
	if(typeof intervalHandler !== 'undefined'){
		clearInterval(intervalHandler);
	}
}

/**
 * Initilizes the callback function to start the animation loop 
 * @returns {undefined}
 */
function startAnimationLoop(){
	clearLoopHandler();
	$('#animSpeed').text( (1000/animSpeed).toFixed(1) +" fps");
	intervalHandler = setInterval(loopAnimation,animSpeed);
}

/**
 * This is the callback function in charge of displaying
 * the proper frames of the animations 
 * @returns {undefined}
 */
function loopAnimation(){
	//When the animation is 'playing' it loops on all the frames
	if(anim_status.current === anim_status.playing){
		currentFrame = currentFrame < (dates.length-1)? ++currentFrame: 0;
	}
	if($("#clearFrames").is(":checked") || (currentFrame === 0)){
		clearCanvas();
	}
	
	//Draws all the images that correspond to the current date
	$("#currentDate").text(dates[currentFrame]);
	for(var row=0;row<rows.length;row++){
		for(var col=0;col<cols.length;col++){
			drawImage(eval('imageNumber'+currentFrame+"_"+row+"_"+col));
		}
	}
	
	_map.render();
}

/**
 * Clears the canvas by drawing an empty rectangle 
 * @returns {undefined}
 */
function clearCanvas(){
	//Clears any previous display in the canvas
	ctx.clearRect(0, 0, canvas.width, canvas.height);
}

function clearAnimation(){
	clearLoopHandler();
	//TODO empty the animaiton canvas
	$("#divCanvas").hide();
}