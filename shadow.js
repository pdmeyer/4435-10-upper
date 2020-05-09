class ShadowForm {
  constructor(vertices, magbase, magrange, octaves, falloff, perlinc, ctrlscl) {
    this.spacing = TWO_PI / vertices;
    this.vertices = [];
    this.controls = [];
    this.controls2 = [];
    this.magrange = magrange;
    this.magbase = magbase;
    this.perlinc = perlinc;
    this.ctrlscl = ctrlscl;
    this.octaves = octaves;
    this.falloff = falloff;
  }

  create (xoff) {

    //vertices
    for(let a=0; a < TWO_PI; a += this.spacing) {
      let perl = noise(xoff);
      let mag = this.magbase + perl * this.magrange;
      let vertex = p5.Vector.fromAngle(a,mag);
      this.vertices.push(vertex);
      xoff += this.perlinc
    }
    

    //control points 1
    let cp1off = xoff + 50;
    for(let a = 0; a < this.vertices.length; a++) {
      let angle = this.vertices[a].heading() - (2 * noise(cp1off)) * this.spacing/2;
      let mag = this.vertices[a].mag() * this.ctrlscl * (noise(cp1off) + 1);
      let control = p5.Vector.fromAngle(angle,mag)
      this.controls.push(control);
      cp1off += this.perlinc
    }
    //control points 2
    let cp2off = xoff + 900;
    for(let a = 0; a < this.vertices.length; a++) {
      let angle = this.vertices[a].heading() - (2 * noise(cp2off)) * this.spacing/2;
      let mag = this.vertices[a].mag() * this.ctrlscl * (noise(cp2off) + 1);
      let control = p5.Vector.fromAngle(angle,mag)
      this.controls2.push(control);
      cp2off += this.perlinc
    }
  }

  updateVPoints () {
    for (let i = 0; i < this.vertices.length; i++) {
      point(this.vertices[i].x, this.vertices[i].y);
    }
  }

  updateCPoints () {
    for (let i = 0; i < this.controls.length; i++) {
      point(this.controls[i].x, this.controls[i].y);
    }
  }


  update (number, xoff, oct, falloff, inc) {
    // let xoff = 456;
    // let yoff = 7893;
    // for (let j = 0; j < number; j++) {
    //   let perlx = noise(xoff);
    //   let perly = noise(yoff);
    //   scale(1 - perlx / number, 1 - perly / number);
    //   //scale(1 - j/number, 1 - j/number) 
      noiseDetail(oct,falloff);
      let perlx = noise(xoff);
      let perly = noise(xoff+2349);
      translate(map(perlx,0,1,-20,20), map(perly,0,1,-20,20));
      beginShape();
      for (let i = 0; i < this.vertices.length + 1; i++) {
        if(i == 0) {
          vertex(this.vertices[0].x, this.vertices[0].y)
        } else if (i == this.vertices.length) {
          bezierVertex(this.controls[0].x, this.controls[0].y, this.controls2[0].x, this.controls2[0].y, this.vertices[0].x, this.vertices[0].y);
        } else {
          bezierVertex(this.controls[i].x, this.controls[i].y, this.controls2[i].x, this.controls2[i].y, this.vertices[i].x, this.vertices[i].y);
        }
        xoff += inc;
      }
      endShape();
      // xoff += 1;
      // yoff += 1;
    // }
  }

  get angles () {
    let angles = {
      vertices: [],
      controls: [],
      controls2: []
    }
    for (let i = 0; i < this.vertices.length; i++) {
      angles.vertices.push(this.vertices[i].heading());
      angles.controls.push(this.controls[i].heading());
      angles.controls2.push(this.controls[i].heading());
    }
    return angles;
  }

  get mags() {
    let mags = {
      vertices: [],
      controls: [],
      controls2: []
    }
    for (let i = 0; i < this.vertices.length; i++) {
      angles.vertices.push(this.vertices[i].mag());
      angles.controls.push(this.controls[i].mag());
      angles.controls2.push(this.controls[i].mag());
    }
    return mags;
  }
}

function writeLines (arr, framecount, maxlines, xoff, oct, falloff, inc) {
  let startLine;
  let numLines;
  let len = arr.length;
  
  if(framecount < maxlines) {
    numLines = framecount;
    startLine = len - framecount;
  } else if (len < maxlines) {
    numLines = len;
    startLine = 0;
  } else {maxlines
    numLines = maxlines;
    startLine = len - maxlines;
  }

  for (let i = startLine; i < startLine + numLines; i++) {
    arr[i].update(1, xoff, oct, falloff, inc);
  }
}
