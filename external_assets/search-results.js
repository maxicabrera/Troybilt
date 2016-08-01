var MTD = MTD || {};
    MTD.searchResults = {};

(function (mtd) {
  // shortened namespaced Product Results variable for use with code below
  var searchResults = mtd.searchResults;

  // shared component variables
  var $searchResultsContainer = $('.search-results'),
      customCheckBoxClass = '.custom.checkbox',
      facetCheckboxClass = '.facet-checkbox',
      loadingClass = 'loading',
      hideClass = 'hide',
      pageCurrentClass = 'current',
      // for Ruby I have to use liine below for facetParam
      //facetParam = 'facet[]',
      // for MTD environment use below and remove or comment out facetParam above
      facetParam = 'facet',
      pageNumParam = 'page',
      sortByParam = 'sortBy',
      pageSizeParam = 'pageSize',
      pageSize = 12;


  searchResults.loader = {
    init: function() {
      searchResults.facets.init();
      searchResults.sort.init();
      searchResults.tabs.init();
      if (Modernizr.history) {
        searchResults.paging.init();
        searchResults.results.init();
        searchResults.state.init();  
      }
    }
  },
  searchResults.results = {
    init: function() {
      //this.openNewTab();
    },
    openNewTab: function() {
      var $resultLinks = $searchResultsContainer.find('.results a');
      $resultLinks.attr('target', '_blank');
    }
  },
  searchResults.tabs = {
    init: function() {
      this.tabClick();
    },
    tabClick: function() {
      $searchResultsContainer.on('click', '.tabs a', function(e) {
        e.preventDefault();
        // get URL from tab link
        var url = new URI($(this).attr('href'));
        url.removeQuery('ajax','true');
        url.addQuery('ajax','true');
        // get updated HTML
        if (Modernizr.history) {
          searchResults.data.getHTML(url);
        }else {
          window.location = url;
        }
      });
    }
  },
  searchResults.facets = {
    init: function() {
      this.facetClick();
    },
    facetClick: function() {
      var $formFacets = $searchResultsContainer.find('.form-facets');

      $formFacets.on('change', facetCheckboxClass, function(e) {
        var $facet = $(this),
            facetValue = $facet.val(),
            url = new URI();

        // reset any paging params
        if (url.hasQuery(pageNumParam)) {
          url.setQuery(pageNumParam, 1);
        }

        if ($facet.prop('checked')) {
          url.addQuery(facetParam, facetValue);
        }else {
          url.removeQuery(facetParam, facetValue);
        }
        url.removeQuery('ajax','true');
        url.addQuery('ajax','true');
        // get updated HTML
        if (Modernizr.history) {
          searchResults.data.getHTML(url);
        }else {
          window.location = url;
        }
      });      
    }
  },
  searchResults.data = {
    addLoadingState: function() {
      $searchResultsContainer.addClass(loadingClass);
    },
    removeLoadingState: function() {
      $searchResultsContainer.removeClass(loadingClass);
    },
    getHTML: function(url) {
      searchResults.data.addLoadingState();
      $.get(url)
        .done(function(data) {
        	data = '<div id="body-mock">' + data + '</div>';
          $searchResultsContainer
            .empty()
            .html($(data).find('#search-results-section').html())
            .foundation('forms', function (response) {
              searchResults.facets.init();
              searchResults.results.init();
            });
          $('#globalPartCount').html('('+readCookie('globalPartCount')+')');
          $('#globalEquipmentCount').html('('+readCookie('globalEquipmentCount')+')');
          $('#globalArticleCount').html('('+readCookie('globalArticleCount')+')');
		  url.removeQuery('ajax','true');
          searchResults.state.pushState(searchResults.state.getCurrent(), url);  
	      var shadowboxLocation = "/wcsstore/TroyBilt/javascript/shadowbox-3.0.3/shadowbox.js";
    	  $.ajax({
    			url: shadowboxLocation,
    			dataType: "script",
    			async: false,
    			cache: true
    	  });
          Shadowbox.init({
	    	language: 'en',
	    	players:  ['iframe']
	      });
          ProductView.init();
        })
        .always(function() { 
          searchResults.data.removeLoadingState();
        });      
    }
  },
  searchResults.paging = {
    init: function() {
      this.pageNumberLinkClick();
    },
    pageNumberLinkClick: function() {
      $searchResultsContainer.on('click', '.paging a', function(e) {
        e.preventDefault();
        // get URL from link
        var url = new URI($(this).attr('href'));
        url.removeQuery('ajax','true');
        url.addQuery('ajax','true');
        // get updated HTML
        searchResults.data.getHTML(url);
        /*$('#globalPartCount').html('('+readCookie('globalPartCount')+')');
		$('#globalEquipmentCount').html('('+readCookie('globalEquipmentCount')+')');
		$('#globalArticleCount').html('('+readCookie('globalArticleCount')+')');*/
      });
    }
  },
  searchResults.sort = {
    init: function() {
      this.perPage();
      this.sortBy();
    },
    perPage: function() {
      $searchResultsContainer.on('change', '.per-page select', function() {
        var url = new URI(),
            perPage = $(this).val();

        // update URL with pageNum
        url.setQuery(pageSizeParam, perPage);
        url.removeQuery('ajax','true');
        url.addQuery('ajax','true');
        // get updated HTML
        if (Modernizr.history) {
          searchResults.data.getHTML(url);
        }else {
          window.location = url;
        }
        /*$('#globalPartCount').html('('+readCookie('globalPartCount')+')');
		$('#globalEquipmentCount').html('('+readCookie('globalEquipmentCount')+')');
		$('#globalArticleCount').html('('+readCookie('globalArticleCount')+')');*/
      });
    }, 
    sortBy: function() {
      $searchResultsContainer.on('change', '.sort-by select', function() {
        // get new value 
        var url = new URI(), 
            sortBy = $(this).val();

        // update URL with sortBy param
        url.setQuery(sortByParam, sortBy);
        url.removeQuery('ajax','true');
        url.addQuery('ajax','true');
        // get updated HTML
        if (Modernizr.history) {
          searchResults.data.getHTML(url);
        }else {
          window.location = url;
        }
        /*$('#globalPartCount').html('('+readCookie('globalPartCount')+')');
		$('#globalEquipmentCount').html('('+readCookie('globalEquipmentCount')+')');
		$('#globalArticleCount').html('('+readCookie('globalArticleCount')+')');*/
      });
    }
  },
  searchResults.state = {
    init: function() {  
      if (Modernizr.history) {
        this.replaceState(searchResults.state.getCurrent(), null, document.location.href); // set for initial page load only
        this.popStateListener();
      }
    },
    pushState: function(stateObject, url) {
      history.pushState(stateObject, null, url);
    },
    replaceState: function(stateObject, url) {
      history.replaceState(stateObject, null, url);
    },
    popStateListener: function() { // handles back button click for partial page load
      if ($searchResultsContainer.length) {
        window.addEventListener('popstate', function(e) { 
          if (e.state !== null) {
            searchResults.state.restore(e.state);
          }
        });      
      }
    },
    getCurrent: function() {
      return $searchResultsContainer.html();
    },
    restore: function(stateObject) {
      $searchResultsContainer.html(stateObject);
      searchResults.facets.init();
      searchResults.results.init();
    }
  }
} (MTD));

$(function() {

  MTD.searchResults.loader.init();

});

$(document).ready(function(){
	//Here also for IE9
	$('#globalPartCount').html('('+readCookie('globalPartCount')+')');
	$('#globalEquipmentCount').html('('+readCookie('globalEquipmentCount')+')');
	$('#globalArticleCount').html('('+readCookie('globalArticleCount')+')');
});