
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
  constructor(x1,y1,x2,y2,x3,y3,x4,y4,x5,y5,x6,y6) {
    this.x1= x1;
    this.y1= y1;
    this.x2= x2;
    this.y2= y2;
    this.x3= x3;
    this.y3= y3;
    this.x4= x4;
    this.y4= y4;
    this.x5= x5;
    this.y5= y5;
    this.x6= x6;
    this.y6= y6;
  }

  show (number) {
    for (let i=0; i < number; i++) {
      // ellipse(width/2, height/2, 500-(5*i), 500-(5*i));
      scale(1-i/number,1-i/number);
      beginShape();
      curveVertex(this.x1,this.y1);
      curveVertex(this.x2,this.y2);
      curveVertex(this.x3,this.y3);
      curveVertex(this.x4,this.y4);
      curveVertex(this.x1,this.y1);
      curveVertex(this.x5,this.y5);
      curveVertex(this.x6,this.y6);
      curveVertex(this.x2,this.y2);
      curveVertex(this.x2,this.y2);
      endShape();
    }
  }
}