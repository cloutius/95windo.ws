$(function() {
  var doubleClicked = false;
  $(document).on("contextmenu", function (e) {
   if(doubleClicked == false) {
    e.preventDefault(); // To prevent the default context menu.
    var windowHeight = $(window).height()/2;
    var windowWidth = $(window).width()/2;
    //When user click on bottom-left part of window
    if(e.clientY > windowHeight && e.clientX <= windowWidth) {
      $("#contextMenuContainer").css("left", e.clientX);
      $("#contextMenuContainer").css("bottom", $(window).height()-e.clientY);
      $("#contextMenuContainer").css("right", "auto");
      $("#contextMenuContainer").css("top", "auto");
    } else if(e.clientY > windowHeight && e.clientX > windowWidth) {
      //When user click on bottom-right part of window
      $("#contextMenuContainer").css("right", $(window).width()-e.clientX);
      $("#contextMenuContainer").css("bottom", $(window).height()-e.clientY);
      $("#contextMenuContainer").css("left", "auto");
      $("#contextMenuContainer").css("top", "auto");
    } else if(e.clientY <= windowHeight && e.clientX <= windowWidth) {
      //When user click on top-left part of window
      $("#contextMenuContainer").css("left", e.clientX);
      $("#contextMenuContainer").css("top", e.clientY);
      $("#contextMenuContainer").css("right", "auto");
      $("#contextMenuContainer").css("bottom", "auto");
    } else {
       //When user click on top-right part of window
      $("#contextMenuContainer").css("right", $(window).width()-e.clientX);
      $("#contextMenuContainer").css("top", e.clientY);
      $("#contextMenuContainer").css("left", "auto");
      $("#contextMenuContainer").css("bottom", "auto");
    }
    $("#contextMenuContainer").fadeIn(0, FocusContextOut());
      doubleClicked = false;
    } else {
      e.preventDefault();
      doubleClicked = true;
      $("#contextMenuContainer").fadeOut(0);
    }
  });
    function FocusContextOut() {
    $(document).on("click", function (e) {
    if(!(e.target.closest('#contextMenuContainer'))){
      doubleClicked = false; 
      $("#contextMenuContainer").fadeOut(0);
      $(document).off("click");    
      }
    });
  }
});