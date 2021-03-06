var step_size = 0.001;
var threshold = 1e-6;
var test = [];
var pts = [];

var string = "M101.781,454.577c19.757-10.937,45.551-25.205,75.46-50.862c 29.91 -25.656,63.936 -62.7,86.711 -92.609  c 22.775 -29.91,34.299 -52.685,45.344-74.088c11.044-21.403,21.608-41.434,28.4-53.645s9.81-16.601,12.622-15.915  c2.813,0.686,5.42,6.448,7.409,10.838c1.99,4.391,3.362,7.409,8.712-0.254c5.351-7.664,14.681-26.009,23.187-44.806  s16.189-38.044,20.251-47.256c4.063-9.212,4.503-8.389,7.658-2.489c3.155,5.9,9.026,16.875,19.508,36.632  s25.573,48.294,36.755,69.835c11.182,21.541,18.454,36.084,22.707,39.651c4.253,3.567,5.488-3.841,6.657-7.011  c1.17-3.169,2.273-2.099,6.801,2.292c4.528,4.39,12.479,12.101,27.156,32.694c14.678,20.594,36.081,54.071,55.563,78.629  s37.044,40.2,54.605,55.429c17.562,15.229,35.123,30.047,55.703,40.749c20.58,10.701,44.179,17.287,51.176,21.54  s-2.606,6.174-17.424,7.409c-14.818,1.234-34.85,1.783-59.957-0.824c-25.107-2.606-55.292-8.368-57.762-4.802  c-2.47,3.567,22.775,16.464,29.772,23.324c6.998,6.86-4.253,7.684-23.461,5.488s-46.374-7.409-68.875-9.604  c-22.5-2.195-40.336-1.372-52.547,4.116s-18.797,15.641-41.435,27.165c-22.639,11.525-61.329,24.423-76.284,27.166  c-14.955,2.744-6.174-4.665-0.412-13.445c5.763-8.781,8.507-18.934-2.332-21.814c-10.839-2.882-35.261,1.509-69.835,6.448  s-79.302,10.427-107.427,13.171c-28.126,2.744-39.651,2.744-38.69-2.332c0.96-5.077,14.406-15.229,10.976-19.346  c-3.43-4.115-23.736-2.195-53.645-2.47c-29.91-0.274-69.424-2.743-82.732-5.253s-0.412-5.059,12.897-10.135  C68.304,473.117,82.024,465.513,101.781,454.577z";

var plus = "M 100,100 h 50 v 50 h 50 v 50 h -50 v 50 h -50 v -50 h -50 v -50 h 50 z";
var gear = "m176.98 366.95-9.444-3.157c-1.154-4.876-3.07-9.456-5.629-13.6l4.442-8.904c-3.049-4.021-6.638-7.609-10.658-10.657l-8.905 4.442c-4.143-2.56-8.723-4.478-13.598-5.631l-3.157-9.443c-2.464-0.337-4.978-0.516-7.535-0.516s-5.07 0.179-7.535 0.516l-3.157 9.443c-4.875 1.153-9.455 3.071-13.599 5.631l-8.904-4.442c-4.021 3.048-7.609 6.636-10.656 10.657l4.442 8.904c-2.56 4.144-4.478 8.724-5.63 13.6l-9.444 3.157c-0.337 2.463-0.516 4.978-0.516 7.534s0.178 5.071 0.516 7.534l9.444 3.157c1.153 4.876 3.07 9.456 5.629 13.6l-4.44 8.904c3.047 4.021 6.635 7.609 10.656 10.657l8.904-4.442c4.144 2.56 8.724 4.478 13.599 5.631l3.157 9.442c2.464 0.338 4.978 0.517 7.535 0.517s5.07-0.179 7.535-0.517l3.157-9.442c4.875-1.153 9.455-3.071 13.598-5.63l8.905 4.441c4.02-3.048 7.609-6.636 10.656-10.657l-4.44-8.904c2.559-4.144 4.475-8.724 5.629-13.6l9.444-3.157c0.337-2.463 0.516-4.978 0.516-7.534s-0.179-5.071-0.517-7.534";


