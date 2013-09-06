jQuery(function($) {

  $.ajaxSetup({async:false});
  if (!($('head').children('link').attr('href') == "https://openintegrity.org/badge/css/badge.css")) {
    $('head').append('<link type="text/css" rel="stylesheet" href="https://openintegrity.org/badge/css/badge.css" media="all" />');
  }
  $.ajaxSetup({async:true});
  
  $('.entry').appear();

  $('body').on('appear', '.entry', function(e, $affected) {
    badge="<img src='https://openintegrity.org/badge/img/oii-loader.gif' style='margin:5px;padding:0px;' height='24' width='24'>";
    var entry=$(this);
    if (!entry.hasClass('processed')) {
      entry.html(badge);
      entry.addClass('processed');
      nid = entry.attr('id');
      $.getJSON("https://openintegrity.org/api/badge?nid="+nid, function(data) {
        entry.html(data[0]['Badge'][0]);
      })    
    }
  })     

  $('body').on('mouseenter', '.badge', function() {
    if (!$(this).hasClass('opened')) { 
      $(this).children('.drawer').addClass('active').show().css({left: -($(this).width())}).css({opacity:0});
      $(this).children('.drawer').animate({left: 0},{duration: 200, queue: false});
      $(this).children('.drawer').animate({opacity:1}, {duration:400, queue: false});
    }
  });
  
  $('body').on('mouseleave', '.badge', function() {
    if (!$(this).hasClass('opened')) { 
      $(this).children('.drawer').removeClass('active').animate({left: -$(this).width()},{duration: 200, queue: false}).animate({opacity:0}, {duration:200,queue:false});
    }
  });
   
  $('body').on('click', '.badge', function() {
    var teaser=$(this).parent('.entry').children('.teaser');
    var nid_click = $(this).parent('.entry').attr('id');
    if(!teaser.hasClass('opened')) {
      $('.openintegrity .teaser').removeClass('opened');
      teaser.addClass('opened');
      teaser.html("<div class='feature-bg'><img src='https://openintegrity.org/badge/img/oii-loader-bg.gif' style='margin:5px;padding:0px;' height='32' width='32'/></div>");
      ret=$.get("https://openintegrity.org/node/"+nid_click+"/overlay", function(data) {
        if (!($('.openintegrity').children('link').attr('href') == "https://openintegrity.org/badge/css/teaser.css")) {
          $('.openintegrity').append('<link rel="stylesheet" type="text/css" href="https://openintegrity.org/badge/css/teaser.css">'); 
        }
        teaser.html("");
        teaser.html(teaser.html() + data);
        teaser.parent('.entry').children('.badge').addClass('opened');
        teaser.addClass('opened').show().children('.feature-container');
        teaser.find("#viewport").carousel("#" + nid_click + " #simplePrevious", "#" + nid_click + " #simpleNext");
      });
    }
    else {
      teaser.parents('.entry').children('.badge').removeClass('opened');
      teaser.children('.drawer').removeClass('active').animate({left: -$(this).width()},{duration: 200, queue: false}).animate({opacity:0}, {duration:200,queue:false});
      teaser.removeClass('opened');      
    }
  });
  
  $('body').on('click', '.feature-bg', function() {
    $(this).parents('.entry').find('.badge').removeClass('opened');
    $(this).parents('.entry').find('.drawer').removeClass('active').animate({left: -$(this).width()},{duration: 200, queue: false}).animate({opacity:0}, {duration:200,queue:false});
    $(this).parent('.teaser').removeClass('opened');
  });
  
  $.force_appear();
  
});

/*
 * jQuery appear plugin
 *
 * Copyright (c) 2012 Andrey Sidorov
 * licensed under MIT license.
 *
 * https://github.com/morr/jquery.appear/
 *
 * Version: 0.3.3
 */
