//SETUP
function preload() {
	songData = loadJSON('data/covid_means.json');
	
	soundFormats('mp3');
	song = loadSound('audio/5 covid MIX 2.0');
}

function setup() {
	c = createCanvas(windowWidth, windowHeight);	
	
	//config
	writeSpeed = 24; //framerate

	otTone = new DataStream(songData.otTone.EnergyMean,1);
	outAC1 = new DataStream(songData.outside.AC1Mean,1);
	outEner = new DataStream(songData.outside.EnergyMean,1);
	radiodrone = new DataStream(songData.radiodrone.FrequencyMean,1);
	phonem = new DataStream(songData.phonem.EnergyMean,1);

	rotateAmt = 0; 
	linesPerWrite = 1;
	growShrinkAmt = 1;
	
	gXPos = width * 0.25; 
	gYPos = height * 0.5;

	growShrinkOn = true; //use growing and shrinking form?
	initBezzes = 1; //how many lines to start with
	initMaxBezzes = 200; // how many lines to grow to

	//background initial
	bgColor = {
		red: 100,
		green: 105,
		blue: 112,
		alpha: 123,
	}

	//bezier initial values
		scaleX = 1.2;
		scaleY = 1.3;
		bez1 = {
			vert: {
				x1: width * 0.25,
				y1: height * 0.5, 
				cpx1: width*0.05,
				cpy1: -height*0.1,
				cpx2: width*0.45,
				cpy2: -height*0.1,
				x2: width * 0.75,
				y2: height * 0.5,
			},
			stroke: {
				red: 150,
				green: 150,
				blue: 150,
				alpha: 127
			},
			fill: {
				red: 150,
				green: 150,
				blue: 150,
				alpha: 100,
			}
		}

	//initializations
	pixelDensity(1);
	loopState = false;
	initState = true;
	maxBezzes = initMaxBezzes;
	frameRate(writeSpeed);
	angleMode(DEGREES);
	mouseX = width / 2;
	mouseY = height / 2;	
	ellipseX = mouseX;
	ellipseY = mouseY;
	ii = millis() * writeSpeed/60; //

	noLoop();

	shadow1 = new ShadowForm(0,0,400,198,165,314,-114,269,194,-15,376,114);
	//c.background(bgColor.red, bgColor.green, bgColor.blue, bgColor.alpha);

	background(0);
}


//DRAW
function draw() {
	loadPixels();
  for(x = 0; x < width; x++) {
    for(y = 0; y < height; y++) {
    let pR = (x + y * width) * 4;
    let pG = pR + 1;
    let pB = pR + 2
		let pA = pR + 3;
    
    pixels[pR] = bgColor.red;
    pixels[pG] = bgColor.green;
		pixels[pB] = bgColor.blue+randomGaussian(-40,200);
		pixels[pA] = randomGaussian(-50,50)+sin_(x/10,sin_(x+frameCount,1,0.0001,0.01),56,200);
		//pixels[pA] = outEner.modulator(y/outEner.stream.length,0,0,0,255);
		}
	}
  updatePixels();	

	if(!initState) {
		mills = performance.now() - startTime;
		timecode = Math.ceil(mills/16); //sync song to visual
	
		//drawing
		if(frameCount % linesPerWrite == 0) {
			
			noStroke();
			push();
			translate(width*0.5,height*0.5);
			// rotate(frameCount % 360);
			shearX(sin_(ii,10,-50,50));
			pop();
			fill(150,150,outAC1.modulator(timecode,0,0,140,160),outEner.modulator(timecode,0,0,1,10));
			translate(-width*0.25,-height*0.3);
			shadow1.show(250);
				
			if (timecode >= 	otTone.stream.length - 7*(1000/writeSpeed)) {
				console.log(timecode); 
				startPlay(song);
			};
	
		//if(showTimeCode) console.log(millisToTime(mills)+' | '+timecode+' | '+Math.floor(100 * timecode / otTone.stream.length)+'%' );
		}
	}	
}