function resample(arr,l_tot,n_tot) {
  var out = [];
  var ns,s;
  var r = 0;
  var ds = l_tot/n_tot;
  console.log(ds);
  var n = 0;

  for(var i = 0; i < arr.length; i++) {
    var curr = arr[i];
    switch(curr[0]) {

      case "L":

        s = curr[5] - r;
        ns = n_tot*s/l_tot;

        var x = 0;
        var y = 0;
        var dx = curr[3]-curr[1];
        var dy = curr[4]-curr[2];
        var x0 = curr[1] + dx*r/curr[5];
        var y0 = curr[2] + dy*r/curr[5];
        dx = dx - dx*r/curr[5];
        dy = dy - dy*r/curr[5];

        for(var j = 0; j < ns; j++) {
          x = x0 + j*dx/ns;
          y = y0 + j*dy/ns;
          out.push([x,y]);
        }

        r = ds - Math.sqrt(Math.pow(curr[3] - x, 2) + Math.pow(curr[4] - y, 2));
        break;

      case "C":

        var p0 = [curr[1],curr[2]];
        var p1 = [curr[3],curr[4]];
        var p2 = [curr[5],curr[6]];
        var p3 = [curr[7],curr[8]];
        var x = p0[0];
        var y = p0[1];

        var t = 0;
        var len = 0;
        var px = p0[0];
        var py = p0[1];

        //Is this curve long enough to sample?
        if(curr[9] < r) {
          r -= +curr[9];
          console.log("Short! r = " + r);
          break;
        }

        while(len < r) {
          t+= +step_size;
          x = Math.pow(1-t, 3)*p0[0] + 3*Math.pow(1-t,2)*t*p1[0] + 3*(1-t)*t*t*p2[0] + t*t*t*p3[0];
          y = Math.pow(1-t, 3)*p0[1] + 3*Math.pow(1-t,2)*t*p1[1] + 3*(1-t)*t*t*p2[1] + t*t*t*p3[1];
          len+= Math.sqrt(Math.pow(x - px, 2) + Math.pow(y - py, 2));
          px = x;
          py = y;
        }
        out.push([x,y]);

        var cs;
        while(t <= 1) {
          cs = 0;
          while(t <= 1 && cs < ds) {
            t+= +step_size;
            x = Math.pow(1-t, 3)*p0[0] + 3*Math.pow(1-t,2)*t*p1[0] + 3*(1-t)*t*t*p2[0] + t*t*t*p3[0];
            y = Math.pow(1-t, 3)*p0[1] + 3*Math.pow(1-t,2)*t*p1[1] + 3*(1-t)*t*t*p2[1] + t*t*t*p3[1];
            cs+= Math.sqrt(Math.pow(x - px, 2) + Math.pow(y - py, 2));
            px = x;
            py = y;
          }
          if(cs >= ds) {
            out.push([x,y]);
          } else {
            var last = out[out.length - 1];
            x = last[0];
            y = last[1];
            px = x;
            py = y;
            n++;
          }
        }

        r = ds - Math.sqrt(Math.pow(p3[0] - x,2) + Math.pow(p3[1] - y,2));
        console.log("n: " + n);
        if(r == 0) console.log("Zero!");

        break;
      case "Q":
        break;
      default:
        break;
    }
  }
  return out;
}

function draw_cubic(p0, p1, p2, p3) {
  stroke(255);
  noFill();
  beginShape();
  for(var t = 0; t <= 1; t+= step_size) {
    let x = Math.pow(1-t, 3)*p0[0] + 3*Math.pow(1-t,2)*t*p1[0] + 3*(1-t)*t*t*p2[0] + t*t*t*p3[0];
    let y = Math.pow(1-t, 3)*p0[1] + 3*Math.pow(1-t,2)*t*p1[1] + 3*(1-t)*t*t*p2[1] + t*t*t*p3[1];
    vertex(x,y);
  }
  endShape();
}

function len_cubic(p0,p1,p2,p3) {
  var prev = [p0[0],p0[1]];
  var x,y;
  var len = 0;
  for(var t = step_size; t <= 1; t+= step_size) {
    x = Math.pow(1-t, 3)*p0[0] + 3*Math.pow(1-t,2)*t*p1[0] + 3*(1-t)*t*t*p2[0] + t*t*t*p3[0];
    y = Math.pow(1-t, 3)*p0[1] + 3*Math.pow(1-t,2)*t*p1[1] + 3*(1-t)*t*t*p2[1] + t*t*t*p3[1];
    len = +len + Math.sqrt(Math.pow(x-prev[0],2)+Math.pow(y-prev[1],2));
    prev = [+x,+y];
  }
  return len;
}

