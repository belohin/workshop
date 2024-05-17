
function sizing(o) {
  var s = o.src;
  var bp = new Image();
  bp.style.display = 'none';
  var dr = $('#drops').css({
    display: 'block',
    position: 'absolute',
    background: 'white',
    top: ($(window).height() - 96) / 2 + (document.all ? truebody().scrollTop : window.pageYOffset) + 'px',
    left: ($(window).width() - 80) / 2 + 'px'
  });
  s = s.replace('_', '');
  $(bp).load(function() {
               var wtop = (document.all ? truebody().scrollTop : window.pageYOffset);
               var itop = this.height < $(window).height() ? ($(window).height() - this.height) / 2 : 0;
               var ileft = this.width < $(window).width() ? ($(window).width() - this.width) / 2: 0;
               $('#drops').css('display', 'none');
               $(this).css({
                 top: itop + wtop + 'px',
                 left: ileft + 'px',
                 display: 'block'
               });
             });
  $(bp).attr('src', s).css({position: 'absolute', cursor: 'pointer'}).click(function(){document.body.removeChild(this)});
  document.body.appendChild(bp);
}
function truebody(){
return (document.compatMode && document.compatMode!="BackCompat")? document.documentElement : document.body
}
