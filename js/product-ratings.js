var CUBCADET = CUBCADET || {};
    CUBCADET.productRatings = {};

(function (cubcadet) {
  
  var productRatings = cubcadet.productRatings;

  var $main = $('#main, .r-gm'),
      iconicClass = '.iconic';

  productRatings.loader = {
    init: function() {
      productRatings.stars.init();
    }
  },
  productRatings.stars = {
    init: function() {
      this.overlay();
    },
    render: function() {
      if (Modernizr.svg) {
        var iconic = IconicJS();
        iconic.inject(iconicClass);
      }
      this.overlay();
    },
    overlay: function() {
      if (! Modernizr.svg) { // fallback for browsers that don't support SVG
        var $iconic = $main.find(iconicClass);
        $iconic.each(function() {
          $(this).attr('src', $(this).data('fallback'));
        });    
      }
      $('.overlay', $main).each(function(i) {
        var $stars = $(this).parent(),
            rating = $(this).data('rating'),
            starWidth = $stars.find('.base').children().width(),
            starWidthWithMargin = parseInt($(this).data('size'), 10),
            starMargin = starWidthWithMargin - starWidth,
            ratingFirst = parseInt(rating.substring(0, rating.indexOf('_')), 10),
            ratingSecond = parseInt(rating.substring(rating.indexOf('_') + 1, rating.length), 10),
            overlayWidth = (ratingFirst * starWidthWithMargin) + ((ratingSecond / 10) * starWidth);

        $(this).css('width', overlayWidth + 'px');
      });      
    }
  }

} (CUBCADET));

$(function() {

  CUBCADET.productRatings.loader.init();

});