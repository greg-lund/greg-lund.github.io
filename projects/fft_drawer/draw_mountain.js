var mountain = function(p) {
  var N = 64; //N must be a power of 2
  var threshold = 1e-10;

  var time = 0;
  var speed = 0.001;
  var wave = [];
  var R = 0.35;
  var scale_factor = 1.5;

  var real = new Float32Array(N);
  var imag = new Float32Array(N);
  var data = [];

  p.setup = function() {
    var fft = new FFTNayuki(N);

    var out = getParameters(parse_string(string));
    var lens = total_len(out);
    var sample = resample(lens[1],lens[0],N);
    console.log(sample);
    for(var i = 0; i < N; i++) {
      var curr = sample[i];
      real[i] = scale_factor*curr[0];
      imag[i] = scale_factor*curr[1];
    }

    //Transform
    fft.forward(real,imag);

    for(var i = 0; i < N; i++) {
      if(Math.abs(real[i]) < threshold) {
        real[i] = 0;
      } if(Math.abs(imag[i]) < threshold) {
        imag[i] = 0;
      }
      real[i] = real[i]/N;
      imag[i] = imag[i]/N;

      if(real[i] !=0 || imag[i] != 0) {
        let a = real[i];
        let b = imag[i];
        let r = Math.sqrt(a*a+b*b);
        let phase = Math.atan2(b,a);

        var entry = [i, r, phase];
        data.push(entry);
      }

    }

    //Lets sort the array in descending order of radius
    data.sort(function(a,b) {
      return b[1] - a[1];
    });

    //Create Viewing Area
    p.createCanvas(600,400);

  };

  p.draw = function() {
    p.background(0);
    p.translate(-10,0);

    let x = 0;
    let y = 0;

    for(var i = 0; i < data.length; i++) {
      //prevx/y is center for this circle
      let prevx = x;
      let prevy = y;

      //Get relative radius and phase offset
      let w = data[i][0];
      if(w > N/2) {
        w = w-N;
      }
      let rad = data[i][1];
      let phase = data[i][2];

      x += R * rad * Math.cos(w*2*Math.PI*time + phase);
      y += R * rad * Math.sin(w*2*Math.PI*time + phase);

      //Draw current circle starting at prevx/y
      p.stroke(255,100);
      p.noFill();
      p.ellipse(prevx,prevy,R*rad*2);

      //Draw a line from old circle to new circle
      p.stroke(255);
      p.line(prevx,prevy,x,y);
    }

    //Push new location at the beginning of the array
    let loc = [x,y];
    wave.unshift(loc);

    //Draw our function:
    p.noFill();
    p.stroke(255,100,0);
    p.beginShape();
    for(let i = 0; i < wave.length; i++) {
      p.vertex(wave[i][0],wave[i][1]);
    }
    p.endShape();
    time += speed;

    if(wave.length > 5000) {
      wave.pop();
    }
  };
};

var myp5 = new p5(mountain , 'fft_mountain');

var square_wave = function(p) {
  let N = 16;

  let time = 0;
  let speed = 0.025;

  let wave = [];
  let n = 1;
  let R = 50;

  p.setup = function() {
    p.createCanvas(600,400);
  };

  p.draw = function() {
    p.background(0);

    p.translate(150, 200);

    let x = 0;
    let y = 0;

    for(let i = 0; i < N; i++) {
      // prevx/y is the center location for this circle
      let prevx = x;
      let prevy = y;

      //Function dependent, increment current pos by new circle
      let n = 2*i + 1;
      let radius = R * (4 / (n * Math.PI));
      x += radius * Math.cos(n * time);
      y += radius * Math.sin(n * time);

      //Draw current circle starting from prevx/y
      p.stroke(255, 100);
      p.noFill();
      p.ellipse(prevx,prevy,radius*2);

      //Draw a line from old circle to current circle center
      p.stroke(255);
      p.line(prevx,prevy,x,y);

    }

    //Push new y location at the beginning of the array
    wave.unshift(y);

    //Draw the actual function
    p.stroke(255,100);
    p.translate(200,0);
    p.line(x - 200,y,0,y);
    p.stroke(255,100,0);
    p.beginShape();
    p.noFill();
    for(let i = 0; i < wave.length; i++) {
      p.vertex(i, wave[i]);
    }
    p.endShape();

    time += speed;

    //Can delete entries once they are off the screen
    if(wave.length > 350) {
      wave.pop();
    }
  };
};

var myp5 = new p5(square_wave , 'fft_square_wave');

