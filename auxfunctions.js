//start at the beginning
function startPlay(_song){
	timecode = 0;
	startTime = performance.now();
	_song.play();
	loopState = true;
	initState = false;
	toggleLoop();
}

//pause playback
function pausePlay(_song) {
	pauseTime = performance.now();
	if(debug) console.log("pausetime: "+pauseTime);
	loopState = false;
	_song.pause();
}

//resume playing after pause
function resumePlay(_song) {
	interval = performance.now() - pauseTime;
	if(debug) console.log("interval: "+interval)
	startTime = startTime + interval;
	if(debug) console.log("starttime: "+startTime);
	loopState = true;
	_song.play();
	toggleLoop();
}

//reset to beginning
function reset() {
	if(debug) console.log("reset");
	song.stop();
	loopState = false;
	timecode = 0;
	initState = true;
}

function toggleLoop() {
	if(loopState) {
		loop();
	} else {
		noLoop();
	}
}

function initialize(framerate) {
	frameRate(framerate);
	mouseX = width / 2;
	mouseY = height / 2;	
	xpos = width / 2;
	ypos = height / 2;
}

function gettime() {
	mills = performance.now() - startTime;
	timecode = Math.ceil(mills/16); //sync song to visual
	ii = mills * writeSpeed/60;
}

function logtime () {
	console.log(millisToTime(mills)+' | '+timecode+' | '+Math.floor(100 * timecode / otTone.stream.length)+'%'+' | '+howmany);
}

//IMAGE EXPORT
function nameFile(){
	return 'sketch_'+year()+month()+day()+'_'+hour()+minute()+second()+clickCount;
}

function saveImg () {
	console.log(nameFile());
	saveCanvas(c, nameFile(), fileFormat);
}

//MODULATORS
function sin_(i, speed = 100, low = -1, high = 1) { 
	return map(sin(i / speed + PI / 2), -1, 1, low, high);
}

function vect_(i, speed = 1000, low = -1, high = 1) { 
	this.x = map(p5.Vector.fromAngle(i / speed, 1).x, -1, 1, low, high);
	this.y = map(p5.Vector.fromAngle(i / speed, 1).y, -1, 1, low, high);
}

function randomGate (f) {
	return Math.floor(f * Math.random()) == 0;
}

function bfg(i, mult, oct=4, flf=0.5, low = 0., high = 1.) {
	xoff = i * mult;
	noiseDetail(oct,flf);
	return map(noise(xoff), 0., 1., low, high);
}


//JSON Data
//allows time to be displayed in mm:ss format 
function millisToTime(mills) {
	let minutes = "0"+Math.floor(mills / 60000).toString();
	let seconds = "0"+Math.floor((mills % 60000)/1000).toString(); 
	return minutes.slice(-2)+':'+seconds.slice(-2);
}

//maps songData array max and minimum to useful range
function mapStream (stream,streammin,streammax) {
	return map(stream,streammin,streammax,-1,1);
}

function clamp (num, high, low) {
		return Math.max(Math.min(num, Math.max(low, high)), Math.min(low, high))
}

function followPointer (axis, val, easing) { 
	if(axis == 'x') {
		if (val != mouseX) {
			return val + (mouseX - val) * easing;
		} else {
			return val
		}
	} else if (axis == 'y') {
		if (val != mouseY) {
			return val + (mouseY - val) * easing;
		}  else {
			return val
		}
	} else {
			'first argument must be x or y (string)'
	}
}