function len_quad(p0,p1,p2) {
  var prev = [p0[0],p0[1]];
  var x,y;
  var len = 0;
  for(var t = step_size; t <= 1; t+= step_size) {
    x = Math.pow(1-t, 2)*p0[0] + 2*(1-t)*t*p1[0] + t*t*p2[0];
    y = Math.pow(1-t, 2)*p0[1] + 2*(1-t)*t*p1[1] + t*t*p2[1];
    len = +len + Math.sqrt(Math.pow(x-prev[0],2)+Math.pow(y-prev[1],2));
    prev = [+x,+y];
  }
  return len;
}

function len_line(x0,y0,x1,y1) {
  return Math.sqrt(Math.pow(x0-x1,2)+Math.pow(y0-y1,2));
}

function draw_quadratic(p0, p1, p2) {
  stroke(255);
  noFill();
  beginShape();
  for(var t = 0; t <= 1; t+= step_size) {
    let x = Math.pow(1-t, 2)*p0[0] + 2*(1-t)*t*p1[0] + t*t*p2[0];
    let y = Math.pow(1-t, 2)*p0[1] + 2*(1-t)*t*p1[1] + t*t*p2[1];
    vertex(x,y);
  }
  endShape();
}

function deriv_cubic(p0,p1,p2,p3, r) {
  var x = 3*Math.pow(1-t,2)*(p1[0] - p0[0]) + 6*t*(1-t)*(p2[0]-p1[0]) + 3*t*t*(p3[0]-p2[0]);
  var y = 3*Math.pow(1-t,2)*(p1[1] - p0[1]) + 6*t*(1-t)*(p2[1]-p1[1]) + 3*t*t*(p3[1]-p2[1]);
  return [x,y];
}


function getParameters(str) {

  var out = [];
  var prev;

  var arr = str.split(/[\s,]+/);
  if(arr[arr.length-1] == "") arr = arr.slice(0, -1);
  for(var i = 0; i < arr.length; i++) {
    var c = arr[i];
    var n = numArgs(c);
    var curr = [];

    if(n==-1) {
      c = prev;
      n = numArgs(prev);
      if(n==-1) return out;
      curr.push(c);
      for(var j = 0; j < n; j++) curr.push(arr[i+j]);
      i+=n-1;
    } else {
      curr.push(c);
      for(var j = 1; j <=n; j++) curr.push(arr[i+j]);
      i+=n;
    }
    out.push(curr);

    prev = c;
  }
  return out;
}

function numArgs(c) {

  var arg1 = ["H","h","V","v"];
  var arg2 = ["M","m","L","l","T","t"];
  var arg4 = ["S","s","Q","q"];
  var arg6 = ["C","c"];
  var arg7 = ["A","a"];

  if(arg1.includes(c)) {
    return 1;
  }

  else if(arg2.includes(c)) {
    return 2;
  }

  else if(arg4.includes(c)) {
    return 4;
  }

  else if(arg6.includes(c)) {
    return 6;
  }

  else if(arg7.includes(c)) {
    return 7;
  }

  else if(c=='Z' || c=='z') {
    return 0;
  }

  else {
    return -1;
  }
}

function drawProcessed(arr) {
  stroke(255);
  noFill;
  for(var i = 0; i < arr.length; i++) {
    var curr = arr[i];
    switch(curr[0]) {
      case "L":
        line(curr[1],curr[2],curr[3],curr[4]);
        break;
      case "C":
        var p0 = [curr[1],curr[2]];
        var p1 = [curr[3],curr[4]];
        var p2 = [curr[5],curr[6]];
        var p3 = [curr[7],curr[8]];
        draw_cubic(p0,p1,p2,p3);
        break;
      case "Q":
        var p0 = [curr[1],curr[2]];
        var p1 = [curr[3],curr[4]];
        var p2 = [curr[5],curr[6]];
        draw_quadratic(p0,p1,p2);
        break;
      default:
        break;
    }
  }
}

