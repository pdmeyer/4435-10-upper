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


  update (xoff, pAmt, sAmt, oct, falloff, inc) {
      noiseDetail(oct,falloff);
      let perlx = map(noise(xoff),0,1,-pAmt,pAmt);
      let perly = map(noise(xoff+2349),0,1,-pAmt,pAmt);
      translate(perlx, perly);
      let xx = sin_(xoff,69,-sAmt,sAmt);
      let yy = sin_(xoff,27,-sAmt,sAmt);
      translate(xx,yy);

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