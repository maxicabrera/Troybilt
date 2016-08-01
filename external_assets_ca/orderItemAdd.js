var ip = false;

function Add2ShopCart(catentryId, isModal){
	if(!ip){
		$(''+$.addToCartSharedDisplayObject.errMsgElemName).html('');
		ip = true;
		if( typeof(catentryId) === 'undefined'){
			return false;
		}else{
			var toggleElems = {};
			toggleElems.addElemName = $.addToCartSharedDisplayObject.addElemName + catentryId;
			toggleElems.waitElemName = $.addToCartSharedDisplayObject.waitElemName + catentryId;
			if(isModal){
				toggleElems.addElemName += '_modal';
				toggleElems.waitElemName += '_modal';
			}
			toggleAddAndWaitDisplay(toggleElems);
			if(parseUri(document.location.href).protocol == 'http'){
				var ajaxUrl = $.protocolServerNameAndContextRoot + '/OrderItemAdd' + $.standardQueryStringParams;
			}else {
				var ajaxUrl = $.protocolServerNameAndContextRoot + '/SecureOrderItemAdd' + $.standardQueryStringParams;
			}

			var ajaxData = {};
			jQuery.each($.requiredAjaxCmdParams, function(name, val) {
		        ajaxData[name] = val;
		    });
		    var qtyElemName = '#quantity_'+catentryId;
		    var errorId = $.addToCartSharedDisplayObject.errMsgElemName;
		    if(isModal){
		    	qtyElemName += '_modal';
		    	errorId += '_modal';
		    }
		    ajaxData.quantity = $(qtyElemName).val();
			ajaxData.productId = catentryId;
			ajaxData.catentryId = catentryId;
			ajaxData.catEntryId = catentryId;
			if($('#categoryId_'+catentryId).length){
				ajaxData.categoryId = $('#categoryId_'+catentryId).val();
			}else if( $('#categoryId').length ) {
				ajaxData.categoryId = $('#categoryId').val();
			}else if(typeof(parseUri(document.location.href).queryKey.categoryId) !== 'undefined'){
				ajaxData.categoryId = parseUri(document.location.href).queryKey.categoryId;
			}
			if( $('#replacedPartNumber').length ) {
				ajaxData.comment = $('#replacedPartNumber').val();
			}
			if($('#attrName_1').length){ //check if defining attributes are present
				var definingAttrNames = [];
				$("input[id^='attrName_']").each(function() { 
					definingAttrNames.push($(this).val()); 
				});
				var definingAttrValues = [];
				for(i = 0; i < definingAttrNames.length; i++){
					definingAttrValues.push($('#attrValue_'+definingAttrNames[i]).val());
				}
				ajaxData.attrName = definingAttrNames;
				ajaxData.attrValue = definingAttrValues;
			}
			$.ajax({
			    url: ajaxUrl,
			    data: ajaxData,
			    type: 'POST',
			    dataType: 'json',
			    cache: false,
			    timeout: 20000,
			    error: function(json){
			    	/* to view the complete response, uncomment this section - ***requires json2.js include***
			    	var jsonText = JSON.stringify(json, function (key, value) {	return value; });
					alert('json resp: '+jsonText); */
			    	ip = false;
			    	$(''+errorId).html($.addToCartSharedDisplayObject.genericAddToCartErrorMessage);
			    	scrollToTop();
			        toggleAddAndWaitDisplay(toggleElems);
			    },
			    success: function(json){
			    	ip = false;	
			    	/** success just means we have received a reply from the server. still need to parse response for error code */
			    	/* to view the complete response, uncomment this section - ***requires json2.js include*** 
			    	var jsonText = JSON.stringify(json, function (key, value) {	return value; });
					alert('json resp: '+jsonText);*/
					if(typeof(json.orderId) !== 'undefined'){
						/** refresh the cart monitor, quick cart display, and trigger the Item Just Added modal */
		      			if(isModal){closeModal();}
		      			orderPrepare(json.orderId,json.orderItemId, catentryId, ajaxData.categoryId);
		      			initJustAddedShowHide();
		      			toggleAddAndWaitDisplay(toggleElems);
					}else if(json.errorMessageKey == '_ERR_INSUFFICIENT_INVENTORY'){
						scrollToTop();
						toggleAddAndWaitDisplay(toggleElems);
					}else if(json.errorMessageKey == '_ERR_UNABLE_DECREMENT_INVENTORY'){
						$(''+errorId).html('unable to decrement');
						scrollToTop();
						toggleAddAndWaitDisplay(toggleElems);
					}else if(json.errorMessageKey == '_API_CANT_RESOLVE_FFMCENTER'){
						$(''+errorId).html($.addToCartSharedDisplayObject.outOfStockErrorMessage);
						scrollToTop();
						toggleAddAndWaitDisplay(toggleElems);
					}else if(json.errorMessageKey == '_MTD_API_BAD_INV'){
						var errorMessageParam = json.errorMessageParam;
						var origMessage = $.addToCartSharedDisplayObject.insufficientInventoryErrorMessage;
						var finalMessage = origMessage.replace('{0}',errorMessageParam[0]).replace('{1}',errorMessageParam[1]);
						$(''+errorId).html(finalMessage);
						scrollToTop();
						toggleAddAndWaitDisplay(toggleElems);
					}else{
			    		$(''+errorId).html($.addToCartSharedDisplayObject.genericAddToCartErrorMessage);
			    		scrollToTop();
			        	toggleAddAndWaitDisplay(toggleElems);
					}
			    }
			});
		}
		ip = false;
	}
}

