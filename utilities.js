"use strict";

function clamp(val, min, max){
	return Math.max(min, Math.min(max, val));
}

function getRandomUnitVector(){
	var x = getRandom(-1,1);
	var y = getRandom(-1,1);
	var length = Math.sqrt(x*x + y*y);
	if(length == 0){ // very unlikely
		x=1; // point right
		y=0;
		length = 1;
	} else{
		x /= length;
		y /= length;
	}
	
	return {x:x, y:y};
}

function normalizeVector(x, y) {
	var length = Math.sqrt(x*x + y*y);
	
	if(length == 0){ // very unlikely
		x=1; // point right
		y=0;
		length = 1;
	} else{
		x /= length;
		y /= length;
	}
	
	return {x:x, y:y};
}

function getVectorHeading(y, x) {
	var angleRadians;
	
	angleRadians = Math.atan2(y,x);
	//console.log(angleRadians);
	return angleRadians;
}

function getRandom(min, max) {
  	return Math.random() * (max - min) + min;
}

function getDistance(x1, y1, x2, y2) {
	var distance = Math.sqrt(((x2 - x1)*(x2 - x1)) + ((y2 -y1)*(y2 -y1)));
	return distance;
}

function getMouse(e){
	var mouse = {} // make an object
	mouse.x = e.pageX - e.target.offsetLeft;
	mouse.y = e.pageY - e.target.offsetTop;
	return mouse;
}