let songData;
let loopState;
let a;
let streamMax = -10000;
let streamMin = 10000;

function preload() {
	songData = loadJSON('data/berg_intro_2.json');
}

function setup() {
	createCanvas(windowWidth, windowHeight);
	loopState = 1;
	a = songData.udu.LoudnessMax;
	a.splice(0,2); // first two values in array are a null value and a 0. get rid of these
	getMaxMin();
	console.log("max: "+streamMax+' min: '+streamMin);
}

function draw() {
	
	let timecode = round(millis()/16);
	if(timecode > a.length) {
		console.log("done! "+millis());
		noLoop();
		millisToTime(millis());
	}
	//console.log(a[timecode]+' '+a[frameCount]);
	//console.log(timecode+' '+frameCount);
	//console.log(timecode-frameCount);
	if(frameCount % 20 == 0) {
		console.log(a[timecode]+' | '+mapStream(a[timecode]));
	};
}

function millisToTime(mills) {
	let minutes = Math.floor(mills / 60000);
	let seconds = round((mills % 60000)/1000); 
	console.log(minutes+':'+seconds);
}
// function mousePressed () {
// 	if(loopState = 1) {
// 		noLoop();
// 		loopState = 0;
// 	} else {
// 		loop();
// 		loopState = 1;
// 	}
// }

function getMaxMin () {
	for (let i = 0; i<a.length; i++) {
		if(a[i] > streamMax) {
			streamMax=a[i];
		};
	};
	for (let i = 0; i<a.length; i++) {
		if(a[i] < streamMin) {
			streamMin=a[i];
		};
	};
}

function mapStream (stream) {
	return map(stream,streamMin,streamMax,-1,1);
}