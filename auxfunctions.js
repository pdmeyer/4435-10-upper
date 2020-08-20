//TIMING
function startPlay(song){
	timecode = 0;
	startTime = performance.now();
	song.play();
	initState = false;
}

function initialize(framerate) {
	frameRate(writeSpeed);
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

//IMAGE EXPORT
function nameFile(){
	return 'sketch_'+year()+month()+day()+'_'+hour()+minute()+second()+clickCount;
}

function saveImg () {
	console.log(nameFile());
	saveCanvas(c, nameFile(), fileFormat);
}

//INTERACTIONS
function pointregion(x, y , region) { //possible regions: uleft, uright, lleft, right, bottom, top, middle
	if(region == "uleft") {
		return x < 0.1 * width && y < 0.1 * height;
	} else if (region == "uright") {
		return x > 0.9 * width && y < 0.1 * height;
	} else if (region == "lleft") {
		return x<0.1*width && y >0.9*height;
	} else if (region == "bottom") {
		return y > 0.9 * height;
	} else if (region == "top") {
		return y < 0.1 * height;
	} else if (region == "middle") {
		return y > 0.9 * height && y > 0.1 * height;
	}
}

function keyPressed () {
	if(keyCode === 32) {
    if (initState) {
      startPlay(song);
			initState = false;
			loopState = true;
    } else if(loopState) {
			loopState = false;
			noLoop();
			song.pause();
		} else {
			loopState = true;
			loop();
			song.play();
		}
		return false
	}
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

function showimage() {
	let ix1 = timecode;
	let ix2 = ix1 + 2325;
	img.resize(width, 0);
	image(img, 0, 0, width, height, bfg(ix1, 0.0006, 3, 0.2, 0, img.width * submatx), bfg(ix2, 0.0006, 4, 0.5, 0, img.width * submatx), submatx * img.width, submatx * img.height);
	// image(img, 0, 0, width, height, sin_(ii,17010,0,img.width*submatx), sin_(ii,21432,0,img.height*submatx), submatx * img.width, submatx * img.height);
}