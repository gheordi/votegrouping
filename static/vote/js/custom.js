function initializeComments(){
$(".carousel-caption").prepend("<img class='maxmywindow' src='images/maximize_window.png' />");
$(".carousel-caption").prepend("<img class='closemywindow' src='images/close_window.png' />");

   $(".maxmywindow").click(function (e) {
  $(this).parent().height('auto');
  $('.carousel-caption p').show();
});
   $(".closemywindow").click(function (e) {
    $(this).parent().height(20);
    
  $('.carousel-caption p').hide();
});

}