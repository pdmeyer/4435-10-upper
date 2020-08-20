// MOUSE CONTROLS
	// click in upper left hand corner: download image
	// click in upper right hand corner: toggle draw looping
function mousePressed () {
	if(pointregion(mouseX,mouseY,"uleft")) {
		saveImg();
	}
}

function keyPressed () {
	if(keyCode === 32) {
    if (initState) {
      loop();
      startPlay(song);
      loopState = true;
      initState = false;
    } else if(loopState) {
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