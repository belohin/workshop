  var kcan, kc, bcan, bc;
  var hl = 50*Math.sqrt(3);
  var rad = 2 * hl / 3;
  var rad2 = rad * rad;
  var mouseX;
  var mouseY;
  var dragInX;
  var dragInY;
  var rotangle = 0;
  var rotunit = Math.PI/180;
  var timer;
  var tg;
  var tgc;
  var t = {ax:0, ay:0, bx:100, by:0, cx:50, cy:hl, centerX:50, centerY:hl/3};
  var drag = false;
  var coords = new Array(0,0,150,hl,300,0,450,hl,0,2*hl,300,2*hl,150,3*hl,450,3*hl,0,4*hl,300,4*hl,150,5*hl,450,5*hl,0,6*hl,300,6*hl,150,7*hl,450,7*hl,-150,hl,-150,3*hl,-150,5*hl,-150,7*hl);
  timage = new Image();
  bimage = new Image();
  timage.onload = init;
  timage.src = 'img/autumn-leaves.jpg';
  function init(){
    kcan = document.getElementById('kalei_canvas');
    kc = kcan.getContext('2d');
    kc.setTransform(1,0,0,1,0,0);
    bcan = document.getElementById('bcan');
    bc = bcan.getContext('2d');
    bc.setTransform(1,0,0,1,0,0);
    can = document.getElementById('canv');
    can.width = this.width;
    can.height = this.height;
    c = can.getContext('2d');
    can.addEventListener("mousedown", mdown, false); // eseménykezelő a vonszolás indításához
    document.getElementById("ldimg").addEventListener("change", loadFromFile, false); // helyi képbetöltés kezelője
    rotangle = 0;  // háromszög-keret kiindulási értékei
    t.ax = 0;
    t.ay = 0;
    t.bx = 100;
    t.by = 0;
    t.cx = 50;
    t.cy = hl;
    t.centerX = 50;
    t.centerY = hl/3;
    draw();
  }
  function draw(){
    c.clearRect(0, 0, can.width, can.height);
    c.save();
    c.save();
    c.globalAlpha = 0.4; // alapkép halványítása
    c.drawImage(timage,0,0);
    c.restore();
    c.translate(t.centerX, t.centerY);
    c.rotate(rotangle);                // háromszög elforgatottsága
    c.translate(-t.centerX, -t.centerY);
    c.beginPath();
    c.moveTo(t.ax, t.ay); // háromszög oldalai
    c.lineTo(t.bx, t.by);
    c.lineTo(t.cx, t.cy);
    c.lineTo(t.ax, t.ay);
    c.closePath();
    c.stroke();
    c.clip();  // kivágás maszk
    c.translate(t.centerX, t.centerY);
    c.rotate(-rotangle);  // a kép nincs forgatva
    c.translate(-t.centerX, -t.centerY);
    c.drawImage(timage,0,0);
    c.restore();
    copy();  // a kép kijelölt részlete a bélyegző-canvasra
    for(var i = 0, tot = coords.length; i < tot; i = i + 2){
      kc.save();
      kc.translate(coords[i], coords[i + 1]); // mozgatás a tárolt alappontokhoz
      tile(); // a lefedési egység kirajzolása
      kc.restore();
    }
  }
  function tile(){
    kc.save();
    kc.drawImage(bcan, 0, 0);
    kc.rotate(angle(240));
    kc.translate(-151, hl);
    kc.drawImage(bcan, 0, 0);
    kc.restore();
    kc.save();
    kc.scale(-1, 1);
    kc.rotate(angle(-60));
    kc.translate(-150, -hl);
    kc.drawImage(bcan, 0, 0);
    kc.restore();
    kc.save();
    kc.scale(1, -1);
    kc.drawImage(bcan, 0, 0);
    kc.rotate(angle(-120));
    kc.translate(-150, hl);
    kc.drawImage(bcan, 0, 0);
    kc.restore();
    kc.save();
    kc.rotate(angle(120));
    kc.translate(-150, -hl);
    kc.drawImage(bcan, 0, 0);
    kc.restore();
  }
  function angle(deg){
    return deg * Math.PI / 180;
  }
  function loadFromFile(evt){
    var files = evt.target.files;
    f = files[0];
      if (f.type.match('image.*')) {
      var reader = new FileReader();
      reader.onload = (function(lf) {
        return function(e) {
          timage.src = e.target.result;
          init();
        };
      })(f);
      reader.readAsDataURL(f);
      }
  }
  function mdown(ev){
    var bRect = can.getBoundingClientRect();
    mouseX = (ev.clientX - bRect.left)*(can.width/bRect.width);
    mouseY = (ev.clientY - bRect.top)*(can.height/bRect.height);
    var dx = mouseX - t.centerX;
    var dy = mouseY - t.centerY;
    if(dx * dx + dy * dy < rad2){
      drag = true;
      window.addEventListener("mousemove", mmove, false);
      dragInX = dx;
      dragInY = dy;
    }
    window.addEventListener("mouseup", mup, false);
    can.removeEventListener("mousedown", mdown, false);
    if (evt.preventDefault) {
      evt.preventDefault();
    }
    else if (evt.returnValue) {
      evt.returnValue = false;
    }
    return false;
  }
  function mmove(ev){
    var deltaX;
    var deltaY;
    var posX;
    var posY;
    var bRect = can.getBoundingClientRect();
    mouseX = (ev.clientX - bRect.left)*(can.width/bRect.width);
    mouseY = (ev.clientY - bRect.top)*(can.height/bRect.height);
    posX = mouseX - dragInX;
    posY = mouseY - dragInY;
    deltaX = posX - t.centerX;
    deltaY = posY - t.centerY;
    t.ax += deltaX;
    t.bx += deltaX;
    t.cx += deltaX;
    t.centerX += deltaX;
    t.ay += deltaY;
    t.by += deltaY;
    t.cy += deltaY;
    t.centerY += deltaY;
    draw();
  }
  function mup(evt){
    can.addEventListener("mousedown", mdown, false);
    window.removeEventListener("mouseup", mup, false);
    if(drag){
      drag = false;
      window.removeEventListener("mousemove", mmove, false);
    }
  }
  function roright(){
    timer = setInterval(timerplus, 1000/30);
  }
  function roleft(){
    timer = setInterval(timerminus, 1000/30);
  }
  function rostop(){
    clearInterval(timer);
  }
  function timerplus(){
    rotangle += rotunit;
    draw();
  }
  function timerminus(){
    rotangle -= rotunit;
    draw();
  }
  function copy(){
    bc.clearRect(0, 0, bcan.width, bcan.height);
    bc.save();
    bc.beginPath();
    bc.moveTo(0, 0);
    bc.lineTo(100, 0);
    bc.lineTo(50, hl);
    bc.lineTo(0, 0);
    bc.closePath();
    bc.stroke();
    bc.clip();
    bc.translate(50, hl/3);
    bc.rotate(-rotangle);
    bc.translate(-50, -hl/3);
    bc.drawImage(timage, -(t.centerX - 50), -(t.centerY - hl/3));
    bc.restore();
  }
  function tohun(){
    document.getElementById('tx1').innerHTML = 'Helyi kép betöltése';
    document.getElementById('tx2').innerHTML = 'A háromszög-keret egérrel húzható';
    document.getElementById('tx3').innerHTML = 'Keret forgatása';
  }
  function toen(){
    document.getElementById('tx1').innerHTML = 'Load local image';
    document.getElementById('tx2').innerHTML = 'Triangle-frame is draggable';
    document.getElementById('tx3').innerHTML = 'Rotate triangle';
  }
