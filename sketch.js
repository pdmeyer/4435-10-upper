//TUBE PARAMS

// basic form
const vertices = 3; // number of vertices
const magbase = 20; // base vertex vector magnitude
const magrange = 60; // range of vertex vector magnitude modulation

// variation within form
const vertOct = 10; // perlin octaves
const vertFall = 0.5; // perlin falloff 
const vertInc  = 0.4; // perlin increment
const ctrlMagCoeff = 0.7; // magnitude multiplier for control points

// variation among forms
const formInc = 0.065; // perlin noise 

//start position of tube
const posOct = 10;
const posFall = 0.5;
const posInc = 0.007; //0.004
const posRange = 0; //<----

//direction of tube
const transOct = 10; // perl oct
const transFall = 0.5; // perl inc
const transInc = 0.008; // perl increment
const transAmt = 10;

//tube wiggle
const wiggleAmt = 4;

//length of tube
const maxlines = 5; // number of forms to draw per frame

//shadow form
const numShadows = 800;
const shadvert = 3;
const shadowfill = [10,10,10,9]
const rotinc = 0.03;
const shadmb = 0.3;
const shadmr = 0.2;
const shadoct = 4;
const shadflf = 0.1;
const shadscl = 0.8;
const shadinc = 1.9;

//background
const imgfile = 'https://files.cargocollective.com/c700175/test-452_res.jpg'; 
const audiofile = 'https://files.cargocollective.com/c700175/05_covid-MIX-2.0_M3_256.mp3';
const datafile = 'https://files.cargocollective.com/c700175/covid_trimmed.json';
const submatx = 0.5;
const matxeasing = 0.1;

/***********************************************************************/

//sketch config

const writeSpeed = 50;
const easing = 0.1; // for mouse pointer
// const songLength = 11374;
const sketchName = "covd-visual";
const fileFormat = 'png'; //'jpg' or 'png'
const debug = false;

/***********************************************************************/

//initial 
let c;
let xpos;
let ypos;
let clickCount = 0;
let loopState = false;
let initState = true;
let tube;
let shadow;
let formOff = Math.floor(Math.random() * 10000); // modulation of the form shape
let transOff = formOff + 639; // modulation of form position
let posOff = transOff + 892;
let rotamt = 0;
let mills = 0;
let ii = 0;
let timecode = 0;
let rotdisp;
let img;
let howmany = 0;
let subx;
let suby;


//JSON data
let songData;
let otTone;
// let phonem;
let outside;
let radiodrone;

function preload() {
	songData = loadJSON(datafile);
	soundFormats('mp3');
	song = createAudio(audiofile);
	img = loadImage(imgfile);
}

function setup() {
	initialize(writeSpeed);
	c = createCanvas(windowWidth, windowHeight);
	song.onended(reset)	

	otTone = new DataStream(songData.otTone,1);
	radiodrone = new DataStream(songData.radiodrone,1);
	outside = new DataStream(songData.outside,1)

	tube = new Tube(maxlines);
	shadow = new Tube(1);

	let shadowform = new ShadowForm(shadvert,height * shadmb, height * shadmr,shadoct,shadflf,shadinc,shadscl);
	shadowform.create(0);
	shadow.addForm(shadowform);
}

function draw() {
	c.background(150);
	showimage();
  
	if (loopState) {
	  gettime();
  
	  /* shadow */
	  push();
	  noStroke();
	  fill(shadowfill);
	  translate(width / 2, height / 2);
	  rotate(rotamt);
	  rotdisp = outside.modulator(timecode, 0, 0, 0, 0.8, 40) + otTone.modulator(timecode, 0, 0, 0, 6, 40);
	  howmany = Math.round(constrain(pow(timecode / 5000, 4), 0, 1) * numShadows);
	  shadow.drawMany(howmany, 1, rotdisp);
	  pop();
	  rotamt += rotinc * 10 / writeSpeed;
  
	  /* tube create */
	  let tubeform = new ShadowForm(vertices, magbase, magrange, vertOct, vertFall, vertInc, ctrlMagCoeff);
	  tubeform.create(formOff);
	  tube.addForm(tubeform);
  
	  /* tube draw */
	  strokeWeight(1);
	  noStroke(); //stroke(255,255,255,radiodrone.modulator(timecode,0,0,0,10,10));
	  fill(15, 15, 15, radiodrone.modulator(timecode, 0, 0, 0, 100, 30));
	  push();
	  translate(width / 2, height / 2);
	  tube.centerP(posOct, posFall, posOff, posRange, frameCount / 1000);
	  tube.drawP(transOff, transAmt, wiggleAmt, transOct, transFall, transInc);
	  pop();
  
	  /* perl inc */
	  formOff += formInc * 10 / writeSpeed;
	  transOff += transInc * 10 / writeSpeed;
	  posOff += posInc * 10 / writeSpeed;
  
	} else {
		playButton();
		toggleLoop();
	}
  
	/* debug */
	if (debug && frameCount % 20 == 0) {
	  logtime();
	}
  }
  
  function playButton() {
	let centerX = width / 2;
	let centerY = height / 2;
	noStroke();
	rectMode(CENTER)
	fill(221, 218, 198);
	rect(centerX, centerY, 110, 70, 5, 5, 5, 5);
	fill(255, 255, 255);
	let s = 20;
	triangle(centerX + s, centerY, centerX - s, centerY + s, centerX - s, centerY - s);
  }

