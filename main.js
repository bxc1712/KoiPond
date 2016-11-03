"use strict";
var app = app || {};

app.main = {
    WIDTH : 640, 
    HEIGHT: 480,
	BORDER_SIZE: 125,
	animationID: 0,
    canvas: undefined,
    ctx: undefined,
   	lastTime: 0, // used by calculateDeltaTime() 
	paused: false,
	debug: false,
	nightMode: false, //lol, have fun with this one. 
	
	//Sound Stuff
	bgAudio: undefined,
	effectAudio:undefined,
	sound: undefined, // required - loaded by main.js
	currentEffect:0,
	currentDirection:1,
	effectSounds:
	["WaterDropFixed.mp3","WaterDropFixed.mp3"],
	
	FISH: {
		NUM_FISH_START: 5, 
		FISH_SIZE: 1,
		FISH_SIZE_MAX_MOD: .1,
		FISH_SIZE_MIN_MOD: .1,
		MAX_SPEED: 80,
		TURN_CHANGE_RATE: 5,
		MAX_TURN_ANGLE_CHANGE: 0.05,
		FLEE_RADIUS: 100,
		FLEE_TIME: 5,
	},
	
	RIPPLE: { // fake enumeration, actually an object literal
		START_ALPHA: .75,
		DECAY_START: .25,
		REPLICATE_TIME: .01,
		DECAY_RATE: .35,
		MAX_RIPPLE_NUM: 3,
		LINE_SIZE: 3,
		SCALE_SPEED: 40,
	},
	
	WATER: {
		CLARITY: .05,
		RED: 0,
		GREEN: 255,
		BLUE: 255,
	},
	
	fish : [],
	numFish: this.NUM_FISH_START,
	
	ripples: [],
	numRipples: 0,
	
	fishSprite: undefined,
	background: undefined,
	
	init : function() {
		this.sound.playBGAudio();
		console.log("app.main.init called");
		this.canvas = document.querySelector('canvas');
		this.canvas.width = this.WIDTH;
		this.canvas.height = this.HEIGHT;
		this.ctx = this.canvas.getContext('2d');
		
		this.canvas.onmousedown = this.doMousedown.bind(this);
		
		this.background = new Image();
		this.background.src = "media/PondTiles.png";
		
		this.ctx.drawImage(this.background, 0, 0);
		//this.ctx.fillStyle = "black"; 
		//this.ctx.fillRect(0,0,this.WIDTH,this.HEIGHT); 
		
		this.reset();
		this.update();
	},
	
	update : function() {
		this.animationID = requestAnimationFrame(this.update.bind(this));
	
		if (this.paused) {
			this.drawPauseScreen(this.ctx);
			return;
		}
		
	 	var dt = this.calculateDeltaTime();
		
		this.ctx.save();
		//this.ctx.globalAlpha = .1;
		//this.ctx.fillStyle = "black"; 
		//this.ctx.fillRect(0,0,this.WIDTH,this.HEIGHT); 
		this.ctx.drawImage(this.background, 0, 0);
		this.ctx.restore();
		
		this.ctx.save();
		this.ctx.fillStyle = "rgba(" + this.WATER.RED + "," + this.WATER.GREEN + "," + this.WATER.BLUE + "," + this.WATER.CLARITY+")";
		this.ctx.fillRect(0,0,this.WIDTH,this.HEIGHT); 
		this.ctx.restore()
		
		this.moveFish(dt);
		this.drawFish(this.ctx);
		
		this.ctx.save();		
		this.ctx.fillStyle = "rgba(" + this.WATER.RED + "," + this.WATER.GREEN + "," + this.WATER.BLUE + "," + this.WATER.CLARITY+")";
		this.ctx.fillRect(0,0,this.WIDTH,this.HEIGHT); 
		this.ctx.restore()
		
		
		this.drawRipples(this.ctx, dt);
		
		if (this.nightMode) {
			this.ctx.save();
			this.ctx.globalAlpha = .95;
			this.ctx.fillStyle = "black";
			this.ctx.fillRect(0, 0, this.WIDTH, this.HEIGHT);
			this.ctx.restore();
		}
		
		if (this.debug){
			// draw dt in bottom right corner
			this.fillText(this.ctx, "dt: " + dt.toFixed(3), this.WIDTH - 150, this.HEIGHT - 10, "18pt courier", "white");
		}
	},	
	
	reset: function() {
		this.numFish = this.FISH.NUM_FISH_START;
		this.fish = this.makeFish(this.numFish);
	},
	
	calculateDeltaTime: function(){
		// what's with (+ new Date) below?
		// + calls Date.valueOf(), which converts it from an object to a 	
		// primitive (number of milliseconds since January 1, 1970 local time)
		var now,fps;
		now = (+new Date); 
		fps = 1000 / (now - this.lastTime);
		fps = clamp(fps, 12, 60);
		this.lastTime = now; 
		return 1/fps;
	},
	
	fillText: function(ctx, string, x, y, css, color) {
		ctx.save();
		// https://developer.mozilla.org/en-US/docs/Web/CSS/font
		ctx.font = css;
		ctx.fillStyle = color;
		ctx.fillText(string, x, y);
		ctx.restore();
	},
	
	doMousedown: function(e) {
		var mouse = getMouse(e);
		this.makeRipple(mouse.x, mouse.y, 0);
		this.sound.playEffect();
		
		for(var i=0;i<this.fish.length; i++){
			var f = this.fish[i];
			f.checkFlee(mouse.x, mouse.y);
		}
	},
	
	drawPauseScreen: function(ctx) {
		ctx.save();
		ctx.fillStyle = "black";
		ctx.fillRect(0,0, this.WIDTH, this.HEIGHT);
		ctx.textAlign = "center";
		ctx.textBaseline = "middle";
		this.fillText(this.ctx, "... PAUSED ...", this.WIDTH/2, this.HEIGHT/2, "40pt courier", "white");
		ctx.restore();
	},
	
	pauseGame: function(){
		this.stopBGAudio();
		this.paused = true;
		// stop the animation loop
		cancelAnimationFrame(this.animationID);
		// call update() once so that our paused screen gets drawn
		this.update();
	},
	
	resumeGame: function(){
		this.sound.playBGAudio();
		// stop the animation loop, just in case it's running
		cancelAnimationFrame(this.animationID);
		this.paused = false;
		// restart the loop
		this.update();
	},
	
	stopBGAudio:function(){
		this.sound.stopBGAudio();
	},
	
	playEffect: function(){
		this.effectAudio.src="media/" + this.effectSounds[this.currentEffect];
		this.effectAudio.play();
		
		this.currentEffect+=this.currentDirection;
		if(this.currentEffect==this.effectSounds.length || this.currentEffect==-1){
			this.currentDirection*=-1;
			this.currentEffect+=this.currentDirection;
		}
	},
	
	makeFish: function(num){
		var fishMove = function(dt) {
		
		if (this.fleeing) {
			this.fleeTimer -= dt;
			console.log(this.fleeTimer);
			if (this.fleeTimer <= 0) {
				this.fleeing = false;
			}
			
			var desired = {x: this.fleeXLoc - this.xLoc, y: this.fleeYLoc - this.yLoc};
			var desiredLength = Math.sqrt(desired.x*desired.x + desired.y*desired.y);
			//console.log("desiredLength: " + desiredLength);
			desired = normalizeVector(desired.x, desired.y);
			//console.log("normalized desired.x: " + desired.x);
			desired.x *= this.speed;
			desired.y *= this.speed;
			//console.log("desired.x + this.speed: " + desired.x);
			
			this.xSpeed = -desired.x;
			this.ySpeed = -desired.y;
			//console.log("this.xSpeed set to desired: " + this.xSpeed);
			
			//console.log("this.xLoc pre-change: " + this.xLoc);
			this.xLoc += this.xSpeed * dt;
			this.yLoc += this.ySpeed * dt;
			//console.log("endLoc: " + this.xLoc + this.yLoc);
			//console.log("this.xLoc += this.xSpeed * dt: " + this.xLoc);
			
			
		}
		
		else
		{
			//console.log("---New Move Round---");
			//console.log("startLoc: " + this.xLoc + this.yLoc);
			//this.x += this.xSpeed * this.speed * dt;
			//this.y += this.ySpeed * this.speed * dt;
			
			var wandCircRad = 25;
			var wandCircDist = 5;
			
			this.turnCounter++;
			if (this.turnCounter % this.turnChangeRate == 0) {
				this.wanderAngle += getRandom(-this.maxTurnChange,this.maxTurnChange);
			}
		
			// Now we have to calculate the new location to steer towards on the wander circle
			var wandCircLoc = {x: this.velocity.x, y: this.velocity.y};
			//console.log("wandCircLoc Just Velocity: " + wandCircLoc.x);
			wandCircLoc.x *= wandCircDist;
			wandCircLoc.y *= wandCircDist;
			//console.log("wandCircLoc Times wandCircDist: " + wandCircLoc.x);
			
			wandCircLoc.x += this.xLoc;
			wandCircLoc.y += this.yLoc;
			//console.log("current this.xLoc: " + this.xLoc);
			//console.log("wandCircLoc Plus this.x: " + wandCircLoc.x);
			
			var heading = getVectorHeading(this.velocity.y, this.velocity.x);
			//console.log("Current heading (radians): " + heading);
			var test = wandCircRad * Math.cos(this.wanderAngle+heading);
			//console.log("---------");
			//console.log(wandCircRad);
			//console.log(wanderAngle);
			//console.log(heading);
			//console.log(test);
			//console.log("---------");
			var circleOffset = {x: wandCircRad * Math.cos(this.wanderAngle+heading), y:wandCircRad * Math.sin(this.wanderAngle+heading) };
			//console.log("circleOffset.x: " + circleOffset.x);
			var target = {x: wandCircLoc.x + circleOffset.x, y: wandCircLoc.y + circleOffset.y};
			//console.log("target.x: " + target.x);
			
			var desired = {x: target.x - this.xLoc, y: target.y - this.yLoc};
			//console.log("desired.x: " + desired.x);
			
			var desiredLength = Math.sqrt(desired.x*desired.x + desired.y*desired.y);
			//console.log("desiredLength: " + desiredLength);
			desired = normalizeVector(desired.x, desired.y);
			//console.log("normalized desired.x: " + desired.x);
			
			desired.x *= this.speed;
			desired.y *= this.speed;
			//console.log("desired.x + this.speed: " + desired.x);
			
			this.xSpeed = desired.x;
			this.ySpeed = desired.y;
			//console.log("this.xSpeed set to desired: " + this.xSpeed);
			
			//console.log("this.xLoc pre-change: " + this.xLoc);
			this.xLoc += this.xSpeed * dt;
			this.yLoc += this.ySpeed * dt;
			//console.log("endLoc: " + this.xLoc + this.yLoc);
			//console.log("this.xLoc += this.xSpeed * dt: " + this.xLoc);
			
			if (app.main.debug) {
				app.main.ctx.save();
				app.main.ctx.beginPath();
				app.main.ctx.arc(target.x, target.y, wandCircRad, 0, Math.PI*2, false);
				app.main.ctx.stroke();
				app.main.ctx.closePath();
				app.main.ctx.beginPath();
				app.main.ctx.strokeStyle = "red";
				app.main.ctx.moveTo(target.x, target.y);
				app.main.ctx.lineTo(target.x + desired.x, target.y + desired.y);
				app.main.ctx.stroke();
				app.main.ctx.closePath();
				app.main.ctx.stroke();
				app.main.ctx.restore();
				//ellipse(circle.x,circle.y,rad*2,rad*2);
				//ellipse(target.x,target.y,4,4);
				//line(location.x,location.y,circle.x,circle.y);
				//line(circle.x,circle.y,target.x,target.y);
			}
		}
			
			//console.log("---End Move Round---");
		};
		
		var fishDraw = function(ctx){
			ctx.save();
			if(app.main.debug){
				ctx.beginPath();
				ctx.arc(this.xLoc, this.yLoc, this.scale, 0, Math.PI*2, false);
				ctx.closePath();
				ctx.fill();
			}
			ctx.fillStyle = this.fillStyle;
			this.spriteSheet.update();
			this.spriteSheet.draw(this.xLoc, this.yLoc, getVectorHeading(this.ySpeed, this.xSpeed), this.scale, ctx);
			ctx.restore();
		};
		
		var fishFleeCheck = function(pointX, pointY) {
			if (getDistance(pointX, pointY, this.xLoc, this.yLoc) <= this.fleeRadius) {
				this.fleeing = true;
				this.fleeTimer = this.maxFleeTimer;
				this.fleeXLoc = pointX;
				this.fleeYLoc = pointY;
			}
		};
		
		var array = [];
		for(var i=0; i<num; i++) {
			//make a new object literal
			var f = {};
			
			//Add .x and .y properties. 
			//.x and .y are somewhere on the canvas, with a minimum margin of START_RADIUS
			//getRandom() is from utilities.js
			f.xLoc = getRandom(this.FISH.FISH_SIZE * 2, this.WIDTH - this.FISH.FISH_SIZE * 2);
			f.yLoc = getRandom(this.FISH.FISH_SIZE * 2, this.HEIGHT - this.FISH.FISH_SIZE * 2);
			
			//add a radius property
			f.scale = this.FISH.FISH_SIZE;
			f.scale += getRandom(-this.FISH.FISH_SIZE_MIN_MOD, this.FISH.FISH_SIZE_MAX_MOD);
			
			f.spriteSheet = new this.fishSpriteSheet('media/fishSpriteNew2.png', 84, 174, 5, i%8, 8);
			
			//getRandomUnitVector is from utilities.js
			var randomVector = getRandomUnitVector();
			f.velocity = randomVector;
			f.xSpeed = randomVector.x;
			f.ySpeed = randomVector.y;
			
			f.wanderAngle = 0;
			f.turnChangeRate = this.FISH.TURN_CHANGE_RATE;
			f.maxTurnChange = this.FISH.MAX_TURN_ANGLE_CHANGE;
			f.turnCounter = 0;
			
			f.fleeing = false;
			f.fleeRadius = this.FISH.FLEE_RADIUS;
			f.maxFleeTimer = this.FISH.FLEE_TIME;
			f.fleeTimer = 0;
			f.fleeXLoc = 0;
			f.fleeYLoc = 0;
			
			//make more properties
			f.speed = this.FISH.MAX_SPEED;
			f.fillStyle = "red";
			
			f.draw = fishDraw;
			f.move = fishMove;
			f.checkFlee = fishFleeCheck;
			
			//no more properties can be added!
			Object.seal(f);
			array.push(f);
		}
		
		return array;
	}, 
	
	drawFish: function(ctx){
		for(var i=0;i<this.fish.length; i++){
			var f = this.fish[i];
			f.draw(ctx);
		}
	},
	
	moveFish: function(dt) {
		for (var i = 0; i < this.fish.length; i++) {
			var f = this.fish[i];
			f.move(dt);
			
			if(this.circleHitLeft(f)){
				f.xLoc = this.WIDTH - f.scale + this.BORDER_SIZE;
				f.move(dt); // an extra move
			}
			if(this.circleHitRight(f)){
				f.xLoc = f.scale - this.BORDER_SIZE;
				f.move(dt); // an extra move
			}
			if(this.circleHitTop(f)){
				f.yLoc = this.HEIGHT - f.scale + this.BORDER_SIZE;
				f.move(dt); // an extra move
			}
			if(this.circleHitBottom(f)){
				f.yLoc = f.scale - this.BORDER_SIZE;
				f.move(dt); // an extra move
			}
		}
	},
	
	circleHitLeft: function (f){
		if (f.xLoc <= f.scale - this.BORDER_SIZE) {
			return true;
		}
	},
	
	circleHitRight: function (f){
		if (f.xLoc >= this.WIDTH - f.scale + this.BORDER_SIZE) {
			return true;
		}
	},
	
	circleHitTop: function (f){
		if (f.yLoc < f.scale - this.BORDER_SIZE) {
			return true;
		}
	}, 
	
	circleHitBottom: function (f){
		if (f.yLoc > this.HEIGHT - f.scale + this.BORDER_SIZE) {
			return true;
		}
	},
	
	makeRipple: function(x, y, rippleNumber) {		
		var r = {};
		
		var rippleDraw = function(ctx, dt){
			ctx.save();
			if(this.timeAlive >= this.decayStartTime) {
				this.alphaValue -= (this.decayRate * dt);
				
				if (this.timeAlive >= this.makeNewTime){
					this.makeNewNextTime = true;
				}
				
				if (this.alphaValue < 0) this.alphaValue = 0;
				
				if (this.makeNewNextTime && !this.madeNew && this.rippleNumber < this.maxRippleNumber) {
					//app.main.makeRipple(this.x, this.y);
					this.makeNew(this.x, this.y, this.rippleNumber + 1);
					this.madeNew = true;
				}
			}
			
			ctx.beginPath();
			ctx.globalAlpha = this.alphaValue;
			ctx.arc(this.x, this.y, this.timeAlive * this.scaleSpeed, 0, Math.PI*2, false);
			ctx.closePath();
			ctx.strokeStyle = "rgb(" + app.main.WATER.RED + "," + app.main.WATER.GREEN + "," + app.main.WATER.BLUE +")";
			ctx.lineWidth = this.lineWidth;
			ctx.stroke();
			ctx.restore();
			
			this.timeAlive += dt;
		};
		
		//function makeNewRippleFunc(x,y) {this.makeRipple};
		//r.makeNewRipple = makeNewRippleFunc;
		
		var makeNewRipple = function(x, y, rippleNumber){
			app.main.makeRipple(x,y, rippleNumber);
		}
		
		r.x = x;
		r.y = y;
		r.rippleNumber = rippleNumber;
		r.maxRippleNumber = this.RIPPLE.MAX_RIPPLE_NUM;
		
		r.lineWidth = this.RIPPLE.LINE_SIZE;
		
		r.alphaValue = this.RIPPLE.START_ALPHA;
		
		r.decayStartTime = this.RIPPLE.DECAY_START;
		r.decayRate = this.RIPPLE.DECAY_RATE;
		
		r.makeNewNextTime = false;
		r.madeNew = false;
		r.makeNewTime = this.RIPPLE.REPLICATE_TIME;
		
		r.scaleSpeed = this.RIPPLE.SCALE_SPEED;

		r.timeAlive = 0;
		
		r.draw = rippleDraw;
		r.makeNew = makeNewRipple;
		
		//no more properties can be added!
		Object.seal(r);
		this.ripples.push(r);
	},
	
	drawRipples: function(ctx, dt){
		for(var i=0;i<this.ripples.length; i++){
			var r = this.ripples[i];
			r.draw(ctx, dt);
		}
	},
	
	fishSpriteSheet: function (path, frameWidth, frameHeight, frameSpeed, startFrame, endFrame) {
		var image = new Image();
		var framesPerRow;
		
		image.onload = function() {
			framesPerRow = Math.floor(image.width/frameWidth);
		};
		
		image.src = path;
		
		var currentFrame = startFrame;
		var counter = 0;
		
		this.update = function() {
			if (counter == (frameSpeed - 1)) {
				currentFrame = (currentFrame + 1) %endFrame;
			}
			
			counter = (counter +1) % frameSpeed;
		};
		
		this.draw = function(x, y, rot, scale, ctx){
			var row = Math.floor(currentFrame/framesPerRow);
			var col = Math.floor(currentFrame % framesPerRow);
		
			var rotationOffset = 1.5708; // 90 deg. in rad.
			
			ctx.save();
			ctx.translate(x, y);
			ctx.rotate(rot + rotationOffset);
			ctx.translate(-45, -50);
			ctx.scale(scale, scale);
			ctx.drawImage(image, col* frameWidth, row * frameHeight, frameWidth, frameHeight, 0, 0, frameWidth, frameHeight);
			ctx.restore();
		};
	},
	
}