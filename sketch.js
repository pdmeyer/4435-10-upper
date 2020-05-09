//SETUP
function preload() {
	// songData = loadJSON('data/covid_means.json');
	// soundFormats('mp3');
	// song = loadSound('audio/5 covid MIX 2.0');
}

let shadows = [];
let maxlines = 50; 
let xoff1 = 0; // modulation of the form shape
let inc1 = 0.03; // shape
let xoff2 = 1002; // modulation of form position
let inc2 = 0.01; // position
let xpos;
let ypos;
let easing = 0.1; // for mouse pointer


function setup() {
	c = createCanvas(windowWidth, windowHeight);	
	background(150);
	
	//config
	writeSpeed = 10; //framerate

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
	xpos = width / 2;
	ypos = height / 2;

	ii = millis() * writeSpeed/60;
}

//DRAW
function draw() {
	background(150);


	if(!initState) {
		mills = performance.now()// - startTime;
		//timecode = Math.ceil(mills/16); //sync song to visual

		// ShadowForm(vertices, magbase, magrange, octaves, falloff, perlinc, ctrlscl)
		// center point in x and y
		//number of vertices, base vertex vector length, range of vertex vector modulation, 
		//perlin noise octaves, perlin fallof, perlin increment, scaling coefficient for control point magnitude
		translate(width/2, height/2); //followPointer('x',xpos,easing),followPointer('y',ypos,easing)
		shad = new ShadowForm(3,100,100,2,7,0.2,0.7);
		shad.create(xoff1);
		shadows.push(shad);
		if(shadows.length > 1001) { 
			let d = shadows.length - 1001;
			for(i=0; i<d; i++) {
				shadows.shift();
			} 
		};
		xoff1 += inc1;
		xoff2 += inc2;


		//drawing
		//noiseDetail(10,0.6);  //THIS IS HAVING SOME SORT OF INFLUENCE I DON'T UNDERSTAND
		


		//translate(followPointer('x',xpos,easing),followPointer('y',ypos,easing));
		strokeWeight(1);
		stroke(255,255,255,50);
		fill(255,255,255,2);
		

			background(150);
			writeLines(shadows,frameCount-2, maxlines, xoff2, 15, 0.5, 0.01);

	
			// grow/shrink
			// if(growShrinkOn) {
			// 	growShrink(initMaxBezzes);
			// };
		
			
		// if (timecode >= 	otTone.stream.length - 7*(1000/writeSpeed)) {
		// 	console.log(timecode); 
		// 	startPlay(song);
		// };
		//if(showTimeCode) console.log(millisToTime(mills)+' | '+timecode+' | '+Math.floor(100 * timecode / otTone.stream.length)+'%' );
	}	
}
