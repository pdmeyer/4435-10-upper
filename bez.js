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

  create () {
    let xoff = 0;

    //vertices
    for(let a=0; a < TWO_PI; a += this.spacing) {
      let perl = random();//noise(xoff);
      let mag = this.magbase + perl * this.magrange;
      console.log(xoff+" "+noise(xoff))
      let vertex = p5.Vector.fromAngle(a,mag)
      this.vertices.push(vertex);
      xoff += this.perlinc
    }
    console.log('vertices: '+this.vertices);

    //control points 1
    xoff = 50;
    for(let a = 0; a < this.vertices.length; a++) {
      let angle = this.vertices[a].heading() - (2 * noise(xoff)) * this.spacing/2;
      let mag = this.vertices[a].mag() * this.ctrlscl * (noise(xoff) + 1);
      let control = p5.Vector.fromAngle(angle,mag)
      this.controls.push(control);
      xoff += this.perlinc
    }
    //control points 2
    xoff = 900;
    for(let a = 0; a < this.vertices.length; a++) {
      let angle = this.vertices[a].heading() - (2 * noise(xoff)) * this.spacing/2;
      let mag = this.vertices[a].mag() * this.ctrlscl * (noise(xoff) + 1);
      let control = p5.Vector.fromAngle(angle,mag)
      this.controls2.push(control);
      xoff += this.perlinc
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

  update (number) {
    let xoff = 456;
    let yoff = 7893;
    beginShape();
    for (let j = 0; j < number; j++) {
      let perlx = noise(xoff);
      let perly = noise(yoff);
      scale(1 - perlx / number, 1 - perly / number);
      //scale(1 - j/number, 1 - j/number)
      beginShape();
      for (let i = 0; i < this.vertices.length + 1; i++) {
        if(i == 0) {
          vertex(this.vertices[0].x, this.vertices[0].y)
        } else if (i == this.vertices.length) {
          bezierVertex(this.controls[0].x, this.controls[0].y, this.controls2[0].x, this.controls2[0].y, this.vertices[0].x, this.vertices[0].y);
        } else {
          bezierVertex(this.controls[i].x, this.controls[i].y, this.controls2[i].x, this.controls2[i].y, this.vertices[i].x, this.vertices[i].y);
        }
      }
      endShape();
      xoff += this.perlinc;
      yoff += this.perlinc;
    }
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