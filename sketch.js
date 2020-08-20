function preload() {
	songData = loadJSON('data/covid_means.json');
	soundFormats('mp3');
	song = loadSound('audio/5 covid MIX 2.0');
	img = loadImage(imgfile);
}

function setup() {
	initialize(writeSpeed);
	c = createCanvas(windowWidth, windowHeight);	
	c.background(150);
	showimage();

	//prep json data for querying
	otTone = new DataStream(songData.otTone.EnergyMean,1);
	outAC1 = new DataStream(songData.outside.AC1Mean,1);
	outEner = new DataStream(songData.outside.EnergyMean,1);
	radiodrone = new DataStream(songData.radiodrone.FrequencyMean,1);
	phonem = new DataStream(songData.phonem.EnergyMean,1);

	tube = new Tube(maxlines);
	shadow = new Tube(1);

	let shadowform = new ShadowForm(shadvert,height * shadmb, height * shadmr,shadoct,shadflf,shadinc,shadscl);
	shadowform.create(0);
	shadow.addForm(shadowform);
}

/* DRAW */
function draw() { 
	if(!initState) {
		gettime();
		c.background(150);
		showimage();
	
		/* shadow */
		push();
		noStroke();
		fill(shadowfill);
		translate(width/2,height/2);
		rotate(rotamt);
		rotdisp = outAC1.modulator(timecode,0,0,0,0.8,40) + otTone.modulator(timecode,0,0,0,6,40);
		
		//shadow.drawMany(1000 ,1,rotdisp);
		let howmany = Math.round(constrain(pow(timecode/5000,4),0,1)*numShadows);
		shadow.drawMany(howmany,1,rotdisp);
		pop();
		rotamt += rotinc * 10 / writeSpeed;

		/* tube create */
		let tubeform = new ShadowForm(vertices,magbase,magrange,vertOct,vertFall,vertInc,ctrlMagCoeff);
		tubeform.create(formOff);
		tube.addForm(tubeform);

		/* tube draw */
		strokeWeight(1);
		noStroke(); //stroke(255,255,255,radiodrone.modulator(timecode,0,0,0,10,10));
		fill(15, 15, 15, radiodrone.modulator(timecode,0,0,0,100,30));
		translate(width/2,height/2);
		tube.centerP(posOct, posFall, posOff, posRange, frameCount/1000);
		tube.drawP(transOff, transAmt, wiggleAmt, transOct, transFall, transInc);
		
		/* perl inc */
		formOff += formInc * 10 / writeSpeed;
		transOff += transInc * 10 / writeSpeed;
		posOff += posInc * 10 / writeSpeed;
		
		/* song end check */
		if (timecode >= songLength - 10) {
			console.log(timecode); 
			startPlay(song);
		};
		
		/* debug */
		if(showTimeCode) console.log(millisToTime(mills)+' | '+timecode+' | '+Math.floor(100 * timecode / otTone.stream.length)+'%'+' | '+howmany);
	}	
}
