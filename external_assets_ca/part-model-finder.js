var MTD = MTD || {};
    MTD.partModelFinder = {};

(function (mtd) {

  // shortened namespaced 
  var partModelFinder = mtd.partModelFinder;

  // shared component variables below
  var $pmmContainer = $('.pmm-finder-auto'),
      $autocompleteTemplate = $('#pmm-autocomplete-list'),
      searchInputClass = 'autocomplete-field',
      formActiveClass = 'search-active',
      closeBtnClass = 'close-autocomplete';

  // set underscore.js template settings so they don't conflict with JSP syntax
  _.templateSettings = {
    interpolate: /\<\@\=(.+?)\@\>/gim,
    evaluate: /\<\@(.+?)\@\>/gim
  };

  var delaySearch = (function() {
    var timer = 0;
    return function(callback, ms) {
      clearTimeout(timer);
      timer = setTimeout(callback, ms);
    };
  })(); 

  partModelFinder.autocomplete = {
    init : function() {
      this.keyup();
      this.clickClose();
    },
    keyup : function() {
      $pmmContainer.on('keyup', '.' + searchInputClass, function(e) {
        var $input = $(this),
            characterLength = $(this).val().length;

        if (characterLength > 2) {
          delaySearch(function() {
            partModelFinder.autocomplete.getJSON($input);
          }, 200);
        }
      });
    },
    clickClose : function() {
      $pmmContainer.on('click', '.' + closeBtnClass, function(e) {
        e.preventDefault();
        var $searchForm = $(e.target).closest('form');
        $searchForm.removeClass(formActiveClass);
        $searchForm.find('.' + searchInputClass).val('').blur();
      });
    },
    getJSON : function ($searchInput) {
      var $searchForm = $searchInput.closest('form'),
          $autocompleteDropdown = $searchForm.find('.autocomplete'),
          $autocompleteList = $searchForm.find('ul'),
          searchUrl = $searchForm.data('autocomplete-feed'),
          listTemplate = _.template($autocompleteTemplate.html());

          this.clearErrors($searchForm);
          $.getJSON(searchUrl, $searchForm.serialize())
              .done(function(data) { 
                $searchForm.removeClass(formActiveClass); 
                var itemsData = { 'items': data.slice(0,5) };
                $autocompleteList.html(listTemplate(itemsData));
                $searchForm.addClass(formActiveClass); 
              }); 
    },
    clearErrors : function($parentElement) {
      $parentElement.find('.field-valid').removeClass('error');
      $parentElement.find('input').removeClass('invalid');
    }
  }
  
} (MTD));

$(function() {

  MTD.partModelFinder.autocomplete.init();

});