//TUBE PARAMS

// basic form
const vertices = 3; // number of vertices
const magbase = 20; // base vertex vector magnitude
const magrange = 60; // range of vertex vector magnitude modulation

// variation within form
const vertOct = 10; // perlin octaves
const vertFall = 0.5; // perlin falloff 
const vertInc  = 0.4; // perlin increment
const ctrlMagCoeff = 0.7; // magnitude multiplier for control points

// variation among forms
const formInc = 0.065; // perlin noise 

//start position of tube
const posOct = 10;
const posFall = 0.5;
const posInc = 0.007; //0.004
const posRange = 0; //<----

//direction of tube
const transOct = 10; // perl oct
const transFall = 0.5; // perl inc
const transInc = 0.008; // perl increment
const transAmt = 10;

//tube wiggle
const wiggleAmt = 4;

//length of tube
const maxlines = 5; // number of forms to draw per frame

//shadow form
const numShadows = 800;
const shadvert = 3;
const shadowfill = [10,10,10,9]
const rotinc = 0.03;
const shadmb = 0.3;
const shadmr = 0.2;
const shadoct = 4;
const shadflf = 0.1;
const shadscl = 0.8;
const shadinc = 1.9;

//background
  // 'img/test-452.png' // 'img/test-644.png' // sidewalk741.png //'img/sidewalk741.png' // 'img/sidewalk660.png'
const imgfile = 'img/test-452.png'; 
const submatx = 0.5;


/***********************************************************************/

//sketch config

const writeSpeed = 50;
const easing = 0.1; // for mouse pointer
const showTimeCode = true;
const songLength = 11374;
const sketchName = "covd-visual";
const fileFormat = 'png'; //'jpg' or 'png'

/***********************************************************************/

//initial 
let c;
let xpos;
let ypos;
let clickCount = 0;
let loopState = false;
let initState = true;
let tube;
let shadow;
let formOff = Math.floor(Math.random() * 10000); // modulation of the form shape
let transOff = formOff + 639; // modulation of form position
let posOff = transOff + 892;
let rotamt = 0;
let mills = 0;
let ii = 0;
let timecode = 0;
let rotdisp;
let img;
let howmany = 0;


//JSON data
let songData;
let otTone;
let phonem;
let outside;
let radiodrone;