function drawSVG(arr) {
  stroke(255);
  noFill();
  var x = 0;
  var y = 0;
  var x0 = 0;
  var y0 = 0;
  var prev;

  for(var i = 0; i < arr.length; i++) {
    var curr = arr[i];

    switch(curr[0]) {
      case "m":
        x= +x + +curr[1];
        y= +y + +curr[2];
        x0 = x;
        y0 = y;
        break;
      case "M":
        x = +curr[1];
        y = +curr[2];
        x0 = x;
        y0 = y;
        break;
      case "l":
        line(x,y,+x + +curr[1],+y + +curr[2]);
        x = +x + +curr[1];
        y = +y + +curr[2];
        break;
      case "L":
        line(x,y,curr[1],curr[2]);
        x = +curr[1];
        y = +curr[2];
        break;
      case "H":
        line(x,y,curr[1],y);
        x = curr[1];
        break;
      case "h":
        line(x,y,+x + +curr[1], y);
        x = +x + +curr[1];
        break;
      case "V":
        line(x,y,x,curr[1]);
        y = curr[1];
        break;
      case "v":
        line(x,y,x,+y + +curr[1]);
        y = +y + +curr[1];
        break;
      case "C":
        var p0 = [x,y];
        var p1 = [curr[1],curr[2]];
        var p2 = [curr[3],curr[4]];
        var p3 = [curr[5],curr[6]];

        draw_cubic(p0,p1,p2,p3);
        prev = ["C",p0,p1,p2,p3];

        x = p3[0];
        y = p3[1];
        break;
      case "c":
        var p0 = [x,y];
        var p1 = [+curr[1] + +x,+curr[2] + +y];
        var p2 = [+curr[3] + +x,+curr[4] + +y];
        var p3 = [+curr[5] + +x,+curr[6] + +y];

        draw_cubic(p0,p1,p2,p3);
        prev = ["C",p0,p1,p2,p3];
        x= p3[0];
        y= p3[1];
        break;
      case "S":
        var p0 = [x,y];
        var p1,p2,p3;
        //If the previous command wasnt cubic then p0 = p1
        if(prev[0] != "C") {
          p1 = [x,y];
          p2 = [curr[1],curr[2]];
          p3 = [curr[3],curr[4]];
          draw_cubic(p0,p1,p2,p3);
          x = p3[0];
          y = p3[1];
        } else {
          var cx = 2*x - +prev[3][0];
          var cy = 2*y - +prev[3][1];
          p1 = [cx,cy];
          p2 = [curr[1],curr[2]];
          p3 = [curr[3],curr[4]];
          draw_cubic(p0,p1,p2,p3);
          x = p3[0];
          y = p3[1];
        }
        prev = ["C",p0,p1,p2,p3];
        break;
      case "s":
        var p0 = [x,y];
        var p1,p2,p3;
        //If the previous command wasnt cubic then p0 = p1
        if(prev[0] != "C") {
          var p1 = [x,y];
          var p2 = [+x + +curr[1],+y + +curr[2]];
          var p3 = [+x + +curr[3],+y + +curr[4]];
          draw_cubic(p0,p1,p2,p3);
          x = p3[0];
          y = p3[1];
        } else {
          var cx = 2*x - +prev[3][0];
          var cy = 2*y - +prev[3][1];
          var p1 = [cx,cy];
          var p2 = [+x + +curr[1],+y + +curr[2]];
          var p3 = [+x + +curr[3],+y + +curr[4]];
          draw_cubic(p0,p1,p2,p3);
          x = p3[0];
          y = p3[1];
        }
        prev = ["C",p0,p1,p2,p3];
        break;
      case "Q":
        var p0 = [x,y];
        var p1 = [curr[1],curr[2]];
        var p2 = [curr[3],curr[4]];

        draw_quadratic(p0,p1,p2);
        x = p2[0];
        y = p2[1];
        break;
      case "q":
        var p0 = [x,y];
        var p1 = [+x + +curr[1],+y + +curr[2]];
        var p2 = [+x + +curr[3],+y + +curr[4]];

        draw_quadratic(p0,p1,p2);
        x = p2[0];
        y = p2[1];
        break;
      case "T":
        var p0 = [x,y];
        //If the previous command wasnt quadratic then p0 = p1
        if(prev[0].toLowerCase() != "q" && prev[0].toLowerCase != "t") {
          var p1 = [x,y];
          var p2 = [curr[1],curr[2]];
          draw_quadratic(p0,p1,p2);
          x = p2[0];
          y = p2[1];
        } else {
          var cx = 2*x - +prev[1];
          var cy = 2*y - +prev[2];
          var p1 = [cx,cy];
          var p2 = [curr[1],curr[2]];
          draw_quadratic(p0,p1,p2);
          x = p2[0];
          y = p2[1];
        }
        break;
      case "Z":
        line(x,y,x0,y0);
        return;
        break;
      case "z":
        line(x,y,x0,y0);
        return;
        break;
      default:
        break;
    }
    prev = curr;
  }
}

