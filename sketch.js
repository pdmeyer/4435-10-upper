function preload() {
	songData = loadJSON('data/covid_means.json');
	soundFormats('mp3');
	song = loadSound('audio/5 covid MIX 2.0');
}

function setup() {
	c = createCanvas(windowWidth, windowHeight);	
	c.background(150);
	initialize(writeSpeed);
	otTone = new DataStream(songData.otTone.EnergyMean,1);
	outAC1 = new DataStream(songData.outside.AC1Mean,1);
	outEner = new DataStream(songData.outside.EnergyMean,1);
	radiodrone = new DataStream(songData.radiodrone.FrequencyMean,1);
	phonem = new DataStream(songData.phonem.EnergyMean,1);

	tube = new Tube(maxlines);
	shadow = new Tube(1);

	let shadowform = new ShadowForm(3,400,50,10,0.8,0.5,0.7);
	shadowform.create(0);
	shadow.addForm(shadowform);
}

/* DRAW */
function draw() { if(!initState) {
	c.background(150);
	mills = performance.now() - startTime;
	timecode = Math.ceil(mills/16);

	/* shadow */
	push();
	noStroke();
	fill(0,0,0,10);
	shadow.centerP(posOct, posFall, posOff, posRange);
	shadow.drawMany(100,1,1);
	pop();

	/* tube create */
	let tubeform = new ShadowForm(vertices,magbase,magrange,vertOct,vertFall,vertInc,ctrlMagCoeff);
	tubeform.create(formOff);
	tube.addForm(tubeform);

	/* tube draw */
	strokeWeight(1);
	stroke(255,255,255,50);
	fill(255,255,255,2);
	tube.centerP(posOct, posFall, posOff, posRange);
	tube.drawP(transOff, transAmt, wiggleAmt, transOct, transFall, transInc);
	
	/* perl inc */
	formOff += formInc;
	transOff += transInc;
	posOff += posInc;
	
	/* song end check */
	if (timecode >= songLength - 10) {
		console.log(timecode); 
		startPlay(song);
	};
	
	/* debug */
	if(showTimeCode) console.log(millisToTime(mills)+' | '+timecode+' | '+Math.floor(100 * timecode / otTone.stream.length)+'%' );
}	}
