var MTD = MTD || {};
    MTD.searchCollections = {};

(function (mtd) {

  // shortened namespaced 
  var searchCollections = mtd.searchCollections;

  // shared component variables
  var $searchInput = $('#txt-search'),
      $searchCollections = $('.search-collections'),
      $searchTermDisplay = $searchCollections.find('.search-term'),
      $resultCatEntryTypeField = $('#resultCatEntryType'),
      $searchForm = $('#site-search-form'),
      $btnClear = $('#btn-clear'), 
      searchTermParam = 'searchTerm',
      showClass = 'show',
      hideClass = 'hide';
  
  $searchForm.on('submit',function(e){
	  e.preventDefault();
			if (document.getElementById("txt-search").value){
				var searchTerm = document.getElementById("txt-search").value;
				var cleanedTerm = searchTerm.replace(/['*!]/g, " ");
				document.getElementById("txt-search").value = cleanedTerm;
				document.getElementById("site-search-form").submit();
			} else { 
				alert("Please enter a search term");
				return
			}					
	  setTimeout(function() {
		  document.getElementById('site-search-form').submit();
	  }, 300);
  });

  searchCollections.loader = {
    init: function() {
      searchCollections.search.init();
    }
  },
  searchCollections.search = {
    init: function() {
	  $searchCollections.addClass(hideClass);
      $btnClear.addClass(hideClass);
      this.keyup();
      this.collectionClick();
      this.clearClick();
    },
    keyup: function() {
      $searchInput.on('keyup', function(e) {
        if ($searchInput.val().length > 2) {
          $searchTermDisplay.text($searchInput.val());
          $searchCollections.removeClass(hideClass);
          $btnClear.removeClass(hideClass);
          $searchCollections.addClass(showClass);
          $btnClear.addClass(showClass);
        } else {
          $searchCollections.removeClass(showClass);
          $btnClear.removeClass(showClass);
          $searchCollections.addClass(hideClass);
          $btnClear.addClass(hideClass);
        }
      });
    },
    collectionClick: function() {
      $searchCollections.on('click', 'a', function(e) {
        e.preventDefault();
        /*var url = new URI($(this).attr('href'));
        url.setQuery(searchTermParam, $searchInput.val());
        window.location = url;*/
        $resultCatEntryTypeField.val($(this).attr('resultCatEntryType'));
        $searchForm.submit();
        
      });
    },
    clearClick: function() {
      $btnClear.on('click', function() {
        $searchInput.val('').focus();
        $searchCollections.removeClass(showClass);
        $btnClear.removeClass(showClass);
        $searchCollections.addClass(hideClass);
        $btnClear.addClass(hideClass);
      });      
    }
  }

} (MTD));

$(function() {
  MTD.searchCollections.loader.init();
});