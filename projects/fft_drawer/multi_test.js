var s = function(p) {
  p.setup = function() {
    p.createCanvas(400,400);
    p.background(255,0,0);
  };

  p.draw = function() {
  };
};
var myp5 = new p5(s,'c1');

var t = function(p) {
  p.setup = function() {
    p.createCanvas(600,600);
    p.background(0);
  };
  p.draw = function() {
  };
};

var myp5 = new p5(t,'c2');