function Add2ShopCartQty(catentryId, isModal, qtyPassed){
	if(!ip){
		ip = true;
		if( typeof(catentryId) === 'undefined'){
			return false;
		}else{
			if(parseUri(document.location.href).protocol == 'http'){
				var ajaxUrl = $.protocolServerNameAndContextRoot + '/OrderItemAdd' + $.standardQueryStringParams;
			}else {
				var ajaxUrl = $.protocolServerNameAndContextRoot + '/SecureOrderItemAdd' + $.standardQueryStringParams;
			}

			var ajaxData = {};
			jQuery.each($.requiredAjaxCmdParams, function(name, val) {
		        ajaxData[name] = val;
		    });
		    var qtyElemName = '#quantity_'+catentryId;
		    var errorId = $.addToCartSharedDisplayObject.errMsgElemName;
		    		    if(isModal){
		    	errorId += '_modal';
		    }
		    ajaxData.quantity = qtyPassed;
			ajaxData.productId = catentryId;
			ajaxData.catentryId = catentryId;
			ajaxData.catEntryId = catentryId;
			if($('#categoryId_'+catentryId).length){
				ajaxData.categoryId = $('#categoryId_'+catentryId).val();
			}else if( $('#categoryId').length ) {
				ajaxData.categoryId = $('#categoryId').val();
			}else if(typeof(parseUri(document.location.href).queryKey.categoryId) !== 'undefined'){
				ajaxData.categoryId = parseUri(document.location.href).queryKey.categoryId;
			}
			if( $('#replacedPartNumber').length ) {
				ajaxData.comment = $('#replacedPartNumber').val();
			}
			if($('#attrName_1').length){ //check if defining attributes are present
				var definingAttrNames = [];
				$("input[id^='attrName_']").each(function() { 
					definingAttrNames.push($(this).val()); 
				});
				var definingAttrValues = [];
				for(i = 0; i < definingAttrNames.length; i++){
					definingAttrValues.push($('#attrValue_'+definingAttrNames[i]).val());
				}
				ajaxData.attrName = definingAttrNames;
				ajaxData.attrValue = definingAttrValues;
			}
			$.ajax({
			    url: ajaxUrl,
			    data: ajaxData,
			    type: 'POST',
			    dataType: 'json',
			    cache: false,
			    timeout: 20000,
			    error: function(json){
			    	ip = false;
			    	if(json.errorMessageKey == '_ERR_INSUFFICIENT_INVENTORY'){
			    		$(''+errorId).html($.addToCartSharedDisplayObject.insufficientInventoryErrorMessage);
					}else if(json.errorMessageKey == '_ERR_UNABLE_DECREMENT_INVENTORY'){
						$(''+errorId).html('unable to decrement');
					}else if(json.errorMessageKey == '_API_CANT_RESOLVE_FFMCENTER'){
						$(''+errorId).html($.addToCartSharedDisplayObject.outOfStockErrorMessage);
					}else if(json.errorMessageKey == '_MTD_API_BAD_INV'){
						var errorMessageParam = json.errorMessageParam;
						var origMessage = $.addToCartSharedDisplayObject.insufficientInventoryErrorMessage;
						var finalMessage = origMessage.replace('{0}',errorMessageParam[0]).replace('{1}',errorMessageParam[1]);
						$(''+errorId).html(finalMessage);
					}else{
			    		$(''+errorId).html($.addToCartSharedDisplayObject.genericAddToCartErrorMessage);
					}
			    	scrollToTop();
			    	
			    },
			    success: function(json){
			    	ip = false;	
	    			
	      			if(typeof(json.orderId) !== 'undefined'){
	      				    /*				
		      				if(isModal)
					    	{
		  						refreshCartQM();
		      				}
		      				else{
			      				scrollToTop();
			      				refreshCart();
			      			}
			      			*/
		      				if(isModal){Shadowbox.close();}
			      			orderPrepare(json.orderId,json.orderItemId, catentryId, ajaxData.categoryId);
			      			initJustAddedShowHide();
			      			
					}else if(json.errorMessageKey == '_ERR_INSUFFICIENT_INVENTORY'){
						$(''+errorId).html($.addToCartSharedDisplayObject.insufficientInventoryErrorMessage);
						scrollToTop();
					}else if(json.errorMessageKey == '_ERR_UNABLE_DECREMENT_INVENTORY'){
						$(''+errorId).html('unable to decrement');
						scrollToTop();
					}else if(json.errorMessageKey == '_API_CANT_RESOLVE_FFMCENTER'){
						$(''+errorId).html($.addToCartSharedDisplayObject.outOfStockErrorMessage);
						scrollToTop();
					}else if(json.errorMessageKey == '_MTD_API_BAD_INV'){
						var errorMessageParam = json.errorMessageParam;
						var origMessage = $.addToCartSharedDisplayObject.insufficientInventoryErrorMessage;
						var finalMessage = origMessage.replace('{0}',errorMessageParam[0]).replace('{1}',errorMessageParam[1]);
						$(''+errorId).html(finalMessage);
						scrollToTop();
					}else{
			    		$(''+errorId).html($.addToCartSharedDisplayObject.genericAddToCartErrorMessage);
			    		scrollToTop();
					}
						
			    }
			});
		}
		ip = false;
	}
}
orderPrepare = function(orderId){
	var prepData = {};
	jQuery.each($.requiredAjaxCmdParams, function(name, val) {
        prepData[name] = val;
    });
    jQuery.each($.addToCartSharedCommandObject, function(name, val) {
        prepData[name] = val;
    });
    prepData.orderId = orderId;
	var prepUrl = $.protocolServerNameAndContextRoot + '/AjaxOrderPrepare' + $.standardQueryStringParams;
	$.ajax({
		url: prepUrl,
		data: prepData,
		type: 'POST',
		dataType: 'json',
		cache: false,
		timeout: 8000
	});
};
orderPrepare = function(orderId, orderItemId, catentryId, categoryId){
	var prepData = {};
	jQuery.each($.requiredAjaxCmdParams, function(name, val) {
        prepData[name] = val;
    });
    jQuery.each($.addToCartSharedCommandObject, function(name, val) {
        prepData[name] = val;
    });
    prepData.orderId = orderId;
	var prepUrl = $.protocolServerNameAndContextRoot + '/AjaxOrderPrepare' + $.standardQueryStringParams;
	$.ajax({
		url: prepUrl,
		data: prepData,
		type: 'POST',
		dataType: 'json',
		cache: false,
		timeout: 8000,
		complete: function(){
			postOrderItemAddViewRefresh(orderId, orderItemId, catentryId, categoryId);
		}
	});
};
/*toggle between showing 'Add to Cart' element and the 'Please wait...' element */
toggleAddAndWaitDisplay = function(togElems){
	$(togElems.addElemName).toggle();
	$(togElems.waitElemName).toggle();
}
postOrderItemAddViewRefresh = function(orderId, orderItemId, catentryId, categoryId){
	//refreshQuickCart();
	//refreshCartMon();
	var justAddedOrderId = '&orderId='+ orderId;
	var justAddedOrderItemId = '&orderItemId='+orderItemId;
	var justAddedCatentryId = '&catentryId=' + catentryId;
	var justAddedBrand = '&brand=troybilt';
	var justAddedUrl = $.protocolServerNameAndContextRoot + '/ItemJustAddedView' + $.standardQueryStringParams + justAddedOrderId + justAddedOrderItemId+justAddedCatentryId+justAddedBrand;
	if(typeof(categoryId) !== 'undefined' && categoryId != 'undefined'){
		var justAddedCategoryId = '&categoryId=' + categoryId;
		justAddedUrl += justAddedCategoryId;
	}
	$('#just_added_wrapper').load(justAddedUrl, function() {
  		$('.jqmWindow').jqmAddTrigger($('.prod_img'));
  		//$('#btnCloseItemJustAdded').click(function () { 
		//	$('.just_added').hide();
		//});
	});
}
refreshQuickCart = function(){
	var quickCartUrl = $.protocolServerNameAndContextRoot + '/QuickCartView' + $.standardQueryStringParams;
	$('#quick_cart_wrapper').load(quickCartUrl, function() {
  		$('.jqmWindow').jqmAddTrigger($('.prod_img'));
	});
}
refreshCartMon = function(){
	var cartMonUrl = $.protocolServerNameAndContextRoot + '/CartMonitorView' + $.standardQueryStringParams;
	$('#cart_monitor').load(cartMonUrl, function() {
  		if(typeof(initCartMonitorMouseOver) !== 'undefined'){
			initCartMonitorMouseOver();
		}
	});
}
closeModal = function(){
	$('.jqmWindow').jqmHide();//close the modal layer
}
function refreshCartQM(){
	Shadowbox.close();
	window.location.reload();
	
}

