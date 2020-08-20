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

  drawP (xoff, pAmt, sAmt, oct, falloff, inc) {
    noiseDetail(oct,falloff);
    let perlx = map(noise(xoff),0,1,-pAmt,pAmt);
    let perly = map(noise(xoff+2349),0,1,-pAmt,pAmt);
    translate(perlx, perly);
    let xx = sin_(xoff,69,-sAmt,sAmt);
    let yy = sin_(xoff,27,-sAmt,sAmt);
    translate(xx,yy);
    xoff += inc;
    this.drawShape();
  }

  drawShape() {
    let v = this.vertices;
    let c = this.controls;
    let c2 = this.controls2;

    beginShape();
    for (let i = 0; i < v.length + 1; i++) {
      if(i == 0) {
        vertex(v[0].x, v[0].y)
      } else if (i == v.length) {
        bezierVertex(c[0].x, c[0].y, c2[0].x, c2[0].y, v[0].x, v[0].y);
      } else {
        bezierVertex(c[i].x, c[i].y, c2[i].x, c2[i].y, v[i].x, v[i].y);
      }
    }
    endShape();
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

class Tube {
  constructor(maxlen) {
    this.forms = [];
    this.maxlines = maxlen;
  }
  
  createAll(){}

  centerP (cenOct, cenFall, cenOff, cenRange, scale) {
    noiseDetail(cenOct, cenFall);
    cenRange *= scale;
    let posX = map(noise(cenOff), 0, 1, -cenRange, cenRange);
	  let posY = map(noise(cenOff+232), 0, 1, cenRange , cenRange);
  	translate(posX, posY);
  }
  
  addForm (itemToAdd) {
    let arr = this.forms;
    let max = this.maxlines;
    arr.push(itemToAdd);
    if(arr.length > max) { 
      for(let i = 0; i < arr.length - max; i++) {
        arr.shift();
      }
    }
  }

  lines () {
    let max = this.maxlines;
    let len = this.forms.length;
    let g = {};
    
    if(len <= max) {
      g.end = len;
      g.start = 0;
    } else if (len > max) {
      g.end = len;
      g.start = len - max;
    } 

    return g;
  }

  drawMany(howmany,recede,rot){
    let l = this.lines();
    for(let j = 0; j < howmany; j++) {
      if(recede) {
        let o = 1 - (j * (1 / howmany));
        scale(o);
      }
      if(rot > 0) {
        let t = j * (TWO_PI /  howmany);
        rotate(t * rot);
      }
      for (let i = l.start; i < l.start + l.end; i++) {
        this.forms[i].drawShape();
      }
    }
    
  }

  draw() {
    let l = this.lines();
    for (let i = l.start; i < l.start + l.end; i++) {
      this.forms[i].drawShape();
    }
  }

  drawP (tOff, tAmt, wAmt, tOct, tFall, tInc) {
    let l = this.lines();
    for (let i = l.start; i < l.start + l.end; i++) {
      this.forms[i].drawP(tOff, tAmt, wAmt, tOct, tFall, tInc);
    }
  }
}