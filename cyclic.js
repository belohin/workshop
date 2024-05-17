    var can;
    var ctx;
    var ida;
    var idd;
    var cols = [
255,255,255,
153,204,255,
153,255,204,
255,255,153,
255,153,255,
204,204,204,
204,153,255,
102,204,255,
153,255,153,
255,255,102,
255,153,51,
255,153,204,
153,153,153,
51,153,255,
51,204,204,
0,255,0,
204,204,0,
204,153,0,
255,102,0,
255,102,255,
153,102,255,
51,102,255,
0,153,204,
0,153,153,
51,153,51,
102,102,51,
153,102,51,
204,51,0,
204,0,102,
204,0,255,
153,51,255,
51,51,255,
51,102,153,
51,102,0,
153,51,0,
153,0,255,
102,102,102,
0,0,255,
0,102,0,
153,0,0,
0,0,0];
    var lim = 600;
    var mts = new Array();
    mts[0] = new Array();
    mts[1] = new Array();
    createArray(mts[0], lim);
    createArray(mts[1], lim);
    var old = 0;
    var nw = 1;
    var timeflag = false;
    var al = 255; // alpha érték; átlátszatlan
    var dl = 4;
    var ci = 3;
    var maxcol = 30;
    function init() {
      can = document.getElementById("canv");
      c = can.getContext("2d");
      ida = c.createImageData(lim, lim);
      idd = ida.data;
      for (var i = 0; i < lim; i++){
        for (var j = 0; j < lim; j++){
          var rv = Math.floor(Math.random() * (maxcol + 1));
          var mati = (i * lim + j) * dl; // matrix index
          mts[old][i][j] = rv;  // színkód
          var coli = rv * ci; // color index
          idd[mati] = cols[coli];
          idd[mati + 1] = cols[coli + 1];
          idd[mati + 2] = cols[coli + 2];
          idd[mati + 3] = al;
        }
      }
      requestAnimationFrame(animate);
    }
    function animate() {
          for (var i = 0; i < lim; i++){ // 300-as ciklus
            var ip = (lim - i > 1) ? i + 1 : 0; // i+1-es szomszéd, utolsó sorban 0
            var im = (i == 0) ? lim - 1 : i - 1; // i-1-es szomszéd, első sorban lim-1
            for (var j = 0; j < lim; j++){ // 300-as ciklus merőlegesen
              var jp = (lim - j > 1) ? j + 1 : 0; // j+1-es szomszéd, oszlop végén 0
              var jm = (j == 0) ? lim - 1 : j - 1; // j-1-es szomszéd, oszlop elején lim-1
              var oldval = mts[old][i][j];
              var consumer = (oldval < maxcol) ? oldval + 1 : 0;
              if (mts[old][ip][j] == consumer ||
                  mts[old][im][j] == consumer ||
                  mts[old][i][jm] == consumer ||
                  mts[old][i][jp] == consumer ||
                  mts[old][im][jm] == consumer ||
                  mts[old][ip][jp] == consumer ||
                  mts[old][im][jp] == consumer ||
                  mts[old][ip][jm] == consumer){
                    mts[nw][i][j] = consumer;
                  }
              else{
                mts[nw][i][j] = oldval;
              }
              var mati = (i * lim + j) * dl; // matrix index
              var coli = mts[nw][i][j] * ci; // color index
              idd[mati] = cols[coli];
              idd[mati + 1] = cols[coli + 1];
              idd[mati + 2] = cols[coli + 2];
              idd[mati + 3] = al;
            }
          }
          var tmp = old; // a két mátrix indexének cseréje
          old = nw;
          nw = tmp;
      draw();
      requestAnimationFrame(animate);
    }
    function draw() {
        c.putImageData(ida, 0, 0);
    }
    function createArray (target, number){
      for (var iv = 0; iv < number; iv++){
        target[iv] = new Array();
      }
      return;
    }