function imgsub() {
	img.resize(width, 0);
	subw = submatx * img.width;
	subh = submatx * img.height;

	//sin / noise
	subx = sin_(ii,7010,0,img.width*submatx);
	suby = sin_(ii,8432,0,img.height*submatx);
	// subx = bfg(timecode, 0.0006, 3, 0.2, 0, img.width * submatx);
	// suby = bfg(timecode+3892, 0.0006, 4, 0.5, 0, img.width * submatx);

	//mouse
	let tx = map(mouseX,0,width,0,img.width * submatx) - subx;
	let ty = map(mouseY,0,height,0,img.height * submatx) - suby; 
	subx += tx * matxeasing;
	suby += ty * matxeasing;
}


function showimage() {
	imgsub();
	image(img, 0, 0, width, height, subx, suby, subw, subh);
}

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

class ShadowForm {
  constructor(vertices, magbase, magrange, octaves, falloff, perlinc, ctrlscl) {
    this.spacing = TWO_PI / vertices;
    this.vertices = [];
    this.controls = [];
    this.controls2 = [];
    this.magrange = magrange;
    this.magbase = magbase;
    this.perlinc = perlinc;
    this.ctrlscl = ctrlscl;
    this.octaves = octaves;
    this.falloff = falloff;
  }

  create (xoff) {

    //vertices
    for(let a=0; a < TWO_PI; a += this.spacing) {
      let perl = noise(xoff);
      let mag = this.magbase + perl * this.magrange;
      let vertex = p5.Vector.fromAngle(a,mag);
      this.vertices.push(vertex);
      xoff += this.perlinc
    }
    
    //control points 1
    let cp1off = xoff + 50;
    for(let a = 0; a < this.vertices.length; a++) {
      let angle = this.vertices[a].heading() - (2 * noise(cp1off)) * this.spacing/2;
      let mag = this.vertices[a].mag() * this.ctrlscl * (noise(cp1off) + 1);
      let control = p5.Vector.fromAngle(angle,mag)
      this.controls.push(control);
      cp1off += this.perlinc
    }

    //control points 2
    let cp2off = xoff + 900;
    for(let a = 0; a < this.vertices.length; a++) {
      let angle = this.vertices[a].heading() - (2 * noise(cp2off)) * this.spacing/2;
      let mag = this.vertices[a].mag() * this.ctrlscl * (noise(cp2off) + 1);
      let control = p5.Vector.fromAngle(angle,mag)
      this.controls2.push(control);
      cp2off += this.perlinc
    }
  }

  updateVPoints () {
    for (let i = 0; i < this.vertices.length; i++) {
      point(this.vertices[i].x, this.vertices[i].y);
    }
  }

  updateCPoints () {
    for (let i = 0; i < this.controls.length; i++) {
      point(this.controls[i].x, this.controls[i].y);
    }
  }

  drawP (xoff, pAmt, sAmt, oct, falloff, inc) {
    noiseDetail(oct,falloff);
    let perlx = map(noise(xoff),0,1,-pAmt,pAmt);
    let perly = map(noise(xoff+2349),0,1,-pAmt,pAmt);
    translate(perlx, perly);
    let xx = sin_(xoff,69,-sAmt,sAmt);
    let yy = sin_(xoff,27,-sAmt,sAmt);
    translate(xx,yy);
    xoff += inc;
    this.drawShape();
  }

  drawShape() {
    let v = this.vertices;
    let c = this.controls;
    let c2 = this.controls2;

    beginShape();
    for (let i = 0; i < v.length + 1; i++) {
      if(i == 0) {
        vertex(v[0].x, v[0].y)
      } else if (i == v.length) {
        bezierVertex(c[0].x, c[0].y, c2[0].x, c2[0].y, v[0].x, v[0].y);
      } else {
        bezierVertex(c[i].x, c[i].y, c2[i].x, c2[i].y, v[i].x, v[i].y);
      }
    }
    endShape();
  }

  get angles () {
    let angles = {
      vertices: [],
      controls: [],
      controls2: []
    }
    for (let i = 0; i < this.vertices.length; i++) {
      angles.vertices.push(this.vertices[i].heading());
      angles.controls.push(this.controls[i].heading());
      angles.controls2.push(this.controls[i].heading());
    }
    return angles;
  }

