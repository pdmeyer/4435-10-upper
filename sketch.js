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
}

//DRAW
function draw() {
	if(!initState) {
		c.background(150);
		mills = performance.now() - startTime;
		timecode = Math.ceil(mills/16);
		
		noiseDetail(posOct, posFall);
		let posX = width / 2 + map(noise(posOff), 0, 1, -posRange, posRange);
		let posY = height / 2 + map(noise(posOff+232), 0, 1, -posRange , posRange);
		translate(posX, posY);
		let shadow = new ShadowForm(vertices,magbase,magrange,vertOct,vertFall,vertInc,ctrlMagCoeff);
		shadow.create(formOff);
		addToFormArray(shadows, shadow, maxlines + 1);
	
		strokeWeight(1);
		stroke(255,255,255,50);
		fill(255,255,255,2);

		background(150);

		let lineCount = countLines (shadows, maxlines);
		for (let i = lineCount.start; i < lineCount.start + lineCount.end; i++) {
			shadows[i].update(transOff, transAmt, wiggleAmt, transOct, transFall, transInc);
		}
		
		formOff += formInc;
		transOff += transInc;
		posOff += posInc;
			
		if (timecode >= songLength - 10) {
			console.log(timecode); 
			startPlay(song);
		};
		
		if(showTimeCode) console.log(millisToTime(mills)+' | '+timecode+' | '+Math.floor(100 * timecode / otTone.stream.length)+'%' );
	}	
}
