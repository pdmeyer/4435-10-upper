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
