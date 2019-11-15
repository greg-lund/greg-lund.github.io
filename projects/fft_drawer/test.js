var canvasDiv;
function setup() {
  canvasDiv = document.getElementById('test');
  var width = canvasDiv.offsetWidth;
  var height = canvasDiv.offsetHeight;
  var sketchCanvas = createCanvas(width,400);
  sketchCanvas.parent('test');
  console.log(width);
  console.log(height);
}

function draw() {
  background(255,100,0);
}

function windowResized() {
  console.log("Resized!");
  var width = canvasDiv.offsetWidth;
  resizeCanvas(width,400);
}
