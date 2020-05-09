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
	ii = millis() * writeSpeed/60;
	
	// ShadowForm(vertices, magbase, magrange, octaves, falloff, perlinc, ctrlscl) {
	shadow1 = new ShadowForm(3,200,50,4,0.5,0.01,1.2);
	shadow1.create();

	

}

//DRAW
function draw() {
	
	background(150);
	if(!initState) {
		//mills = performance.now() - startTime;
		//timecode = Math.ceil(mills/16); //sync song to visual
	
		//drawing
		strokeWeight(4);
		stroke(255,0,0);


		noiseDetail(10,0.6);  //THIS IS HAVING SOME SORT OF INFLUENCE I DON'T UNDERSTAND
		translate(width/2,height/2);
		
		
		strokeWeight(1);
		stroke(255,255,255);
		fill(255,255,255,0);
		
		shadow1.update(20);
		
			
		// if (timecode >= 	otTone.stream.length - 7*(1000/writeSpeed)) {
		// 	console.log(timecode); 
		// 	startPlay(song);
		// };
		//if(showTimeCode) console.log(millisToTime(mills)+' | '+timecode+' | '+Math.floor(100 * timecode / otTone.stream.length)+'%' );
	}	
}
