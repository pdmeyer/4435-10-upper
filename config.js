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
const posInc = 0.004;
const posRange = 20;

//direction of tube
const transOct = 10; // perl oct
const transFall = 0.5; // perl inc
const transInc = 0.008; // perl increment
const transAmt = 10;

//tube wiggle
const wiggleAmt = 4;

//length of tube
const maxlines = 20; // number of forms to draw per frame

/***********************************************************************/

//sketch config
const writeSpeed = 10;
const easing = 0.1; // for mouse pointer
const showTimeCode = false;
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
let tube = [];
let shadow = [];
let formOff = Math.floor(Math.random() * 10000); // modulation of the form shape
let transOff = formOff + 639; // modulation of form position
let posOff = transOff + 892;

//JSON data
let songData;
let otTone;
let phonem;
let outside;
let radiodrone;