function parse_string(str) {
  var chars = ["M","m","L","l","H","h","V","v","C","c","S","s","Q","q","T","t","A","a","Z","z"];
  var out = "";
  for(var i = 0; i < str.length; i++) {
    var c = str[i];
    if(chars.includes(c)) {
      out += c + " ";
      continue;
    }
    //If we have a number:
    if(c=="-" || !isNaN(c)) {
      var start = i;
      if(c=="-") {
        i++;
      }
      while(i < str.length && (!isNaN(str[i]) || str[i] == ".")) {
        i++;
      }
      var num = str.slice(start,i);
      out += num + " ";
      i--;
    }
  }
  return out;
}

function printSVG(arr) {
  for(var i = 0; i < arr.length; i++) {
    var curr = arr[i];
    var str = curr[0] + " ";
    for(var j = 1; j < curr.length - 1; j++) {
      str = str + curr[j] + ",";
    }
    str = str + curr[j];
    console.log(str);
  }
}

function total_len(arr) {
  var x,y,x0,y0,len,tmp,out,ds;
  x=y=x0=y0=len=0;
  out = [];
  var done = false;
  for(var j = 0; j < arr.length; j++) {
    if(done) break;
    var curr = arr[j];
    ds = 0;

    switch(curr[0]) {
      case "m":
        x= +x + +curr[1];
        y= +y + +curr[2];
        x0 = x;
        y0 = y;
        break;
      case "M":
        x = +curr[1];
        y = +curr[2];
        x0 = x;
        y0 = y;
        break;
      case "l":
        tmp = ["L",x,y,+x+ +curr[1], +y + +curr[2]];
        ds = len_line(tmp[1],tmp[2],tmp[3],tmp[4]);
        tmp.push(ds);
        x = tmp[3];
        y = tmp[4];
        break;
      case "L":
        tmp = ["L",x,y,+curr[1],+curr[2]];
        ds = len_line(tmp[1],tmp[2],tmp[3],tmp[4]);
        tmp.push(ds);
        x = +curr[1];
        y = +curr[2];
        break;
      case "H":
        tmp = ["L",x,y,+curr[1],y];
        ds = len_line(tmp[1],tmp[2],tmp[3],tmp[4]);
        tmp.push(ds);
        x = curr[1];
        break;
      case "h":
        tmp = ["L",x,y,+x + +curr[1],y];
        ds = len_line(tmp[1],tmp[2],tmp[3],tmp[4]);
        tmp.push(ds);
        x = +x + +curr[1];
        break;
      case "V":
        tmp = ["L",x,y,x,+curr[1]];
        ds = len_line(tmp[1],tmp[2],tmp[3],tmp[4]);
        tmp.push(ds);
        y = curr[1];
        break;
      case "v":
        tmp = ["L",x,y,x,+y + +curr[1]];
        ds = len_line(tmp[1],tmp[2],tmp[3],tmp[4]);
        tmp.push(ds);
        y = +y + +curr[1];
        break;
      case "C":
        var p0 = [x,y];
        var p1 = [curr[1],curr[2]];
        var p2 = [curr[3],curr[4]];
        var p3 = [curr[5],curr[6]];

        prev = ["C",p0,p1,p2,p3];

        tmp = ["C",x,y];
        for(var i = 1; i <= 6; i++) tmp.push(+curr[i]);
        ds = len_cubic(p0,p1,p2,p3);
        tmp.push(ds);

        x = p3[0];
        y = p3[1];
        break;
      case "c":
        var p0 = [x,y];
        var p1 = [+curr[1] + +x,+curr[2] + +y];
        var p2 = [+curr[3] + +x,+curr[4] + +y];
        var p3 = [+curr[5] + +x,+curr[6] + +y];

        prev = ["C",p0,p1,p2,p3];

        tmp = ["C",x,y];
        for(var i = 1; i <= 6; i++) {
          if(i%2==0) tmp.push(+curr[i] + +y);
          else tmp.push(+curr[i] + +x);
        }
        ds = len_cubic(p0,p1,p2,p3);
        tmp.push(ds);
        x= p3[0];
        y= p3[1];
        break;
      case "S":
        var p0 = [x,y];
        var p1,p2,p3;
        //If the previous command wasnt cubic then p0 = p1
        if(prev[0] != "C") {
          p1 = [x,y];
          p2 = [curr[1],curr[2]];
          p3 = [curr[3],curr[4]];
          x = p3[0];
          y = p3[1];
        } else {
          var cx = 2*x - +prev[3][0];
          var cy = 2*y - +prev[3][1];
          p1 = [cx,cy];
          p2 = [curr[1],curr[2]];
          p3 = [curr[3],curr[4]];
          x = p3[0];
          y = p3[1];
        }
        tmp = ["C",+p0[0],+p0[1],+p1[0],+p1[1],+p2[0],+p2[1],+p3[0],+p3[1]];
        ds = len_cubic(p0,p1,p2,p3);
        tmp.push(ds);
        prev = ["C",p0,p1,p2,p3];
        break;
      case "s":
        var p0 = [x,y];
        var p1,p2,p3;
        //If the previous command wasnt cubic then p0 = p1
        if(prev[0] != "C") {
          p1 = [x,y];
          p2 = [+x + +curr[1],+y + +curr[2]];
          p3 = [+x + +curr[3],+y + +curr[4]];
          x = p3[0];
          y = p3[1];
        } else {
          var cx = 2*x - +prev[3][0];
          var cy = 2*y - +prev[3][1];
          p1 = [cx,cy];
          p2 = [+x + +curr[1],+y + +curr[2]];
          p3 = [+x + +curr[3],+y + +curr[4]];
          x = p3[0];
          y = p3[1];
        }
        tmp = ["C",+p0[0],+p0[1],+p1[0],+p1[1],+p2[0],+p2[1],+p3[0],+p3[1]];
        ds = len_cubic(p0,p1,p2,p3);
        tmp.push(ds);
        prev = ["C",p0,p1,p2,p3];
        break;
      case "Q":
        var p0 = [x,y];
        var p1 = [curr[1],curr[2]];
        var p2 = [curr[3],curr[4]];

        tmp = ["Q",x,y,+p1[0],+p1[1],+p2[0],+p2[1]];
        ds = len_quad(p0,p1,p2);
        tmp.push(ds);
        x = p2[0];
        y = p2[1];
        break;
      case "q":
        var p0 = [x,y];
        var p1 = [+x + +curr[1],+y + +curr[2]];
        var p2 = [+x + +curr[3],+y + +curr[4]];

        tmp = ["Q",x,y,+p1[0],+p1[1],+p2[0],+p2[1]];
        ds = len_quad(p0,p1,p2);
        tmp.push(ds);
        x = p2[0];
        y = p2[1];
        break;
      case "T":
        var p0 = [x,y];
        var p1,p2 = [];
        //If the previous command wasnt quadratic then p0 = p1
        if(prev[0].toLowerCase() != "q" && prev[0].toLowerCase != "t") {
          p1 = [x,y];
          p2 = [curr[1],curr[2]];
        } else {
          var cx = 2*x - +prev[1];
          var cy = 2*y - +prev[2];
          p1 = [cx,cy];
          p2 = [curr[1],curr[2]];
        }
        tmp = ["Q",+p0[0],+p0[1],+p1[0],+p1[1],+p2[0],+p2[1]];
        ds = len_quad(p0,p1,p2);
        tmp.push(ds);
        x = p2[0];
        y = p2[1];
        break;
      case "t":
        var p0 = [x,y];
        var p1,p2 = [];
        //If the previous command wasnt quadratic then p0 = p1
        if(prev[0].toLowerCase() != "q" && prev[0].toLowerCase != "t") {
          p1 = [x,y];
          p2 = [+x + +curr[1],+y + +curr[2]];
        } else {
          var cx = 2*x - +prev[1];
          var cy = 2*y - +prev[2];
          p1 = [cx,cy];
          p2 = [+x + +curr[1],+x + +curr[2]];
        }
        tmp = ["Q",+p0[0],+p0[1],+p1[0],+p1[1],+p2[0],+p2[1]];
        ds = len_quad(p0,p1,p2);
        tmp.push(ds);
        x = p2[0];
        y = p2[1];
        break;
      case "Z":
        tmp = ["L",+x,+y,x0,y0];
        ds = len_line(+x,+y,x0,y0);
        tmp.push(ds);
        done = true;
        break;
      case "z":
        tmp = ["L",+x,+y,x0,y0];
        ds = len_line(x,y,x0,y0);
        tmp.push(ds);
        done = true;
        break;
      default:
        break;
    }
    if(typeof tmp !== "undefined") out.push(tmp);
    len = +len + +ds;
  }
  return [len,out];
}
