//SETUP
function preload() {
	songData = loadJSON('data/bergintro_means.json');
	
	soundFormats('mp3');
	song = loadSound('audio/1 berg intro MIX 1.0',startPlay);
	//stem = loadSound('audio/berg_intro_1_razor',startPlay);
}

function setup() {
	c = createCanvas(windowWidth, windowHeight);	
	
	//config
	writeSpeed = 10; //framerate
	rotateAmt = 0; 
	linesPerWrite = 1;
	growShrinkAmt = 1;
	
	gXPos = width * 0.25; 
	gYPos = height * 0.5;

	growShrinkOn = true; //use growing and shrinking form?
	initBezzes = 1; //how many lines to start with
	initMaxBezzes = 200; // how many lines to grow to

	data1 = new DataStream(songData.razor.LoudnessMean);
	data2 = new DataStream(songData.udu.LoudnessMean);

	//background initial
	bgColor = {
		red: 50,
		green: 83,
		blue: 41,
		alpha: 255
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

	//intitializations
	maxBezzes = initMaxBezzes;
	loopState = false;
	frameRate(writeSpeed);
	angleMode(DEGREES);
	mouseDownX = 0;
	mouseDownY = 0;
	mouseX = width / 2;
	mouseY = height / 2;	
	ellipseX = mouseX;
	ellipseY = mouseY;

//	console.log("max: "+data1.max+' min: '+data1.max);
}

//DRAW
function draw() {

	//
	let ii = millis() * writeSpeed/60; //
	mills = Date.now() - startTime;
	timecode = Math.ceil(mills/16); //sync song to visual
	let easing = 0.03;

	//modulations
		//shape	
		//bez1.vert.x1 += 0.85 * sin_(ii,10);
		
		bez1.vert.x1 = followPointer('x', bez1.vert.x1, easing); 
		bez1.vert.y1 = followPointer('y', bez1.vert.y1, easing); 

		bez1.vert.cpx1 += 11 * vect_(ii, 105).y;
		bez1.vert.cpy1 += 1.3 * sin_(ii,45);
		bez1.vert.cpy2 += 1.3 * sin_(ii,52);
		bez1.vert.cpy1 += 7.6 * vect_(ii, 300).y;
		bez1.vert.cpx2 += 10 * vect_(ii, 400).y;
		bez1.vert.cpy1 += 4.2 * vect_(ii, 500).x;
		bez1.vert.x2 += -0.5 * sin_(ii,1000)

		//line color
		
		//fill color
		bez1.fill.alpha = 10 * sin_(ii,1000);
		// bez1.fill.red = bez1.fill.red + map(mouseY,height,0,0,100);
		// bez1.fill.green = bez1.fill.green + map(mouseY,height,0,0,10);

		//position
		//gXPos = 
		//gYPos = 
		//rotateAmt = /*lerp(rotateAmt, Math.round(10 * Math.random()), 0.05)*/ + data2.modulator(timecode,0.8,0,0,10);

		//trail
		//maxBezzes = round(map(mouseX,0,width,1,500));

		//background
		bgColor.red = lerp(bgColor.red,69 + data1.modulator(timecode,0.8,0,0,60),0.5);

		//ellipse
		ellipseX = followPointer('x',ellipseX,easing*5);
		ellipseY = followPointer('y',ellipseY,easing*5);
	
	//create bez objects
	bezzes.push(new Bez(bez1));	
		if(bezzes.length > 1001) { 
			let d = bezzes.length - 1001;
			for(i=0; i<d; i++) {
				bezzes.shift();
			} 
		};

	//drawing
	if(frameCount % linesPerWrite == 0) {
		//c.clear(); //transparent background
		c.background(bgColor.red, bgColor.green, bgColor.blue, bgColor.alpha); //
		// translate(gXPos,gYPos); //??
		push();
			noStroke();
			fill(150);
			ellipse(ellipseX, ellipseY, 10, 10);
		pop();
		push();
			//translate((x2-x1)/2,0)
			shearX(rotateAmt); // does this work? 
		
		scale(scaleX,scaleY);
		stroke(bez1.stroke.red,bez1.stroke.green,bez1.stroke.blue,bez1.stroke.alpha + Math.round(data2.modulator(timecode,0.75,0,0,105)));
		//fill(bez1.fill.red,bez1.fill.green,bez1.fill.blue,map(mouseX,0,width,0,1));
		writeLines(frameCount, maxBezzes,1,0);
		pop();

		// grow/shrink
		if(growShrinkOn) {
			growShrink(initMaxBezzes);
		};
	};
		
	loopState = true;

	if (timecode > 	data1.stream.length) {noLoop(); console.log('done')};

	//console.log(timecode+' | '+data1.stream[timecode]+' | '+bgColor.red);
	console.log(mouseX+' | '+bez1.vert.x1);


}




// MOUSE CONTROLS
	// click in upper left hand corner: download image
	// click in upper right hand corner: toggle draw looping
function mousePressed () {
	if(pointerUpperLeft(mouseX,mouseY)) {
		saveImg();
	}
}

function keyPressed () {
	if(keyCode === 32) {
		if(loopState) {
			loopState = false;
			noLoop();
			song.pause();
		} else {
			loopState = true;
			loop();
			song.play();
		}
		return false
	}
}	