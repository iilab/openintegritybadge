jQuery(function($) {
    $('.badge').hover(function() {
      if (!$(this).children('.teaser').hasClass('opened')) { 
        $(this).children('.drawer').addClass('active').show().css({
            left: -($(this).width())
        }).animate({
            left: 0
        }, 200);
      }
    },
    function() {
      if (!$(this).children('.teaser').hasClass('opened')) { 
        $(this).children('.drawer').removeClass('active').animate({
            left: -$(this).width()
        }, 200);
        }
    });
    
    $('.badge').click(function() {
      if(!$(this).siblings('.teaser').hasClass('opened')) {
        $(this).siblings('.teaser').addClass('opened').show().css({
            "opacity":0}).css({"z-index":1}).animate({
            opacity: 1
        }, 200);
      }
      else {
        $(this).siblings('.teaser').removeClass('opened').show().css({
            "opacity": 1}).css({"z-index": -1}).animate({
            opacity: 0
        }, 200);      
      }
    });
    
});