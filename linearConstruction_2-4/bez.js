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