var ellipse = function(p) {
  var N = 4; //N must be a power of 2
  var threshold = 1e-10;

  var time = 0;
  var speed = 0.0020;
  var wave = [];
  var R = 75;
  var scale_factor = 1;

  var real = new Float32Array(N);
  var imag = new Float32Array(N);
  var data = [];

  function f_ellipse(a,b,t) {
    if(t < 2) {
      let x = a-a*t;
      let y = -b*Math.sqrt(1-x*x/(a*a));
      return [x,y];
    } else {
      let x = -a + a*(t-2);
      let y = b*Math.sqrt(1-x*x/(a*a));
      return [x,y];
    }

  };

  p.setup = function() {
    var fft = new FFTNayuki(N);

    for(var i = 0; i < N; i++) {
      var vals = f_ellipse(2,1,4/N*i);
      real[i] = scale_factor*vals[0];
      imag[i] = scale_factor*vals[1];
    }

    //Perform transform
    fft.forward(real,imag);

    for(var i = 0; i < N; i++) {
      if(Math.abs(real[i]) < threshold) {
        real[i] = 0;
      } if(Math.abs(imag[i]) < threshold) {
        imag[i] = 0;
      }
      real[i] = real[i]/N;
      imag[i] = imag[i]/N;

      if(real[i] !=0 || imag[i] != 0) {
        let a = real[i];
        let b = imag[i];
        let r = Math.sqrt(a*a+b*b);
        let phase = Math.atan2(b,a);

        var entry = [i, r, phase];
        data.push(entry);
      }

    }

    //Lets sort the array in descending order of radius
    data.sort(function(a,b) {
      return b[1] - a[1];
    });

    //Create Viewing Area
    p.createCanvas(600,400);

  }

  p.draw = function() {
    p.background(0);
    p.translate(200,200);

    let x = 0;
    let y = 0;

    for(i = 0; i < data.length; i++) {
      //prevx/y is center for this circle
      let prevx = x;
      let prevy = y;

      //Get relative radius and phase offset
      let w = data[i][0];
      if(w > N/2) {
        w = w-N;
      }
      let rad = data[i][1];
      let phase = data[i][2];

      x += R * rad * Math.cos(w*2*Math.PI*time + phase);
      y += R * rad * Math.sin(w*2*Math.PI*time + phase);

      //Draw current circle starting at prevx/y
      p.stroke(255,100);
      p.noFill();
      p.ellipse(prevx,prevy,R*rad*2);

      //Draw a line from old circle to new circle
      p.stroke(255);
      p.line(prevx,prevy,x,y);
    }

    //Push new location at the beginning of the array
    let loc = [x,y];
    wave.unshift(loc);

    //Draw our function:
    p.noFill();
    p.stroke(255,100,0);
    p.beginShape();
    for(let i = 0; i < wave.length; i++) {
      p.vertex(wave[i][0],wave[i][1]);
    }
    p.endShape();
    time += speed;

    if(wave.length > 10000) {
      wave.pop();
    }
  };
}
var myp5 = new p5(ellipse , 'fft_ellipse');

var square = function(p) {

  var N = 128; //N must be a power of 2
  var threshold = 1e-10;

  var time = 0;
  var speed = 0.0020;
  var wave = [];
  var R = 75;
  var scale_factor = 2;

  var real = new Float32Array(N);
  var imag = new Float32Array(N);
  var data = [];

  function f_square(t) {
    if(t <= 1) {
      return [t,0];
    } else if(t <= 2) {
      return [1,t-1];
    } else if(t <=3) {
      return [3-t, 1];
    } else {
      return [0,4-t];
    }
  }


  p.setup = function() {
    var fft = new FFTNayuki(N);

    for(var i = 0; i < N; i++) {
      var vals = f_square(4/N*i);
      real[i] = scale_factor*vals[0];
      imag[i] = scale_factor*vals[1];
    }

    //Perform transform
    fft.forward(real,imag);

    for(var i = 0; i < N; i++) {
      if(Math.abs(real[i]) < threshold) {
        real[i] = 0;
      } if(Math.abs(imag[i]) < threshold) {
        imag[i] = 0;
      }
      real[i] = real[i]/N;
      imag[i] = imag[i]/N;

      if(real[i] !=0 || imag[i] != 0) {
        let a = real[i];
        let b = imag[i];
        let r = Math.sqrt(a*a+b*b);
        let phase = Math.atan2(b,a);

        var entry = [i, r, phase];
        data.push(entry);
      }

    }

    //Lets sort the array in descending order of radius
    data.sort(function(a,b) {
      return b[1] - a[1];
    });

    //Create Viewing Area
    p.createCanvas(600,400);

  };

  p.draw = function() {
    p.background(0);
    p.translate(200,200);

    let x = 0;
    let y = 0;

    for(i = 0; i < data.length; i++) {
      //prevx/y is center for this circle
      let prevx = x;
      let prevy = y;

      //Get relative radius and phase offset
      let w = data[i][0];
      if(w > N/2) {
        w = w-N;
      }
      let rad = data[i][1];
      let phase = data[i][2];

      x += R * rad * Math.cos(w*2*Math.PI*time + phase);
      y += R * rad * Math.sin(w*2*Math.PI*time + phase);

      //Draw current circle starting at prevx/y
      p.stroke(255,100);
      p.noFill();
      p.ellipse(prevx,prevy,R*rad*2);

      //Draw a line from old circle to new circle
      p.stroke(255);
      p.line(prevx,prevy,x,y);
    }

    //Push new location at the beginning of the array
    let loc = [x,y];
    wave.unshift(loc);

    //Draw our function:
    p.noFill();
    p.stroke(255,100,0);
    p.beginShape();
    for(let i = 0; i < wave.length; i++) {
      p.vertex(wave[i][0],wave[i][1]);
    }
    p.endShape();
    time += speed;

    if(wave.length > 10000) {
      wave.pop();
    }
  };
}

var myp5 = new p5(square , 'fft_square');
