
"use strict";
var app = app || {};

app.ui = {
	init: function() {
		console.log("UI Init called");
		// set up canvas stuff
		
		// get sound track <select> and Full Screen button working
		//setupUI();
		
		//show slider info
		this.RippleProps();
		this.FishProps();
		this.WaterProps();
	},
	
	RippleProps: function(){
		
		//START_ALPHA
		document.querySelector('#startAlpha').value=app.main.RIPPLE.START_ALPHA;
		document.querySelector('#startAlpha').onchange=function(e){			
			app.main.RIPPLE.START_ALPHA=e.target.value;
			console.log(app.main.RIPPLE.START_ALPHA);
		}
		//DECAY_START
		document.querySelector('#decayStart').value=app.main.RIPPLE.DECAY_START;
		document.querySelector('#decayStart').onchange=function(e){			
			app.main.RIPPLE.DECAY_START=e.target.value;
			console.log(app.main.RIPPLE.DECAY_START);
		}
		//DECAY_RATE
		document.querySelector('#decayRate').value=app.main.RIPPLE.DECAY_RATE;
		document.querySelector('#decayRate').onchange=function(e){			
			app.main.RIPPLE.DECAY_RATE=e.target.value;
			console.log(app.main.RIPPLE.DECAY_RATE);
		}
		//REPLICATE_TIME
		document.querySelector('#replicateTime').value=app.main.RIPPLE.REPLICATE_TIME;
		document.querySelector('#replicateTime').onchange=function(e){			
			app.main.RIPPLE.REPLICATE_TIME=e.target.value;
			console.log(app.main.RIPPLE.REPLICATE_TIME);
		}
		//MAX_RIPPLE_NUM
		document.querySelector('#rippleNum').value=app.main.RIPPLE.MAX_RIPPLE_NUM;
		document.querySelector('#rippleNum').onchange=function(e){			
			app.main.RIPPLE.MAX_RIPPLE_NUM=e.target.value;
			console.log(app.main.RIPPLE.MAX_RIPPLE_NUM);
		}
		//LINE_SIZE
		document.querySelector('#lineSize').value=app.main.RIPPLE.LINE_SIZE;
		document.querySelector('#lineSize').onchange=function(e){			
			app.main.RIPPLE.LINE_SIZE=e.target.value;
			console.log(app.main.RIPPLE.LINE_SIZE);
		}
		//SCALE_SPEED
		document.querySelector('#scaleSpeed').value=app.main.RIPPLE.SCALE_SPEED;
		document.querySelector('#scaleSpeed').onchange=function(e){			
			app.main.RIPPLE.SCALE_SPEED=e.target.value;
			console.log(app.main.RIPPLE.SCALE_SPEED);
		}
	},
	
	FishProps: function(){
		//NUM_FISH_START
		document.querySelector('#numFish').value=app.main.FISH.NUM_FISH_START;
		document.querySelector('#numFish').onchange=function(e){			
			app.main.FISH.NUM_FISH_START=e.target.value;
			console.log(app.main.FISH.NUM_FISH_START);
		}
		/* //FISH_SIZE
		document.querySelector('#fishSize').value=app.main.FISH.FISH_SIZE;
		document.querySelector('#fishSize').onchange=function(e){			
			app.main.FISH.FISH_SIZE=e.target.value;
			console.log(app.main.FISH.FISH_SIZE);
		} */
		//FISH_SIZE_MIN_MOD
		document.querySelector('#fishMinSizeMod').value=app.main.FISH.FISH_SIZE_MIN_MOD;
		document.querySelector('#fishMinSizeMod').onchange=function(e){			
			app.main.FISH.FISH_SIZE_MIN_MOD=e.target.value;
			console.log(app.main.FISH.FISH_SIZE_MIN_MOD);
		}
		//FISH_SIZE_MIN_MOD
		document.querySelector('#fishMaxSizeMod').value=app.main.FISH.FISH_SIZE_MAX_MOD;
		document.querySelector('#fishMaxSizeMod').onchange=function(e){			
			app.main.FISH.FISH_SIZE_MAX_MOD=e.target.value;
			console.log(app.main.FISH.FISH_SIZE_MAX_MOD);
		}
		//MAX_SPEED
		document.querySelector('#swimSpeed').value=app.main.FISH.MAX_SPEED;
		document.querySelector('#swimSpeed').onchange=function(e){			
			app.main.FISH.MAX_SPEED=e.target.value;
			console.log(app.main.FISH.MAX_SPEED);
		}
		//TURN_CHANGE_RATE
		document.querySelector('#tcRate').value=app.main.FISH.TURN_CHANGE_RATE;
		document.querySelector('#tcRate').onchange=function(e){			
			app.main.FISH.TURN_CHANGE_RATE=e.target.value;
			console.log(app.main.FISH.TURN_CHANGE_RATE);
		}
		//MAX_TURN_ANGLE_CHANGE
		document.querySelector('#angleChange').value=app.main.FISH.MAX_TURN_ANGLE_CHANGE;
		document.querySelector('#angleChange').onchange=function(e){			
			app.main.FISH.MAX_TURN_ANGLE_CHANGE=e.target.value;
			console.log(app.main.FISH.MAX_TURN_ANGLE_CHANGE);
		}
		//FLEE_RADIUS
		document.querySelector('#fleeRadChange').value=app.main.FISH.FLEE_RADIUS;
		document.querySelector('#fleeRadChange').onchange=function(e){			
			app.main.FISH.FLEE_RADIUS=e.target.value;
			console.log(app.main.FISH.FLEE_RADIUS);
		}
		//FLEE_TIME
		document.querySelector('#fleeTimeChange').value=app.main.FISH.FLEE_TIME;
		document.querySelector('#fleeTimeChange').onchange=function(e){			
			app.main.FISH.FLEE_TIME=e.target.value;
			console.log(app.main.FISH.FLEE_TIME);
		}
		//SPAWN_FISH
		document.querySelector('#spawnButton').onclick=function(e){			
			app.main.reset();
			console.log("Spawning Fish");
		}
	},
	
	WaterProps: function(){
		//CLARITY
		document.querySelector('#clarity').value=app.main.WATER.CLARITY;
		document.querySelector('#clarity').onchange=function(e){			
			app.main.WATER.CLARITY=e.target.value;
			console.log(app.main.WATER.CLARITY);
		}
		//RED
		document.querySelector('#red').value=app.main.WATER.RED;
		document.querySelector('#red').onchange=function(e){			
			app.main.WATER.RED=e.target.value;
			console.log(app.main.WATER.RED);
		}
		//GREEN
		document.querySelector('#green').value=app.main.WATER.GREEN;
		document.querySelector('#green').onchange=function(e){			
			app.main.WATER.GREEN=e.target.value;
			console.log(app.main.WATER.GREEN);
		}
		//BLUE
		document.querySelector('#blue').value=app.main.WATER.BLUE;
		document.querySelector('#blue').onchange=function(e){			
			app.main.WATER.BLUE=e.target.value;
			console.log(app.main.WATER.BLUE);
		}
	}
}