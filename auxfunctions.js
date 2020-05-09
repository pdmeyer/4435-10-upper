//START THINGS
function startPlay(song){
	timecode = 0;
	startTime = performance.now();
	song.play();
}

//DRAWING
function maxBezInc(inc) {
	maxBezzes += inc
	//console.log(maxBezzes);
}

function growShrink(max) {
	maxBezzes += growShrinkAmt;
	if(maxBezzes > max || maxBezzes < initBezzes) {
		growShrinkAmt = -growShrinkAmt;
	}
}

function linesToDraw() {
	if(frameCount < maxBezzes) {
		return frameCount;
	} else if (bezzes.length < maxBezzes) {
		return bezzes.length;
	} else {
		return maxBezzes;
	}
}


//IMAGE EXPORT
function nameFile(){
	return 'sketch_'+year()+month()+day()+'_'+hour()+minute()+second()+clickCount;
}

function saveImg () {
	if(pointerUpperLeft(mouseX,mouseY)) {
		console.log(nameFile());
		saveCanvas(c, nameFile(), fileFormat);
		}
}


//MOUSE
function pointerUpperLeft(x,y) {
	return x < 0.1 * width && y < 0.1 * height;
}

function pointerUpperRight(x,y) {
	return x > 0.9 * width && y < 0.1 * height;
}

function pointerLowerLeft(x,y) {
	return x<0.1*width && y >0.9*height;
	}

function pointerBottom(y) {
	return y > 0.9 * height;
}	

function pointerMiddleBand(y) {
	return y > 0.9 * height && y > 0.1 * height;
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


//JSON Data
//allows time to be displayed in mm:ss format 
function millisToTime(mills) {
	let minutes = "0"+Math.floor(mills / 60000).toString();
	let seconds = "0"+Math.floor((mills % 60000)/1000).toString(); 
	return minutes.slice(-2)+':'+seconds.slice(-2);
}


class DataStream {
	constructor (path,startpoint=0) {	
		this.stream_ = path.slice(startpoint,path.length);
	}

	get stream() {
		return this.stream_;
	}

	get min () {
		let bottom = 100000;
		for(let i = 0; i < this.stream.length; i++) {
			if(this.stream[i] < bottom) {
				bottom = this.stream[i];
			}
		}
		return bottom;
	}
	
	get max () {
		let top = -100000;
		for(let i = 0; i < this.stream.length; i++) {
			if(this.stream[i] > top) {
				top = this.stream[i];
			}
		}
		return top;
	}

	modulator (index,scalemin,scalemax,outputmin,outputmax) {
		let inputmin = this.min + scalemin*(this.max - this.min);
		let inputmax = this.max - scalemax*(this.max - this.min);
		let value = map(this.stream[index],inputmin,inputmax,outputmin,outputmax); 
		return this.clamp(value,outputmin,outputmax);// (num, a, b) => Math.max(Math.min(num, Math.max(a, b)), Math.min(a, b));
	}

	gate (index,threshold) {
		let value = map(this.stream[index], this.min, this.max, 0, 1);
		return threshold < value 
	}

	clamp(num,low,high) {
		return Math.max(Math.min(num, Math.max(low, high)), Math.min(low, high))
	}
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