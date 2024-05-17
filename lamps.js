  var cols = 1;
  var rows = 1;
  var count = 0;
  var lamps = new Array();
  var steps = new Array();
  var sum = 0;
  var st_max = 0;
  var stm = 0;
  var len = 0;
  $(document).ready(function(){
    for (i=1; i<=24; i++) {
      $('#rownum').append(new Option(i, i));
    }
    for (i=1; i<=32; i++) {
      $('#colnum').append(new Option(i, i));
    }
    init();
  });
  function init(){
    $('#counter').val('0');
    $('#std').val('0');
    $('#backb').attr('disabled', 'disabled');
    $('#reb').attr('disabled', 'disabled');
  }
  function setboard() { // játéktér alaphelyzetbe
    $('#board').empty();  // esetleges korábbi tartalom törlése
    $('#lampak_info').css('display', 'none');  // tájékoztató eltüntetése
    cols = $('#colnum').val();  //választott oszlopok
    rows = $('#rownum').val();  // és sorok száma
    for (i = 1; i <= rows; i++) {  // táblacellák létrehozása
      $('#board').append('<tr id="borow' + i + '"></tr>');
      for (j = 1; j <= cols; j++) {
        $('#borow' + i).append('<td id="' + j + ',' + i + '"></td>');
      }
    }
    sum = cols * rows;  // összes lámpa száma
    $('#board td').css({  // a cellák méretezése és sötét háttérkép
      'width': '24px',
      'height': '24px',
      'background-image': 'url("img/dark.gif")'
    }).addClass('dark').click(function(){  // eseménykezelő kattintásra
      if($(this).hasClass('dark')){  // akkor reagál, ha nem ég
        var aid = $(this).attr('id');  // koordináták kinyerése
        var coord = aid.split(',');
        var x = parseInt(coord[0]);
        var y = parseInt(coord[1]);
        push_step(x, y); // lépés tárolása
        lit(x, y);  // tovább a következő fázishoz
      }
    });
    $('#container').css({
      'display': 'block',
      'margin': '0 auto',
    });
  }
  function sw(tcell){ // a cella az ellenkezőjére vált
    if(tcell.hasClass('dark')){
      tcell.css('background-image', 'url("img/light.gif")').removeClass('dark');
      count++;
    }
    else{
      tcell.css('background-image', 'url("img/dark.gif")').addClass('dark');
      count--;
    }
  }
  function lit(x, y){  // koordinátákkal megadott cella átváltása
    sw($('#board tr:nth-child(' + y + ') td:nth-child(' + x + ')'));
    if($('#type').val() == 1){
      turn1(x, y);  // szomszédok átváltása
    }
    else{
      turn2(x, y);  // az érvényes típus szerint
    }
  }
  function turn1(x, y){ // szomszédok átváltása egyszerű típusnál
    if(x > 1){
      sw($('#board tr:nth-child(' + y + ') td:nth-child(' + (x - 1) + ')'));
    }
    if(x < cols){
      sw($('#board tr:nth-child(' + y + ') td:nth-child(' + (x + 1) + ')'));
    }
    if(y > 1){
      sw($('#board tr:nth-child(' + (y - 1) + ') td:nth-child(' + x + ')'));
    }
    if(y < rows){
      sw($('#board tr:nth-child(' + (y + 1) + ') td:nth-child(' + x + ')'));
    }
    $('#counter').val(count);
    if(count == sum){
      eog();
    }
  }
  function turn2(x, y) {  // szomszédok átváltása végtelenített típusnál
    if(x > 1){
      sw($('#board tr:nth-child(' + y + ') td:nth-child(' + (x - 1) + ')'));
    }
    else{
      sw($('#board tr:nth-child(' + y + ') td:nth-child(' + cols + ')'));
    }
    if(x < cols){
      sw($('#board tr:nth-child(' + y + ') td:nth-child(' + (x + 1) + ')'));
    }
    else{
      sw($('#board tr:nth-child(' + y + ') td:nth-child(1)'));
    }
    if(y > 1){
      sw($('#board tr:nth-child(' + (y - 1) + ') td:nth-child(' + x + ')'));
    }
    else{
      sw($('#board tr:nth-child(' + rows + ') td:nth-child(' + x + ')'));
    }
    if(y < rows){
      sw($('#board tr:nth-child(' + (y + 1) + ') td:nth-child(' + x + ')'));
    }
    else{
      sw($('#board tr:nth-child(1) td:nth-child(' + x + ')'));
    }
    $('#counter').val(count);
    if(count == sum){
      eog();
    }
  }
  function push_step(x, y) {  // lépés tárolása
    steps[stm] = x;
    steps[stm + 1] = y;
    stm += 2;  // lépéstár-mutató növelése
    len++;  // lépésszámláló növelése
    $('#std').val(len);  // és kijelzése
    st_max = stm > st_max ? stm : st_max; // lépéstár max. hossza
    $('#backb').prop('disabled', false);  // visszalépés lehetséges
  }
  function backstep() {  // visszalépés
    if (stm) {  // ha van tárolt
      var row = steps[stm - 1];
      var column = steps[stm - 2];  // koordináták elővétele
      stm -= 2;  // mutató csökkentése
      if (!stm) {  // elfogyott
        $('#backb').prop('disabled', true);  // további visszalépés deaktiválása
      }
      lit(column, row); // az elővett mező átváltása
      $('#reb').prop('disabled', false);  // újra meglépés lehetséges
      len--;  // lépésszámláló csökkentése
      $('#std').val(len);  // és kijelzése
    }
  }
  function restep() { // újra meglépés
    var x;
    var y;
    if (st_max > stm) {  // akkor lehet, ha a lépéstár-mutató nem áll maximumon
      x = steps[stm];
      y = steps[stm + 1];  // koordináták elővétele
      lit(x, y);  // az elővett mező átváltása
      stm += 2;  // lépéstár-mutató növelése
      len++;  // lépésszámláló növelése
      $('#std').val(len);  // és kijelzése
      $('#backb').prop('disabled', false);  // lehet visszalépni
      if (st_max == stm) {  // ha ez volt az utolsó a lépéstárban
        $('#reb').prop('disabled', true);  // akkor újralépni már nem
      }
    }
  }
  function eog() {
    alert('Gratulálok, sikerült!');
  }
  function newgame() { // új játékkezdés az aktuális játékmezőn
    len = 0;
    st_max = 0;
    stm = 0;
    count = 0;
    $('#board td').css('background-image', 'url("img/dark.gif")').each(function(){
      if(!$(this).hasClass('dark')){
        $(this).addClass('dark');
      }
    });
    $('#std').val(len);
    $('#counter').val(count);
    $('#reb').prop('disabled', true);
    $('#backb').prop('disabled', true);
  }
  function newboard(){  // új játékmező
    $('#lampak_info').css('display', 'block');
    $('#container').css('display', 'none');
    init();
  }
  