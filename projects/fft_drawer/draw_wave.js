let N = 100;

let time = 0;
let speed = 0.025;

let wave = [];
let n = 1;
let R = 75;

function setup() {
  cnv = createCanvas(400,400);
  cnv.parent('draw_wave');
}

function draw() {
  background(0);

  translate(200, 200);

  let x = 0;
  let y = 0;

  for(let i = 0; i < N; i++) {
    // prevx/y is the center location for this circle
    let prevx = x;
    let prevy = y;

    //Function dependent, increment current pos by new circle
    let n = 2*i + 1;
    let radius = R * (4 / (n * PI));
    x += radius * cos(n * time);
    y += radius * sin(n * time);

    //Draw current circle starting from prevx/y
    stroke(255, 100);
    noFill();
    ellipse(prevx,prevy,radius*2);

    //Draw a line from old circle to current circle center
    stroke(255);
    line(prevx,prevy,x,y);

  }

  //Push new y location at the beginning of the array
  wave.unshift(y);

  //Draw the actual function
  translate(200,0);
  line(x - 200,y,0,y);
  beginShape();
  noFill();
  for(let i = 0; i < wave.length; i++) {
    vertex(i, wave[i]);
  }
  endShape();

  time += speed;

  //Can delete entries once they are off the screen
  if(wave.length > 250) {
    wave.pop();
  }
}