(function($) {
  var selectors = [];

  var check_binded = false;
  var check_lock = false;
  var defaults = {
    interval: 250,
    force_process: false
  }
  var $window = $(window);

  var $prior_appeared;

  function process() {
    check_lock = false;
    for (var index = 0; index < selectors.length; index++) {
      var $appeared = $(selectors[index]).filter(function() {
        return $(this).is(':appeared');
      });

      $appeared.trigger('appear', [$appeared]);

      if ($prior_appeared) {
        var $disappeared = $prior_appeared.not($appeared);
        $disappeared.trigger('disappear', [$disappeared]);
      }
      $prior_appeared = $appeared;
    }
  }

  // "appeared" custom filter
  $.expr[':']['appeared'] = function(element) {
    var $element = $(element);
    if (!$element.is(':visible')) {
      return false;
    }

    var window_left = $window.scrollLeft();
    var window_top = $window.scrollTop();
    var offset = $element.offset();
    var left = offset.left;
    var top = offset.top;

    if (top + $element.height() >= window_top &&
        top - ($element.data('appear-top-offset') || 0) <= window_top + $window.height() &&
        left + $element.width() >= window_left &&
        left - ($element.data('appear-left-offset') || 0) <= window_left + $window.width()) {
      return true;
    } else {
      return false;
    }
  }

  $.fn.extend({
    // watching for element's appearance in browser viewport
    appear: function(options) {
      var opts = $.extend({}, defaults, options || {});
      var selector = this.selector || this;
      if (!check_binded) {
        var on_check = function() {
          if (check_lock) {
            return;
          }
          check_lock = true;

          setTimeout(process, opts.interval);
        };

        $(window).scroll(on_check).resize(on_check);
        check_binded = true;
      }

      if (opts.force_process) {
        setTimeout(process, opts.interval);
      }
      selectors.push(selector);
      return $(selector);
    }
  });

  $.extend({
    // force elements's appearance check
    force_appear: function() {
      if (check_binded) {
        process();
        return true;
      };
      return false;
    }
  });
})(jQuery);

/**
 * @author Stéphane Roucheray 
 * @extends jquery
 */


jQuery.fn.carousel = function(previous, next, options){
        var sliderList = jQuery(this).children()[0];
        
        if (sliderList) {
                var increment = jQuery(sliderList).children().outerWidth(true),
                elmnts = jQuery(sliderList).children(),
                numElmts = elmnts.length,
                sizeFirstElmnt = increment,
                shownInViewport = Math.round(jQuery(this).width() / sizeFirstElmnt),
                firstElementOnViewPort = 1,
                isAnimating = false;
                
                if (elmnts.length > 1) {
                  for (i = 0; i < shownInViewport; i++) {
                          jQuery(sliderList).css('width',(numElmts+shownInViewport)*increment + increment + "px");
                          jQuery(sliderList).append(jQuery(elmnts[i]).clone());
                  }
                }
                jQuery(previous).click(function(event){
                        if (!isAnimating) {
                                if (firstElementOnViewPort == 1) {
                                        jQuery(sliderList).css('left', "-" + numElmts * sizeFirstElmnt + "px");
                                        firstElementOnViewPort = numElmts;
                                }
                                else {
                                        firstElementOnViewPort--;
                                }
                                
                                jQuery(sliderList).animate({
                                        left: "+=" + increment,
                                        y: 0,
                                        queue: true
                                }, "swing", function(){isAnimating = false;});
                                isAnimating = true;
                        }
                        
                });
                
                jQuery(next).click(function(event){
                        if (!isAnimating) {
                                if (firstElementOnViewPort > numElmts) {
                                        firstElementOnViewPort = 2;
                                        jQuery(sliderList).css('left', "0px");
                                }
                                else {
                                        firstElementOnViewPort++;
                                }
                                jQuery(sliderList).animate({
                                        left: "-=" + increment,
                                        y: 0,
                                        queue: true
                                }, "swing", function(){isAnimating = false;});
                                isAnimating = true;
                        }
                });
        }
};