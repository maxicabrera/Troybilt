// dependencies:
// components/product-ratings.js

var CUBCADET = CUBCADET || {};
    CUBCADET.productResults = {};

(function (cubcadet) {
  // shortened namespaced Product Results variable for use with code below
  var productResults = cubcadet.productResults;

  // shared component variables
  var $formFacets = $('#form-facets'),
      $facetContainer = $('#facets'),
      $productGridContainer = $('#product-grid'),
      $productResultsSection = $('.product-results'),
      $products = $('.products', $productGridContainer),
      $productGridTemplate = $('#product-grid-template'),
      $productPagingContainer = $('#product-paging'),
      $btnCompare = $('#btn-compare'),
      $btnClearFacets = $('#btn-clear-facets'),
      $sortResults = $('#sort-results'),
      $pageNumberLinks = $('.pages a', $productPagingContainer),
      $pagePrevLink = $('.prev', $productPagingContainer),
      $pageNextLink = $('.next', $productPagingContainer),
      customCheckBoxClass = '.custom.checkbox',
      facetCheckboxClass = '.facet-checkbox',
      compareCheckboxClass = '.checkbox-compare',
      activeClass = 'active',
      showClass = 'show',
      hideClass = 'hide',
      pageCurrentClass = 'current',
      facetParam = 'facet',
      pageNumParam = 'pageNumber',
      pageSizeParam = 'pageSize',
      pageSize = 9,
      pageCurrentIndex = 0,
      pageClickedIndex = 0,
      pageNumberLinksVisible = $pageNumberLinks.length,
      largeBreakPoint = 960;

  // set underscore.js template settings so they don't conflict with JSP syntax
  _.templateSettings = {
    interpolate: /\<\@\=(.+?)\@\>/gim,
    evaluate: /\<\@(.+?)\@\>/gim
  };

  productResults.loader = {
    init: function() {
      productResults.compare.init();
      productResults.facets.init();
      productResults.sort.init();
      productResults.paging.init();
      productResults.state.init();  
    }
  },
  productResults.compare = {
    init: function() {
      this.checkboxClick();
      this.btnClick();
      this.btnScrollClick();
    },
    checkboxClick: function() {
      $productGridContainer.on('change', compareCheckboxClass, function(e) {
        // only 3 items can be compared
        // if more than 3 selected, generate error and uncheck last
        var $compareMaxError = $('#compare-max-error'),
            compareClass = '.compare',
            selectedClass = 'selected',
            compareItems = $(compareCheckboxClass + ':checked').length;

        if (compareItems > 3) {
          var parent = $(this).parent();
          $(compareCheckboxClass, parent).prop('checked', false);
          $(customCheckBoxClass, parent).removeClass('checked');
          alert($compareMaxError.text());
        }else {
          $(this).closest(compareClass).toggleClass(selectedClass);
        }
      });
    },
    checkboxClickUnbind: function() {
      $productGridContainer.off('change', compareCheckboxClass);
    },
    btnClick: function() {
      $btnCompare.on('click', function(e) {
        // at least two and no more than 3 items must be checked
        // get values of selected and redirect to comparison page
        var $compareMinError = $('#compare-min-error'),
            compareSelected = $(compareCheckboxClass + ':checked'),
            compareItems = compareSelected.length;

        if (compareItems > 1 && compareItems <= 3) {
          var compareUrl = new URI($(this).data('compare-url'));
          compareSelected.each(function(i) {
            compareUrl.addQuery('productId', $(this).val());
          });
          window.location = compareUrl;
        }else {
          alert($compareMinError.text());
        }
      });      
    },
    disableAll: function() {
      $(compareCheckboxClass).attr('disabled', 'disabled');  
    },
    enableAll: function() {
      $(compareCheckboxClass).removeAttr('disabled');  
    },
    btnScrollClick: function() {
      var $compareContainer = $('#compare-container');

      $('#btn-compare-scroll').on('click', function(e) {
        var offset = ($compareContainer.hasClass('scrolled')) ? '-' + $compareContainer.width() : $compareContainer.width();

        $compareContainer.addClass('scrolling');
        $compareContainer.css('overflow-x', 'scroll');
        $compareContainer.velocity('scroll', {
          axis: 'x',
          container: $compareContainer,
          offset: offset + 'px',
          duration: 400,
          complete: function() {
            $compareContainer.css('overflow-x', 'hidden')
              .toggleClass('scrolled')
              .removeClass('scrolling');
          }
        });
      });
    }
  },
  productResults.facets = {
    init: function() {
      this.sidebarFix();
      this.facetClick();
      this.clearAllClick();
      this.toggleFacetsClick();
    },
    sidebarFix: function() {
      var windowWidth = $(window).width(),
          facetContainerHeight = $facetContainer.height(),
          productContainerHeight = $products.height();

      if (windowWidth >= largeBreakPoint && facetContainerHeight > productContainerHeight) {
        $productResultsSection.css('height', facetContainerHeight);
      }
    },
    facetClick: function() {
      $formFacets.on('change', facetCheckboxClass, function(e) {
        var $facet = $(this),
            facetId = $facet.attr('id'),
            facetValue = $facet.val(),
            url = new URI();

        // reset any paging params
        if (url.hasQuery(pageNumParam)) {
          url.removeQuery(pageNumParam);
          productResults.paging.resetToDefault();
        }

        if ($facet.prop('checked')) {
          url.addQuery(facetParam, facetValue);
        }else {
          url.removeQuery(facetParam, facetValue);
        }
        if (Modernizr.history) {
          productResults.data.getJSON(url);
        }else {
          window.location = url.toString();
        }
      });      
    },
    clearAllClick: function() {
      $btnClearFacets.on('click', function(e) {
        var url = new URI();

        if (url.hasQuery(facetParam)) {
          // get url and remove facet from query string
          url.removeQuery(facetParam);
          // clear all checked facets
          productResults.facets.uncheckAll();
          // enable all checked facets
          productResults.facets.enableAll();
          // reset any paging params
          if (url.hasQuery(pageNumParam)) {
            url.removeQuery(pageNumParam);
            productResults.paging.resetToDefault();
          }
          if (Modernizr.history) {
            productResults.data.getJSON(url);
          }else {
            window.location = url.toString();
          }
        }
      });
    },
    toggleFacetsClick: function() {
      var $toggle = $('#btn-filter-by');

      $toggle.on('click', function(e) {
        $toggle.toggleClass(activeClass);
        $facetContainer.toggleClass(showClass);
      });
    },    
    uncheckAll: function() {
      $(facetCheckboxClass, $facetContainer).prop('checked', false);
      $(customCheckBoxClass, $facetContainer).removeClass('checked');
    },
    updateWithJSON: function(facetData) {
      // disable and strikethrough any facets that have 0 results available
      var facetIds = [];
      if (facetData) {
        for (var i = 0, l = facetData.length; i < l; i++) {
          for (var ii = 0, ll = facetData[i].entry.length; ii < ll; ii++) {
            var $cb = $(facetCheckboxClass + '[value="' + facetData[i].entry[ii].value + '"]', $facetContainer);
            if (facetData[i].entry[ii].count === 0) {
              $cb.attr('disabled', 'disabled');
              $cb.parent().find('label').addClass('disabled');
              facetIds.push($cb.attr('id'));
            }else {
              $cb.removeAttr('disabled');
              $cb.parent().find('label').removeClass('disabled');
            }
          }
        }
        return facetIds;
      }
    },
    disableAll: function() {
      $(facetCheckboxClass, $facetContainer).attr('disabled', 'disabled');
      $facetContainer.find('label').addClass('disabled');      
    },
    enableAll: function() {
      $(facetCheckboxClass, $facetContainer).removeAttr('disabled');
      $facetContainer.find('label').removeClass('disabled');      
    }
  },
  productResults.data = {
    addLoadingState: function() {
      $facetContainer.addClass('loading');
      $productGridContainer.addClass('loading');
    },
    removeLoadingState: function() {
      $facetContainer.removeClass('loading');
      $productGridContainer.removeClass('loading');
    },
    getJSON: function(url) {
      if (url.toString() !== document.location.href) {
        productResults.data.addLoadingState();
        var jsonRequest = $.getJSON(url)
          .done(function(data) {
            // add current state and new URL to browser history 
            var currentState = productResults.state.getCurrent();
            productResults.state.pushState(currentState, url);  
            // output product results HTML
            var productData = { 'products': data.catalogEntryView };
            _.extend(productData, productResults.data.viewHelpers()); // pass viewHelpers to template
            productResults.compare.checkboxClickUnbind(); // unbind checkbox compare click event
            var productGridTemplate = _.template($productGridTemplate.html());
            $products.html(productGridTemplate(productData));
            picturefill();
            productResults.compare.checkboxClick(); // rebind new html to checkbox compare click event
            // update facets with JSON data
            var facetData = data.facetView || false;
            if (facetData) {
              var facetIds = productResults.facets.updateWithJSON(facetData); 
              productResults.paging.setPages(data.recordSetTotal);
              if (facetIds.length > 0) {
                currentState.facetsDisabled = facetIds;
                currentState.pageNumsVisible = pageNumberLinksVisible;
                productResults.state.replaceState(currentState, url);
              }
            }
            productResults.paging.setCurrentClass(pageClickedIndex);  
            CUBCADET.productRatings.stars.render();  
          })
          .fail(function(jqxhr, textStatus, error) {
            // TODO: better error handling
            console.log('getJSON.fail');
            console.log(textStatus);
            console.log(error);
          })
          .always(function() { 
            productResults.data.removeLoadingState();
          });      
      }
    },
    viewHelpers: function() {
      return {
        getDollars: function(price) {
          var price = price[0].value;
          return price.substring(0, price.indexOf('.') + 1);
        },              
        getCents: function(price) {
          var price = price[0].value;
          return price.substring(price.indexOf('.') + 1, price.length);
        },
        hasRatings: function(attributes) {
          var attributes = attributes || [];
          if (attributes.length > 0) {
            for (var i = 0, l = attributes.length; i < l; i++) {
              if (attributes[i].identifier === 'BZ_RATING') {
                return true;
              }else {
                return false;
              }
            }
          }
        },
        getRating: function(attributes) {
          var attributes = attributes || [],
              attributesLength = attributes.length,
              rating = false;
          if (attributes.length > 0) {
            for (var i = 0, l = attributes.length; i < l; i++) {
              if (attributes[i].identifier === 'BZ_RATING') {
                rating = attributes[i].values[0].value;
              }
            }
            return rating;
          }
        },
        getNumberReviews: function(attributes) {
          var attributes = attributes || [],
              attributesLength = attributes.length,
              numReviews = false;
          if (attributesLength > 0) {
            for (var i = 0, l = attributesLength; i < l; i++) {
              if (attributes[i].identifier === 'BZ_NUMRATINGS') {
                numReviews = attributes[i].values[0].value;
              }
            }
            return numReviews;
          }
        }    
      };   
    }
  },
  productResults.paging = {
    init: function() {
      if (Modernizr.history) {
        this.pageNumberLinkClick();
        this.nextPageClick();
        this.prevPageClick();
      }
    },
    pageNumberLinkClick: function() {
      $productPagingContainer.on('click', '.pages a', function(e) {
        e.preventDefault();
        var pageNum = $(this).data('page-num'),
            url = new URI();

        // set url with pageNum and pageSize params
        (url.hasQuery(pageNumParam)) ? url.setQuery(pageNumParam, pageNum) : url.addQuery(pageNumParam, pageNum);
        (url.hasQuery(pageSizeParam)) ? url.setQuery(pageSizeParam, pageSize) : url.addQuery(pageSizeParam, pageSize);
        // set index of current and clicked so after JSON data is received we can set to current class
        var $currentEl = $('.' + pageCurrentClass, $productPagingContainer);
        pageCurrentIndex = $pageNumberLinks.index($currentEl);
        pageClickedIndex = $pageNumberLinks.index($(this));
        // handle show/hide prev/next links
        productResults.paging.togglePrevNext();
        // get data
        productResults.data.getJSON(url);      
        // scroll to top of page
        productResults.paging.scrollToTop(); 
      });
    },
    nextPageClick: function() {
      $pageNextLink.on('click', function(e) {
        e.preventDefault();
        var url = new URI();

        // set pageClickedIndex
        pageClickedIndex++;     
        // set url with pageNum and pageSize params
        (url.hasQuery(pageNumParam)) ? url.setQuery(pageNumParam, pageClickedIndex + 1) : url.addQuery(pageNumParam, pageClickedIndex + 1);
        (url.hasQuery(pageSizeParam)) ? url.setQuery(pageSizeParam, pageSize) : url.addQuery(pageSizeParam, pageSize);
        // handle show/hide prev/next links
        productResults.paging.togglePrevNext();
        // get data
        productResults.data.getJSON(url);     
        // scroll to top of page
        productResults.paging.scrollToTop(); 
      });
    },
    prevPageClick: function() {
      $pagePrevLink.on('click', function(e) {
        e.preventDefault();
        var url = new URI();

        // set url with pageNum and pageSize params
        (url.hasQuery(pageNumParam)) ? url.setQuery(pageNumParam, pageClickedIndex) : url.addQuery(pageNumParam, pageClickedIndex);
        (url.hasQuery(pageSizeParam)) ? url.setQuery(pageSizeParam, pageSize) : url.addQuery(pageSizeParam, pageSize);
        // set pageClickedIndex
        pageClickedIndex--;    
        // handle show/hide prev/next links
        productResults.paging.togglePrevNext();
        // get data
        productResults.data.getJSON(url);     
        // scroll to top of page
        productResults.paging.scrollToTop();  
      });
    },
    setCurrentClass: function(index) {
      $pageNumberLinks.removeClass(pageCurrentClass)
                      .eq(index).addClass(pageCurrentClass);
    },
    resetToDefault: function() {
      // disable prev
      $pagePrevLink.addClass('hide');
      // enable next
      $pageNextLink.removeClass('hide');
      this.setCurrentClass(0);
      pageCurrentIndex = 0;
      pageClickedIndex = 0;
    },
    setPages: function(totalRecords) {
      var numPagesNeeded = (totalRecords > pageSize) ? Math.ceil(totalRecords/pageSize) : 0;
      this.setPageNumbersVisible(numPagesNeeded);
    },
    setPageNumbersVisible: function(numPagesNeeded) {
      pageNumberLinksVisible = numPagesNeeded;
      $pageNumberLinks.removeClass('hide').slice(numPagesNeeded, $pageNumberLinks.length).addClass('hide');
      if (pageNumberLinksVisible === 0) {
        $pageNextLink.addClass(hideClass);
      }else {
        $pageNextLink.removeClass(hideClass);       
      }
    },
    isLastPage: function() {
      var pageLength = pageNumberLinksVisible;
      return (pageClickedIndex + 1 === pageLength);
    },
    isFirstPage: function() {
      return pageClickedIndex === 0;
    },
    togglePrevNext: function() {
      if (productResults.paging.isLastPage()) {
        $pagePrevLink.removeClass(hideClass);
        $pageNextLink.addClass(hideClass);
      }
      if (productResults.paging.isFirstPage()) {
        $pagePrevLink.addClass(hideClass);
        $pageNextLink.removeClass(hideClass);
      }
      if (!productResults.paging.isLastPage() && !productResults.paging.isFirstPage()) {
        $pagePrevLink.removeClass(hideClass);
        $pageNextLink.removeClass(hideClass);
      }
    },
    scrollToTop: function() {
      var $scrollTabBar = $('#scroll-tab-bar');
      if ($scrollTabBar.length) {
        $('body').velocity('scroll', { offset: $scrollTabBar.offset().top + 'px' });
      }else {
        $('body').velocity('scroll', { offset: '0px' });
      }
    }
  },
  productResults.state = {
    init: function() {  
      if (Modernizr.history) {
        this.replaceState(productResults.state.getCurrent(), null, document.location.href); // set for initial page load only
        this.popStateListener();
      }
    },
    pushState: function(stateObject, url) {
      history.pushState(stateObject, null, url);
    },
    replaceState: function(stateObject, url) {
      history.replaceState(stateObject, null, url);
    },
    popStateListener: function() { // handles back button click for partial page load type pages
      if ($productGridContainer.length) {
        window.addEventListener('popstate', function(e) { 
          if (e.state !== null) {
            productResults.state.restore(e.state);
          }
        });      
      }
    },
    getCurrent: function() {
      var $facetsChecked = $(facetCheckboxClass + ':checked', $facetContainer),
          $facetsDisabled = $(facetCheckboxClass + ':disabled', $facetContainer),
          $currentPageNum = $('.' + pageCurrentClass, $productPagingContainer),
          facetsCheckedIds = [],
          facetsDisabledIds = [],
          pageNum,
          productsHTML,
          sortIndex;

      // get current state of facet checkboxes that are checked   
      if ($facetsChecked.length) {
        $facetsChecked.each(function() {
          facetsCheckedIds.push($(this).attr('id'));
        })
      }
      // get current state of facet checkboxes that are disabled
      if ($facetsDisabled.length) {
        $facetsDisabled.each(function() {
          facetsDisabledIds.push($(this).attr('id'));
        })
      }
      // get current state of sort by
      sortIndex = parseInt($sortResults.val(), 10) || 0;
      // get current state of page number
      pageNum = pageClickedIndex;
      // get current state of page numbers that are visible
      pageNumsVisible = pageNumberLinksVisible;
      // get current state of products html
      productsHTML = $products.html();
      var stateObject = { 
        facetsChecked: facetsCheckedIds, 
        facetsDisabled: facetsDisabledIds, 
        pageCurrent: pageNum, 
        pageNumsVisible: pageNumsVisible,
        sort: sortIndex,
        products: productsHTML 
      };
      return stateObject;
    },
    restore: function(stateObject) {
      // restore facet checkbox checked state
      if (stateObject.facetsChecked.length > 0) {
        productResults.facets.uncheckAll();
        for(var i = 0, l = stateObject.facetsChecked.length; i < l; i++) {
          var $facetCheckbox = $('#' + stateObject.facetsChecked[i]);
          var $parent = $facetCheckbox.parent();
          $facetCheckbox.prop('checked', true);
          $(customCheckBoxClass, $parent).addClass('checked');
        }
      }else {
        productResults.facets.uncheckAll();
      }
      // restore facet checkbox disabled state
      if (stateObject.facetsDisabled.length > 0) {
        productResults.facets.enableAll();
        for(var i = 0, l = stateObject.facetsDisabled.length; i < l; i++) {
          var $facetCheckbox = $('#' + stateObject.facetsDisabled[i]);
          var $parent = $facetCheckbox.parent();
          $facetCheckbox.attr('disabled', 'disabled');
          $parent.find('label').addClass('disabled');
        }
      }else {
        productResults.facets.enableAll();
      }
      // restore sort by state
      if (stateObject.sort === 0) {
        if ($sortResults.val() !== '') {
          $sortResults.val(stateObject.sort).trigger('change', true);
        }
      }else {
        $sortResults.val(stateObject.sort).trigger('change', true);
      }
      // restore page current state
      productResults.paging.setCurrentClass(stateObject.pageCurrent);     
      // restore page numbers visible state
      productResults.paging.setPageNumbersVisible(stateObject.pageNumsVisible);
      // restore products html state
      $products.html(stateObject.products);
      CUBCADET.productRatings.stars.render();  
    }
  },
  productResults.sort = {
    init: function() {
      this.change();  
    },
    change: function() {
      $sortResults.on('change', function(e) {
        var url = new URI(),
            sortByParam = 'sortBy';

        // get sort value and refresh the results
        var sortValue = $(this).val();
        if (sortValue != '') {
          url.setQuery(sortByParam, sortValue);
        }

        if (Modernizr.history) {
          // load new content via JSON request
          productResults.data.getJSON(url);
        }else {
          window.location = url.toString();
        }
      });         
    }
  }

} (CUBCADET));

$(function() {

  CUBCADET.productResults.loader.init();

});