  get mags() {
    let mags = {
      vertices: [],
      controls: [],
      controls2: []
    }
    for (let i = 0; i < this.vertices.length; i++) {
      angles.vertices.push(this.vertices[i].mag());
      angles.controls.push(this.controls[i].mag());
      angles.controls2.push(this.controls[i].mag());
    }
    return mags;
  }
}

class Tube {
  constructor(maxlen) {
    this.forms = [];
    this.maxlines = maxlen;
  }
  
  createAll(){}

  centerP (cenOct, cenFall, cenOff, cenRange, scale) {
    noiseDetail(cenOct, cenFall);
    cenRange *= scale;
    let posX = map(noise(cenOff), 0, 1, -cenRange, cenRange);
	  let posY = map(noise(cenOff+232), 0, 1, cenRange , cenRange);
  	translate(posX, posY);
  }
  
  addForm (itemToAdd) {
    let arr = this.forms;
    let max = this.maxlines;
    arr.push(itemToAdd);
    if(arr.length > max) { 
      for(let i = 0; i < arr.length - max; i++) {
        arr.shift();
      }
    }
  }

  lines () {
    let max = this.maxlines;
    let len = this.forms.length;
    let g = {};
    
    if(len <= max) {
      g.end = len;
      g.start = 0;
    } else if (len > max) {
      g.end = len;
      g.start = len - max;
    } 

    return g;
  }

  drawMany(howmany,recede,rot){
    let l = this.lines();
    for(let j = 0; j < howmany; j++) {
      if(recede) {
        let o = 1 - (j * (1 / howmany));
        scale(o);
      }
      if(rot > 0) {
        let t = j * (TWO_PI /  howmany);
        rotate(t * rot);
      }
      for (let i = l.start; i < l.start + l.end; i++) {
        this.forms[i].drawShape();
      }
    }
    
  }

  draw() {
    let l = this.lines();
    for (let i = l.start; i < l.start + l.end; i++) {
      this.forms[i].drawShape();
    }
  }

  drawP (tOff, tAmt, wAmt, tOct, tFall, tInc) {
    let l = this.lines();
    for (let i = l.start; i < l.start + l.end; i++) {
      this.forms[i].drawP(tOff, tAmt, wAmt, tOct, tFall, tInc);
    }
  }
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

	modulator (index,scalemin,scalemax,outputmin,outputmax, smoothing=1) {
		let inputmin = this.min + scalemin*(this.max - this.min);
		let inputmax = this.max - scalemax*(this.max - this.min);
		if(smoothing < 1) smoothing = 1;
		let sum = 0;
		let avg = 0;
		for (let i = 0; i < smoothing; i++) {
			if(index-i >= 0) {
				let ix = index-i;
				if (ix > this.stream.length) ix =this.stream.length;
				let value = map(this.stream[index-i],inputmin,inputmax,outputmin,outputmax);
				sum += value;
				avg = sum/(i+1);
		}
    }
		return this.clamp(avg,outputmin,outputmax);// (num, a, b) => Math.max(Math.min(num, Math.max(a, b)), Math.min(a, b));
	}

	gate (index,threshold) {
		let value = map(this.stream[index], this.min, this.max, 0, 1);
		return threshold < value 
	}

	clamp(num,low,high) {
		return Math.max(Math.min(num, Math.max(low, high)), Math.min(low, high))
	}
}	

// MOUSE CONTROLS
	// click in upper left hand corner: download image
	// click anywhere in the middle of the canvas: start/stop
	function mousePressed () {
		if(pointregion(mouseX,mouseY,"uleft")) {
			saveImg();
		} else if (pointregion(mouseX,mouseY,"canvas")) {
			if (initState) {
				startPlay(song);
			} else if(loopState) {
				pausePlay(song);
				} else {
				resumePlay(song);	
			}
			return false
		}
	}
		
	function keyPressed () {
		if(keyCode === 32) {
			console.log("spacebar");
		}
	}
	
	function pointregion(x, y , region) { //possible regions: uleft, uright, lleft, right, bottom, top, middle
		if(region == "uleft") {
			return x < 0.1 * width && y < 0.1 * height;
		} else if (region == "uright") {
			return x > 0.9 * width && y < 0.1 * height;
		} else if (region == "lleft") {
			return x < 0.1 * width && y > 0.9 * height;
		} else if (region == "bottom") {
			return y > 0.9 * height;
		} else if (region == "top") {
			return y < 0.1 * height;
		} else if (region == "middle") {
			return y < 0.9 * height && y > 0.1 * height;
		} else if (region == "canvas") {
			return y < 0.9 * height && y > 0.1 * height && x < 0.9 * width && x > 0.1 * width;
		}
	}