
  class Bez {
    constructor(obj) {
      this.x1 = obj.vert.x1;
      this.y1 = obj.vert.y1;
      this.cpx1 = obj.vert.cpx1;
      this.cpy1 = obj.vert.cpy1;
      this.cpx2 = obj.vert.cpx2;
      this.cpy2 = obj.vert.cpy2;
      this.x2 = obj.vert.x2;
      this.y2 = obj.vert.y2;
      this.stR = obj.stroke.red;
      this.stG = obj.stroke.green;
      this.stB = obj.stroke.blue;
      this.stA = obj.stroke.alpha;
      this.fR = obj.fill.red;
      this.fG = obj.fill.green;
      this.fB = obj.fill.blue;
      this.fA = obj.fill.alpha;
    }

    show (strkOr = 0, fillOr = 0) {
      if(!strkOr) {stroke(this.stR,this.stB,this.stG,this.stA)};
      if(!fillOr) {fill(this.fR, this.fG, this.fB, this.fA)};
      bezier(this.x1, this.y1, this.cpx1, this.cpy1, this.cpx2, this.cpy2, this.x2, this.y2);
    }
  }  

function writeLines (framecount, maxbezzes,strkOr=0,fillOr=0) {
  let startLine;
  let numLines;

  if(framecount < maxbezzes) {
    numLines = framecount;
    startLine = bezzes.length - framecount;
  } else if (bezzes.length < maxbezzes) {
    numLines = bezzes.length;
    startLine = 0;
  } else {
    numLines = maxbezzes;
    startLine = bezzes.length - maxbezzes;
  }

  for (let i = startLine; i < startLine + numLines; i++) {
    bezzes[i].show(strkOr,fillOr);
  }
}



class ShadowForm {
  constructor(vertices, magbase, magrange, perlinc, ctrlscl) { //a1,a2,a3,a4,a5,m1,m2,m3,m4,m5
    this.spacing = TWO_PI / vertices;
    this.vertices = [];
    this.controls = []
    this.magrange = magrange;
    this.magbase = magbase;
    this.perlinc = perlinc;
    this.ctrlscl = ctrlscl;
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

    //control points
    xoff = 50;
    for(let a = 0; a < this.vertices.length; a++) {
      let angle = this.vertices[a].heading() - (2 * noise(xoff)) * this.spacing/2;
      let mag = this.vertices[a].mag() * this.ctrlscl * (noise(xoff) + 1);
      let control = p5.Vector.fromAngle(angle,mag)
      this.controls.push(control);
      xoff += this.perlinc
    }
  }

  get angles () {
    let angles = {
      vertices: [],
      controls: []
    }
    for (let i = 0; i < this.vertices.length; i++) {
      angles.vertices.push(this.vertices[i].heading());
      angles.controls.push(this.controls[i].heading());
    }
    return angles;
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
          quadraticVertex(this.controls[0].x, this.controls[0].y, this.vertices[0].x, this.vertices[0].y);
        } else {
          quadraticVertex(this.controls[i].x, this.controls[i].y, this.vertices[i].x, this.vertices[i].y);
        }
      }
      endShape();
      xoff += this.perlinc;
      yoff += this.perlinc;
    }

    
    // for (let i=0; i < number; i++) {
    //   // ellipse(width/2, height/2, 500-(5*i), 500-(5*i));

    //   beginShape();
    //   vertex(this.pos.v1.x,this.pos.v1.y);
    //   quadraticVertex(this.pos.v2c.x,this.pos.v2c.y,this.pos.v2.x,this.pos.v2.y);
    //   quadraticVertex(this.pos.v3c.x,this.pos.v3c.y,this.pos.v3.x,this.pos.v3.y);
    //   quadraticVertex(this.pos.v4c.x,this.pos.v4c.y,this.pos.v4.x,this.pos.v4.y);
    //   quadraticVertex(this.pos.v1c.x,this.pos.v1c.y,this.pos.v1.x,this.pos.v1.y);

    // }
    // push();
    // noStroke();
    // fill(255,0,0);
    // // text("1",this.pos.v1.x,this.pos.v1.y);
    // // text("1c",this.pos.v1c.x,this.pos.v1c.y);
    // // text("2",this.pos.v2.x,this.pos.v2.y);
    // // text("2c",this.pos.v2c.x,this.pos.v2c.y);
    // // text("3",this.pos.v3.x,this.pos.v3.y);
    // // text("3c",this.pos.v3c.x,this.pos.v3c.y);
    // // text("4",this.pos.v4.x,this.pos.v4.y);
    // // text("4c",this.pos.v4c.x,this.pos.v4c.y);
    // //text("5",this.pos.v5.x,this.pos.v5.y);
    // // text("6",this.pos.v6.x,this.pos.v6.y);
    // // text("7",this.pos.v7.x,this.pos.v7.y);
    // pop();
  }
}