//SETUP
function preload() {
	// songData = loadJSON('data/covid_means.json');
	// soundFormats('mp3');
	// song = loadSound('audio/5 covid MIX 2.0');
}

function setup() {
	c = createCanvas(windowWidth, windowHeight);	
	background(150);
	
	//config
	writeSpeed = 24; //framerate

	// otTone = new DataStream(songData.otTone.EnergyMean,1);
	// outAC1 = new DataStream(songData.outside.AC1Mean,1);
	// outEner = new DataStream(songData.outside.EnergyMean,1);
	// radiodrone = new DataStream(songData.radiodrone.FrequencyMean,1);
	// phonem = new DataStream(songData.phonem.EnergyMean,1);

	//initializations
	loopState = false;
	initState = false;
	frameRate(writeSpeed);
	angleMode(DEGREES);
	mouseX = width / 2;
	mouseY = height / 2;	
	ii = millis() * writeSpeed/60; //
	let w = 100 * width;

	// ShadowForm(vertices, magbase, magrange, perlinc, ctrlscl)
	//shadow1 = new ShadowForm(3,50,250,1,1.5);
	shadow1 = new ShadowForm(3,250,50,1,1.7);
	shadow1.create();

	translate(width/2,height/2);
	noiseDetail(25,0.9);
	
	strokeWeight(1);
	stroke(255,255,255);
	fill(255,255,255,0);
	
	shadow1.update(200);
}

//DRAW
function draw() {
	// background(150);
	if(!initState) {
		//mills = performance.now() - startTime;
		//timecode = Math.ceil(mills/16); //sync song to visual
	
		//drawing
		strokeWeight(4);
		stroke(255,0,0);
		shadow1.updateVPoints();
		
			
		// if (timecode >= 	otTone.stream.length - 7*(1000/writeSpeed)) {
		// 	console.log(timecode); 
		// 	startPlay(song);
		// };
		//if(showTimeCode) console.log(millisToTime(mills)+' | '+timecode+' | '+Math.floor(100 * timecode / otTone.stream.length)+'%' );
	}	
}
