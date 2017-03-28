var minSpeed  = 1500;
var animSpeed = 500;

//--------------- Controls configuration
function initAnimationButtons(){
	$("#makeAnimation").click(startAnimation);
}

function updateAnimationControls(){
	switch(anim_status.current){
		case anim_status.none:
			$("input").removeAttr('disabled');
			$("#contCurrDate").removeAttr('disabled');
			$("#makeAnimation").show();
			$("#animControls").hide();
			$("#stopAnimation").hide();
			$("#loading").hide();
			break;
		case anim_status.playing:
			$("#makeAnimation").hide();
			$("#stopAnimation").show();
			$("#animControls").show();
			$("#loading").hide();
			break;
		case anim_status.paused:
			$("#animControls").show();
			break;
		case anim_status.loading:
			$("input").attr('disabled','disabled');
			$("input:checkbox").removeAttr('disabled');
			$("#contCurrDate").removeAttr('disabled');
			$("#makeAnimation").hide();
			$("#stopAnimation").show();
			$("#animControls").show();
			$("#loading").show();
			$("#contCurrDate").attr('disabled','disabled');
			break;
	}
}

/**
 * Moves the animation to the first and last frame 
 * @returns {undefined}
 */
function animFirstFrame(){ currentFrame = 0; }
function animLastFrame(){ currentFrame = dates.length - 1; }
/**
 * Decreases the frame of the animation, if it is on the first frame
 * it goes to the last one 
 * @returns {undefined}
 */
function animDecreaseFrame(){
	if(currentFrame > 0){
		currentFrame--;
	}else{
		currentFrame = dates.length- 1;
	}
}
/**
 * Increases the frame of the animation, if it is on the last frame
 * it goes to the first one 
 * @returns {undefined}
 */
function animIncreaseFrame(){
	if(currentFrame < (dates.length- 1) ){
		currentFrame++;
	}else{
		currentFrame = 0;
	}
}

function updateAnimSpeed(){
	animSpeed = minSpeed - parseInt($("#animSpeedInput").val());
	startAnimationLoop();
}
/**
 * Makes the animation 10% faster. 
 * @returns {undefined}
 */
function animFaster(){
	animSpeed = animSpeed*.80;
	$("#animSpeedInput").val(minSpeed - Math.floor(animSpeed));
	startAnimationLoop();
}
/**
 * Makes the animation 10% slower. 
 * @returns {undefined}
 */
function animSlower(){
	animSpeed = animSpeed*1.20;
	$("#animSpeedInput").val(minSpeed - Math.floor(animSpeed));
	startAnimationLoop();
}

/**
 * Starts playing the animation
 * @returns {undefined}
 */
function playAnimation(){
	startAnimationLoop();
	if(anim_status.current === anim_status.paused){
		anim_status.current = anim_status.playing;
	}
	updateAnimationControls();
}

/**
 * Pauses the animation 
 * @returns {undefined}
 */
function stopAnimation(){
	anim_status.current = anim_status.none;
	ol3_layers[_defaultLayer].setVisible(true);
	clearAnimation();
	updateAnimationControls();
}

function pauseAnimation(){
	if(anim_status.current === anim_status.playing){
		anim_status.current = anim_status.paused;
	}
	updateAnimationControls();
}