initJustAddedShowHide = function(){
	if($("body").scrollTop() !== 0) {	// if the browser is IE6, IE7, or FF, use the body element
		$('body').animate({		// scroll the page to the top based on a factor of the distance the page is already scrolled
			scrollTop: 0
		}, ($("body").scrollTop() * 1.2), 'swing', function() {
			$(".just_added_wrapper").show().oneTime(1000, function() {		// close the Just Added popup after a 15 second delay if no user interaction
				$("#add-to-cart-modal").appendTo('body').foundation('reveal', 'open');
				//hidepopup(this);
			});
		});
	} else if($("html").scrollTop() !== 0) {		// if the browser is Safari, use the html element
		$('html').animate({		// scroll the page to the top based on a factor of the distance the page is already scrolled
			scrollTop: 0
		}, ($("html").scrollTop() * 1.2), 'swing', function() {
			$(".just_added_wrapper").show().oneTime(1000, function() {		// close the Just Added popup after a 15 second delay if no user interaction
				$("#add-to-cart-modal").appendTo('body').foundation('reveal', 'open');
				//hidepopup(this);
			});
		});
	} else {	// if scrollTop is zero, show the Just Added popup immediately
		$(".just_added_wrapper").show().oneTime(1000, function() {		// close the Just Added popup after a 15 second delay if no user interaction
			$("#add-to-cart-modal").appendTo('body').foundation('reveal', 'open');
			//hidepopup(this);
		});
	}
}

function scrollToTop(){
	window.scrollTo(0,0); 
} 
