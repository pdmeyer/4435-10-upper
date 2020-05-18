function preload() {
	songData = loadJSON('data/covid_means.json');
	soundFormats('mp3');
	song = loadSound('audio/5 covid MIX 2.0');
}

function setup() {
	c = createCanvas(windowWidth, windowHeight);	
	background(150);
	otTone = new DataStream(songData.otTone.EnergyMean,1);
	outAC1 = new DataStream(songData.outside.AC1Mean,1);
	outEner = new DataStream(songData.outside.EnergyMean,1);
	radiodrone = new DataStream(songData.radiodrone.FrequencyMean,1);
	phonem = new DataStream(songData.phonem.EnergyMean,1);

	//initializations
	c.background(150);
	frameRate(writeSpeed);
	mouseX = width / 2;
	mouseY = height / 2;	
	xpos = width / 2;
	ypos = height / 2;

	let shadowshape = new ShadowForm(3,400,50,10,0.8,0.05,1.2); //shadow-y shape that moves across the frame when the otTone comes in
	shadowshape.create();
}

//DRAW
function draw() { if(!initState) {
	c.background(150);
	mills = performance.now() - startTime;
	timecode = Math.ceil(mills/16);

	//shadow
	noStroke();
	fill(10,10,10,50);


	//tube create
	noiseDetail(posOct, posFall);
	let posX = width / 2 + map(noise(posOff), 0, 1, -posRange, posRange);
	let posY = height / 2 + map(noise(posOff+232), 0, 1, -posRange , posRange);
	translate(posX, posY);
	let tubeform = new ShadowForm(vertices,magbase,magrange,vertOct,vertFall,vertInc,ctrlMagCoeff);
	tubeform.create(formOff);
	addToFormArray(tube, tubeform, maxlines + 1);

	//tube draw
	strokeWeight(1);
	stroke(255,255,255,50);
	fill(255,255,255,2);
	let lineCount = countLines (tube, maxlines);
	for (let i = lineCount.start; i < lineCount.start + lineCount.end; i++) {
		tube[i].update(transOff, transAmt, wiggleAmt, transOct, transFall, transInc);
	}
	
	// perl inc
	formOff += formInc;
	transOff += transInc;
	posOff += posInc;
	
	// song end check
	if (timecode >= songLength - 10) {
		console.log(timecode); 
		startPlay(song);
	};
	
	//debug
	if(showTimeCode) console.log(millisToTime(mills)+' | '+timecode+' | '+Math.floor(100 * timecode / otTone.stream.length)+'%' );
}	}
