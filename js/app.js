// Foundation init
jQuery(document).foundation();

'use strict';

var app = (function(document, $) {
	var docElem = document.documentElement,
		_userAgentInit = function() {
			docElem.setAttribute('data-useragent', navigator.userAgent);
		},
		_init = function() {
			$(document).foundation();
            // needed to use joyride
            // doc: http://foundation.zurb.com/docs/components/joyride.html
            $(document).on('click', '#start-jr', function () {
                $(document).foundation('joyride', 'start');
            });
			_userAgentInit();
		};
	return {
		init: _init
	};

})(document, jQuery);


(function($) {
    //app.init();

    $('.tb-round-button').on('click', function(event) {
        event.preventDefault();
        var aux = $(this).data('target');
        if ($(this).parents('.show-for-small-only')[0]){
            $('html, body').animate({
                scrollTop: $('.tb-calculator-container:first').offset().top
            }, 500);
        }
        $('.tb-round-button').removeClass('tb-active tb-round-hiden-mobile black');
        $('[data-target='+aux+']').addClass('tb-active').each(function(){
            if ($(this).parents('.show-for-small-only')[0] ){
                $(this).prevAll().andSelf().addClass('tb-round-hiden-mobile');
                $(this).parents('.show-for-small-only').removeClass('hide-for-small-only');
            }else{
                $(this).nextAll().addClass('tb-round-hiden-mobile');
            }
        });
        $('.tb-calculator-engine').removeClass('hide-for-small-only four-atachments three-atachments two-atachments').addClass(aux);
    });
    $('.tb-view-specs').on('click', function(event) {
        event.preventDefault();
        /* Act on the event */
        $('#'+$(this).data('tb-reveal-id')+'').foundation('reveal','open');
    });

    if($('#tb-gallery-modal')[0]){
      $('body').addClass('tb-gallery');
      var tbmodalTarget = 0;

      $('.tb-main-gallery').on('click','.slick-list',function(e){
        if ( $(window).innerWidth() > 640 ){
          tbmodalTarget = $(e.target).parents('.tb-gallery-item').data('slick-index');
          $('#tb-gallery-modal').foundation('reveal','open');
        }
      });
      $(document).on('opened.fndtn.reveal', '[data-reveal]', function () {

        if (!$('.tb-modal-gallery.slick-initialized')[0]){
          $('.reveal-modal .tb-thumb-vertical-gallery').slick({
            slidesToShow: 6,
            slidesToScroll: 1,
            infinite: true,
            asNavFor: '.reveal-modal .tb-modal-gallery',
            arrows: false,
            dots: false,
            vertical: true,
            focusOnSelect: true
          });
          $('.reveal-modal .tb-modal-gallery').slick({
            slidesToShow: 1,
            slidesToScroll: 1,
            infinite: true,
            asNavFor: '.reveal-modal .tb-thumb-vertical-gallery',
            arrows: false,
            dots: false,
            focusOnSelect: true
          });
        }else{
          $('.reveal-modal .tb-thumb-vertical-gallery').slick('setPosition')
          $('.reveal-modal .tb-modal-gallery').slick('setPosition')
        }

        $('.reveal-modal .tb-thumb-vertical-gallery').slick('slickGoTo',tbmodalTarget);
      });

      $('a.close-reveal-modal').on('click', function() {
        $(document).foundation('reveal', 'close');
      });

      $('.tb-gallery-section .tb-main-gallery').slick({
        slidesToShow: 1,
        slidesToScroll: 1,
        arrows: false,
        dots: false,
        //fade: true,
        asNavFor: '.tb-gallery-section .tb-thumb-gallery',
        responsive: [
          {
            breakpoint: 640,
            settings: {
              dots: true
            }
          }
        ]
      });
      $('.tb-gallery-section .tb-thumb-gallery').slick({
        slidesToShow: 6,
        slidesToScroll: 1,
        asNavFor: '.tb-gallery-section .tb-main-gallery',
        dots: false,
        focusOnSelect: true
      });
    }

    var aux=0;
    $('.tb-products [type=checkbox]').on('change', function(event) {
      event.preventDefault();
      if ($(this).prop('checked')){
        aux++;
      }else{
        aux--;
      }
      if (aux>3){
        $('.tb-products [type=checkbox]').not(':checked').prop('disabled', true);
      }else{
        $('.tb-products [type=checkbox]').not(':checked').prop('disabled', false);
      }
      /* Act on the event */
    });
    $(document).foundation({
      equalizer : {
        equalize_on_stack: true
      }
    });
    var spacerListing = $('.tb-product:nth-of-type(3n), .tb-product:last');
    var spacerListingMobile =$('.tb-product:nth-of-type(2n), .tb-product:last');
    spacerListing.each(function() {
        $(this).after('<div class="tb-products-spacer column medium-12 hide-for-small-only">');
    });
    spacerListingMobile.each(function() {
        $(this).after('<div class="tb-products-spacer column medium-12 show-for-small-only">');
    });
    var spacerAccesories = $('ul.accessories li:nth-of-type(4n):last').nextAll();
    var spacerAccesoriesMobile = !$('ul.accessories li:nth-of-type(2n):last').next()[0]?$('ul.accessories li:nth-of-type(2n):last').prev().addBack():$('ul.accessories li:nth-of-type(2n):last').nextAll();
    spacerAccesories.each(function() {
        $(this).addClass('tb-no-border');
    });
    spacerAccesoriesMobile.each(function() {
        $(this).addClass('tb-no-border-mobile');
    });

    $('.tb-mobile-filters').on('click', function(event) {
      event.preventDefault();
      $('.tb-filters').toggleClass('active');
    });
    $('.view-as .view').on('click', function(event) {
      event.preventDefault();
      if (!$('.tb-products').hasClass($(this).data('view')) ){
        $('.tb-products ,.view-as')
          .removeClass('grid list')
          .addClass( $(this).data('view') );
      }
    });
    $('.tb-video').on('click', function(event) {
      event.preventDefault();
      $('#videoModal').foundation('reveal','open');
    });
    $('.tabs-content .tab-title a').on('click', function(event) {
      event.preventDefault();
      $('.hide-for-small-only .tab-title [href='+ $(this).attr('href') +']').click();
      $('.tabs-content .tab-title.active').removeClass('active')
      $(this).parent().addClass('active');
      $('html, body').animate({
          scrollTop: $(this).parent().offset().top
      }, 200);
    });

    $('.stars').each(function () {
      var max_stars = 5;
      if($(this).find('em').size() > 0) {
        var max_width = $(this).width();
        var star_rating = parseFloat(($(this).find('em').html()).replace(/_/g, "."));
        var star_width = Math.round((star_rating / max_stars) * max_width);
        $(this).find('em').css('width',star_width + 'px');
      }
    });
})(jQuery);

