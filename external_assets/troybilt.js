var Navigation = {},
		TopNav = {},
		ProductView = {},
		ImagePreview = {},
		Seasonal = {},
		Promo = {},
		Articles = {},
		Tabs = {},
		FormValidation = {},
		ShareBar = {};
	
var money_pattern = /^[0-9]*(\.[0-9]+)?$/;	

jQuery(document).ready(function() { 
	// primary nav
	Navigation.hoverIntent();
	Navigation.productThumbs();
	TopNav.hoverIntent();
	ProductView.init();
	Articles.init();
	ShareBar.init();
	Tabs.init();
	FormValidation.init();
	
	// apply masonry to seasonal pages
	Seasonal.buildGrid();
	ImagePreview.init();

	// Part Finder Modal code
	$('.frm-part-finder').bind('submit', function(e) {
		e.preventDefault();
		findPart($(this));
	});
	$('#partFinder').bind('submit', function(e) {
		e.preventDefault();
		findPart($(this));
	});
	
	function findPart(this_form) {
		var part_num = $('input:text[name=part_number]', this_form).val();
		var isFormValid = true;
		if($.trim(part_num).length == 0){
			isFormValid=false;
		}
		if (!isFormValid) {
			alert("Part Number is required"); 
			return;
		}
		//if the user has entered a part number, otherwise do nothing
		if(part_num.length > 0) {	
			var partFinderUrl = $.protocolServerNameAndContextRoot + '/SearchDisplay' + $.standardQueryStringParams+'&searchTerm=' + part_num;
			window.location = partFinderUrl;
		}
	}
	$('body').on('submit','#pmf-form-part-search',function(e){
	//	cmCreateElementTag('search', $(this).find('input[name=cmSearchName]').val()+'-'+$(this).find('input[name=bannerName]').val());
	//	cmCreatePageviewTag($(this).find('input[name=cmSearchName]').val()+'-'+$(this).find('input[name=bannerName]').val(), "PMFSearch", $(this).find('input[name=searchTerm]').val(), null, $(this).find('input[name=storeId]').val());
		e.preventDefault();
		setTimeout(function() {
			document.getElementById('pmf-form-part-search').submit();
		}, 300);
	});
	$('body').on('submit','#pmf-form-model-search',function(e){
	//	cmCreateElementTag('search', $(this).find('input[name=cmSearchName]').val()+'-'+$(this).find('input[name=bannerName]').val());
	//	cmCreatePageviewTag($(this).find('input[name=cmSearchName]').val()+'-'+$(this).find('input[name=bannerName]').val(), "PMFSearch", $(this).find('input[name=searchTerm]').val(), null, $(this).find('input[name=storeId]').val());
		e.preventDefault();
		setTimeout(function() {
			document.getElementById('pmf-form-model-search').submit();
		}, 300);
	});
});

function loadPartFinderViewModal(productId,bReplaced,origSearchTerm){
	var productPartFinderViewUrl = $.protocolServerNameAndContextRoot + '/PartFinderView' + $.standardQueryStringParams + '&productId='+productId;
	if(typeof(bReplaced) !== 'undefined'){
		productPartFinderViewUrl += '&bReplaced=' + bReplaced;
		if(typeof(origSearchTerm) !== 'undefined'){
			productPartFinderViewUrl += '&replacedPart='+origSearchTerm;
		}
	}
	$.get(productPartFinderViewUrl, function(data) {
		Shadowbox.open({
				content: 	data,
				player: 	'html',
			title: 		'Part Finder',
				height: 	450, 
				width: 		550			
			});
	}).error(function() { 
		openPartFinderErrorMessage('Sorry, we\'ve encountered an error displaying the product details for <strong>' + origSearchTerm +'</strong>.<br/>Please close this window and retry your search, or use the Live Chat link below to get help now.'); 
	});
	
}
function openPartFinderErrorMessage(partFinderErrorMessage)
{
Shadowbox.open({
    content:    '<div class="part-not-found"><p>' + partFinderErrorMessage + '</p></div><p><a href="#cmlivechat" onclick="javascript: window.open(\''+lc_url+'\',\''+lc_window_name+'\',\''+lc_window_params+'\')"  class="chat-btn">LIVE CHAT</a></p>',
    player:     'html',
    title:      'Part Finder',
			height: 	350, 
			width: 		450			
});
	
}
	
function openModelFinderErrorMessage(modelFinderErrorMessage)
{
Shadowbox.open({
    content:    '<div align="right" style="padding: 5px;"></div><div class="part-not-found"><p>' + modelFinderErrorMessage + '</p></div>',
    player:     'html',
    title:      'Model Finder',
    height:     350,
    width:      450
});
}
	

TopNav.hoverIntent = function() {
	if (! Modernizr.touch)
	{
		if ($('ul.sf-menu').length > 0) {
		    $('ul.sf-menu').superfish({ 
		        delay:       50,                            // one second delay on mouseout 
		        animation:   {opacity:'show',height:'show'},  // fade-in and slide-down animation 
		        speed:       'fast',                          // faster animation speed 
		        autoArrows:  false,                           // disable generation of arrow mark-up 
		        dropShadows: true                            // disable drop shadows 
		    });	
		}
	}	
}

Navigation.productThumbs = function () {
	$('ul.product-dropdown').each(function () {
		var img_wrapper = $(this).next('span.img');
		var img_el = document.createElement('img');
		$(img_el).hide();
		$(img_wrapper).append(img_el);
		$(this).find('li a').mouseover(function () {
			if($(this).data('image') != '') {
				$(img_el).show();
				var img_src = $(this).data('image');
				if(!$(this).hasClass('img-loaded')) {
					$(this).addClass('img-loaded');
					$(img_el).attr( 'src', img_src ).load();
				} else {
					$(img_el).attr( 'src', img_src );
				}
			} else {
				$(img_el).hide();
			}
		});
	});
}


Navigation.hoverIntent = function () {	
	if (Modernizr.touch) 
	{
		$('.pri-nav a.tab').click(function(e) {
			e.preventDefault();
			if ($(this).parent().hasClass('hovering'))
			{
				$('.pri-nav').removeClass('hovering');
			}else
			{
				$('.pri-nav').removeClass('hovering');
				$(this).parent().addClass('hovering');	
			}
		});	
	}else 
	{
		var pri_config = {
			over: Navigation.showNav,
			timeout: 500,
			out: Navigation.hideNav
		}		
		$('.pri-nav').hoverIntent(pri_config);	
	}	
}

Navigation.showNav = function () {
	$(this).addClass("hovering");		
}

Navigation.hideNav = function () {
	$(this).removeClass('hovering');			
}

/* shadowbox to display HTML content */
Shadowbox.init({
	language: 'en',
  players:  ['iframe']
});

/* product listing page, filter overlay */
animatedcollapse.addDiv('filteroverlay', 'fade=1,speed=400,hide=0,height=0px')
animatedcollapse.ontoggle=function($, divobj, state){ //fires each time a DIV is expanded/contracted
//$: Access to jQuery
//divobj: DOM reference to DIV being expanded/ collapsed. Use "divobj.id" to get its ID
//state: "block" or "none", depending on state
}
animatedcollapse.init();


/* product list page */
function showHide1(elementid)	{
	if (document.getElementById(elementid).style.display == 'none'){
		document.getElementById(elementid).style.display = '';
	} else {
		document.getElementById(elementid).style.display = 'none';
	}
}
function showHide(elementid,elementid2,v1,v2) {
	if (elementid == 'gridview'){
		document.getElementById('listButton').style.display = '';
		document.getElementById('gridButton').style.display = 'none';
		document.getElementById('listButton2').style.display = '';
		document.getElementById('gridButton2').style.display = 'none';
	}
	if (elementid == 'listview'){
		document.getElementById('gridButton').style.display = '';
		document.getElementById('listButton').style.display = 'none';
		document.getElementById('gridButton2').style.display = '';
		document.getElementById('listButton2').style.display = 'none';
	}
	if(document.getElementById(elementid) != null && document.getElementById(elementid).style != null){
		if (document.getElementById(elementid).style.display == 'none')
		{
			document.getElementById(elementid).style.display = '';
			if(document.getElementById(elementid2) != null && document.getElementById(elementid2).style != null){
				document.getElementById(elementid2).style.display = 'none';
			}
			if(document.getElementById(v1) != null && document.getElementById(v1).style != null){
				document.getElementById(v1).style.fontWeight = 'bold';
			}
			if(document.getElementById(v2) != null && document.getElementById(v2).style != null){
				document.getElementById(v2).style.fontWeight = 'normal';
			}
		}
	}
}
function showHide2(elementid) {
	if (document.getElementById(elementid).style.display == 'none')
	{
		document.getElementById(elementid).style.display = '';
	}
	else
	{
		document.getElementById(elementid).style.display = 'none';
	}
}
function showHide3(elementid){
	if (document.getElementById(elementid).style.display == '')
	{
		document.getElementById(elementid).style.display = 'none';
	}
	else
	{
		document.getElementById(elementid).style.display = 'none';
	}
}



/* registration page */
$('#shareInfo').click(function(event) {
	if(this.checked) {
		// Iterate each checkbox
		$(':checkbox').each(function() {
			this.checked = true;
		});
	}
	if(!this.checked) {
		// Iterate each checkbox
		$(':checkbox').each(function() {
			this.checked = false;
		});
	}
});
function prepareSubmit(form)
{
	if (form.sendMeEmail.checked) {
		form.receiveEmail.value = true;
	} else {
		form.receiveEmail.value = false;
	}
	if (form.joinConsumerClub.checked) {
		form.demographicField2.value = 1;
	} else {
		form.demographicField2.value = 0;
	}
	if (form.maintReminder.checked) {
		form.demographicField4.value = 1;
	} else {
		form.demographicField4.value = 0;
	}
	if (form.shareInfo.checked) {
		form.userField2.value = 1;
	} else {
		form.userField2.value = 0;
	}
	if (validateOnSubmit()) {
		form.submit();
	}
	return;
}
// Only script specific to this form goes here.
// General-purpose routines are in a separate file.
function validateOnSubmit() {
	var temp1= document.getElementById('email1').value;
	document.getElementById('logonId').value = temp1 + "_10001";
	var elem;
	var errs=0;
	// execute all element validations in reverse order, so focus gets
	// set to the first one in error.
	if (!validatePresent(document.forms.Register.email1, 'inf_email1')) errs += 1;
	if (!validatePresent(document.forms.Register.logonPassword, 'inf_logonPassword')) errs += 1;
	if (!validatePresent(document.forms.Register.logonPasswordVerify, 'inf_logonPasswordVerify')) errs += 1;
	if (!validatePresent(document.forms.Register.firstName, 'inf_firstName')) errs += 1;
	if (!validatePresent(document.forms.Register.lastName, 'inf_lastName')) errs += 1;
	if (!validateEmail(document.forms.Register.email1, 'inf_email1', true)) errs += 1;
	if (errs>1) alert("There are fields which need correction before sending");
	if (errs==1) alert("There is a field which needs correction before sending");
	return (errs==0);
}


/* MY INFORMATION SECTION 
$().ready(function() {
	//create the delete modal from the hidden div
	$('#shed-modal-wrap').jqm({
		closeClass: '.shed-modal .close',
		modal: true,
		toTop: true,
		overlayClass: 'jqmShedOverlay',
		onShow:function(hash) {
			hash.w.show();
		},
		onHide:function(hash){
			$('#removeContainer').hide();
			hash.w.hide();
			hash.o.remove();
		}
	});
});*/
// Main account information save form
$('.save').click(function(){
	$('.errortxt').hide();
	if(document.Register.logonPassword.value.length == 0){
		$('#logonPassword').val('************');
	}
	if(document.Register.logonPasswordVerify.value.length == 0){
		$('#logonPasswordVerify').val('************');
	}
	validate();
	$("#Register").submit();
});
var validate = function(){
	$("#Register").validate({
		errorClass: "not-valid",
		errorElement: "span",
		errorPlacement: function(error, element) {
			element.after(error);
		},
		rules: {
			firstName: {
				required:true
			},
			lastName: {
				required:true
			},
			email1: {
				required:true,
				email: true
			},
			logonPassword: {
				required: true,
				minlength:6
			},
			logonPasswordVerify: {
				required: true,
				minlength:6,
				equalTo: "#logonPassword"
			}
		},
		messages: {
			firstName: {
				required: "Your first name is required."
			},
			lastName: {
				required: "Your last name is required."
			},
			email1: {
				required: "A valid email address is required.",
				email: "A valid email address is required."
			},
			logonPassword: {
				required: "A password is required.",
				minlength: jQuery.format("Password must be at least {0} characters in length.")
			},
			logonPasswordVerify: {
				required: "Please confirm your password.",
				minlength: jQuery.format("Password must be at least {0} characters in length."),
				equalTo: "Your passwords do not match."
			}
		}
	});
}

function hoverMarkerIn(num){
	$('.marker').next().fadeOut('medium');
	var marker = $('#marker-'+num);
	var callout = marker.next();
	var posLeft = parseInt(marker.css('left')); 
	var posTop = parseInt(marker.css('top')); 
	if(posLeft > 360)
	{
		callout.addClass('borderRight');
		posLeft-=290;
	}
	else
	{
		callout.removeClass('borderRight');
		posLeft+=40
	}
	callout.css({top:(posTop-10),left:posLeft})
		.css('z-index',1000)
		.stop(true, true)
		.fadeIn('medium');
}

function hoverMarkerOut(num){
	var marker = $('#marker-'+num);
	var callout = marker.next();
	callout.fadeOut('medium');
}
/*
function parseXml(xml)
{
	var slideCount = 0;
	$(xml).find('slide').each(function(e){  
		slideCount++;
		var bFirst = true;
		var $slide = $(this);
		var slideNum = $slide.attr('id');		
		var image = $slide.find('images image#background url').text();
		var html = '';
		html += '<li class="slide'+slideCount+'"><img src="'+image+'" />';	
		$($slide).find('marker').each(function(e){		
			var $marker = $(this);  
			var top = $marker.find('top').text();  
			var left = $marker.find('left').text();  
			var description = $marker.find('description').text();  
			var title = $marker.find('title').text();  
			var url = $marker.find('url').text(); 
			var textBtn = $marker.find('text').text();
			var markerNum = $marker.attr('id');
			html +='<a id="marker-'+markerNum+'" onmouseover="hoverMarkerIn('+markerNum+');" class="marker" href="#" style="top:'+top+'px;left:'+left+'px;"></a>';	
			html += '<div style="display:none">\
							<a href="'+url+'">\
								<h4>'+title+'</h4>\
		                            <p>'+description+'</p>\
		                            <span>' + textBtn + '</span>\
		                        </a>\
		                    </div>';

		});  
		html+="</li>";
		$('.slides').append(html);	
	});	
}
*/

ImagePreview.init = function () {
	$(".img_preview").click(function(e) {
		e.preventDefault();
		var parentEl = $(".preview_img", $(this).parent());
		if (parentEl.length == 0) {			
			$('<div class="preview_img" style="display:block;"><img src="' + $(this).attr("href") + '"></div>').insertAfter($(this));
		}else{
			parentEl.toggle();
		}
		return false;
	});
	$(".img_preview").mouseout(function() {
		$(".preview_img").hide();
	});
}


Tabs.init = function () {
	$('.tabs li a').click(function (e) {
		e.preventDefault();
		Tabs.setActiveTab($(this));
	});
	if (window.location.hash) {
		var tabHash = window.location.hash;
		tabHash = tabHash.substring(1, tabHash.length);
		var tabLink = $("[data-tabid='" + tabHash + "']");
		if (tabLink.length) tabLink.trigger('click');
	}
}
Tabs.setActiveTab = function(tab) {
	var activeClass = 'tab-active';
	var contentClass = 'active';

	if(!tab.closest('li').hasClass(activeClass)) {
		$('.tabs li').removeClass(activeClass);
		tab.closest('li').addClass(activeClass);
		$('.tab-content').removeClass(contentClass);
		$('#' + tab.data('tabid')).addClass(contentClass);
	}	

		return false;
	};



ProductView.init = function () {
	$('[data-pic-swap]').click(function () {
		if(!$(this).hasClass('active')) {
			$(this).closest('ul').find('[data-pic-swap]').removeClass('active');
			$(this).addClass('active');
			$($(this).data('pic-swap')).find('img').remove();
			$($(this).data('pic-swap')).attr('href', $(this).data('zoom-href'));
			$($(this).data('pic-swap')).prepend('<img src="' + $(this).data('image') + '" />');
			Shadowbox.setup(); //needed to update the href above
		}
		return false;
	});	
	$('[data-toggle-view]').click(function () {
		if(!$(this).hasClass('active')) {
			$('[data-toggle-view]').removeClass('active');
			$('[data-toggle-view="' + $(this).data('toggle-view') + '"]').addClass('active');
			var new_class = $(this).data('toggle-view');
			var el = $(this).data('toggle-el');
			$(el).attr('class',new_class);
			return false;
		}
	});
	$('.sorting-option').change(function () {
		if($(this).val() != ""){
			$(this).closest("form").submit();
		}
	});
	$('[data-print-page="true"]').click(function() {
		window.print();
		return false;
	});
	
	 $('.mapped-btn').each(function () {
			 var btn_width = $(this).data('width');
			 var btn_height = $(this).data('height');
			 var btn_top = $(this).data('top');
			 var btn_left = $(this).data('left');
			 var btn_font_size = Math.floor(parseInt(btn_height.replace('px','')) * .5) + 'px';
			 var btn_line_height = Math.floor(parseInt(btn_height.replace('px','')) + 3) + 'px';
			 $(this).css({
					  width: btn_width,
					  height: btn_height,
					  lineHeight: btn_line_height,
					  top: btn_top,
					  left: btn_left,
					  fontSize: btn_font_size,
					  padding: 0
			 });
	 });

	ProductView.filters();
	ProductView.compare();
	$('.stars').each(ProductView.stars);
}
ProductView.compare = function () {
	var compared_products = [];
	$('input.add-to-compare').attr('checked', false);
	$('a.compare').click(function (e){
		e.preventDefault();
		if($(compared_products).size() >= 2) {
			var href = $(this).attr('href');
			$(compared_products).each(function (i) {
				href += '&productId' + '=' + this;
			});
			window.location = href;
		} else {
			alert('Please select at least 2 products to compare.');
			return false;
		}
	});
	$('input.add-to-compare').click(function () {
		var product = $(this).data('compare');
		if($(this).is(':checked')) {
			if($.inArray(product, compared_products) == -1) {
				if($(compared_products).size() >= 4) {
					alert('You can only compare up to 4 products at a time.');
					$(this).attr('checked', false);
				} else {
					compared_products.push(product);
				}
			}
		} else {
			compared_products.splice(compared_products.indexOf(product), 1);
		}
	});
}
ProductView.stars = function () {	
	var max_stars = 5;
	if($(this).find('em').size() > 0) {
		var max_width = $(this).width();
		var star_rating = parseFloat(($(this).find('em').html()).replace(/_/g, "."));
		var star_width = Math.round((star_rating / max_stars) * max_width);
		$(this).find('em').css('width',star_width + 'px');
	}
}
ProductView.filters = function () {
	// remove this in production. this is just to emulate functionality
	$('[data-filter]').attr('checked',false);
	var params = ProductView.parseParams(document.URL.split('?')[1] || '');
	var filter_pattern = /^filter-.+$/;
	var multifilter_pattern = /^(multi-filter-)(.+)$/;
	var $input;
	for(param in params) {
		if(filter_pattern.test(param)) {
			$input = $('input[name="' + params[param] + '"]');
			$input.attr('checked','checked');
			ProductView.resetQueryString($input);
		} else if(multifilter_pattern.test(param)) {
			$input = $('input[name="' + param.replace(multifilter_pattern,'$2') + '"]');
			$input.attr('checked','checked');
			ProductView.resetQueryString($input);
		}
	}
	ProductView.filter_types = {};
	$('[data-filter]').each(function () {
		ProductView.filter_types[$(this).data('filter')] = {multiple: typeof $(this).data('multiple') !== 'undefined', value: []}; 
		if($(this).is(':checked')) {
			ProductView.filter_types[$(this).data('filter')].value.push($(this).attr('name'));
		}
		$(this).change(ProductView.filterRedirect);
	});
}
ProductView.filterRedirect = function () {
	query_string = ProductView.resetQueryString(this);
	window.location = '/products' + query_string;
}
ProductView.resetQueryString = function (el) {
	if(typeof $(el).data('multiple') === 'undefined') {
		if($(el).is(':checked')) {
			$('input[data-filter="' + $(el).data('filter') + '"]').not('input[name="' + $(el).attr('name') + '"]').attr({'checked':false, 'disabled':'disabled'}).closest('li').addClass('inactive');
		} else {
			$('input[data-filter="' + $(el).data('filter') + '"]').attr({'checked':false, 'disabled':false}).closest('li').removeClass('inactive');
		}
	}
	var query_string = '?';	
	for(type in ProductView.filter_types) {
		ProductView.filter_types[type].value = [];
		if(!ProductView.filter_types[type].multiple && ($('input[data-filter="' + type + '"]').filter(':checked').size() > 0)) {	
			ProductView.filter_types[type].value.push($('input[data-filter="' + type + '"]').filter(':checked').eq(0).attr('name'));
			query_string += query_string != '/?' ? '&' : '';
			query_string += 'filter-' + type + '=' + ProductView.filter_types[type].value[0];
		} else if(ProductView.filter_types[type].multiple && ($('input[data-filter="' + type + '"]').filter(':checked').size() > 0)) {
			$('input[data-filter="' + type + '"]').filter(':checked').each(function () {
				ProductView.filter_types[type].value.push($(this).attr('name'));
				query_string += query_string != '/?' ? '&' : '';
				query_string += 'multi-filter-' + $(this).attr('name') + '=' + true;
			});
		}
	}
	return query_string;
}
ProductView.parseParams = function (query) {
	//based of jQuery parseParams plugin - https://gist.github.com/956897
	var re = /([^&=]+)=?([^&]*)/g;
	var decodeRE = /\+/g; // Regex for replacing addition symbol with a space
	var decode = function (str) {return decodeURIComponent( str.replace(decodeRE, " ") );};
	var params = {}, e;
	var count = 0;
  while ( e = re.exec(query) ) {
      var k = decode( e[1] ), v = decode( e[2] );
      if (k.substring(k.length - 2) === '[]') {
          k = k.substring(0, k.length - 2);
          (params[k] || (params[k] = [])).push(v);
      }
      else params[k] = v;
      count++;
  }
  if(count > 0) {
  	return params;
  } else {
  	return false;
  }
}

Articles.init = function () {
	var tipsAdvice = $('.tips-advice').length;
	if (tipsAdvice > 0) {
		$('.expand-collapse .closed').click(function () {
			var expand_open = $('.expand-collapse .open');	
			if (expand_open.length > 0) {
				$(expand_open).not(this).removeClass('open').addClass('closed').closest('li').find('.expanded').removeClass('expanded').addClass('collapsed');
			}
			if ($(this).hasClass('open')) {
				$(this).removeClass('open').addClass('closed').closest('li').find('.expanded').removeClass('expanded').addClass('collapsed');
			} else if ($(this).hasClass('closed')) {
				$(this).removeClass('closed').addClass('open').closest('li').find('.collapsed').removeClass('collapsed').addClass('expanded');
			}
		});
		$('.article-video-library .filter-options').each(Articles.filterOptions);		
		if (window.location.hash) {
			$(window.location.hash).trigger('click');
		}
	}
};

Articles.filterOptions = function () {
	var filter_el = this;
	var filter_parent = $(filter_el).closest('.article-video-library');
	$(filter_parent).find('[data-filter]').hide().addClass('filtered');
	resetFilters();
	$(filter_el).find('input[type="checkbox"]').change(resetFilters);

	function resetFilters () {
		$(filter_el).find('input[type="checkbox"]').each(function () {
			if($(this).is(':checked')) {
				$(filter_parent).find('[data-filter="' + $(this).attr('name') + '"]').removeClass('filtered').show();
			} else {
				$(filter_parent).find('[data-filter="' + $(this).attr('name') + '"]').hide().removeClass('filtered').addClass('filtered');
			}
			$(filter_parent).find('.paging').remove();
			$(filter_parent).find('[data-paginate]').each(Articles.paginate);
		});
	}

};

Articles.paginate = function (curr_index) {
	// set the vars
	var limit = $(this).data('paginate-limit');
	var el = $(this).data('paginate-child');
	var el_set = $(this).find(el).not('.filtered');
	var count = $(el_set).size();
	var pages = Math.ceil(count / limit);
	var pagination_parent = this;

	if(pages > 1) {
		// build the pagination
		var pagination = $('<div />');
		$(pagination).addClass('paging');
		for(var i=1; i <= pages; i++) {
			if(i == 1) {
				$(pagination).append('<a href="#" data-page="' + i + '" class="active">' + i + '</a>');
			} else {
				$(pagination).append('<a href="#" data-page="' + i + '">' + i + '</a>');
			}
		}
		$(pagination).append('<a href="#" data-page="2" class="next">Next</a> >>');
		$(pagination_parent).after(pagination);
		// mark the elements that will need pagination
		var pages_flagged = 0;
		while(pages_flagged < pages) {
			var set = pages_flagged * limit;
			if(pages_flagged == (pages - 1)) {
				for(var i = 0; i < (count % limit); i++) {
					$(el_set).eq(set + i).attr('data-page', (pages_flagged + 1));
				}
				pages_flagged++;
			} else {
				for(var i = 0; i < limit; i++) {
					$(el_set).eq(set + i).attr('data-page', (pages_flagged + 1));
				}
				pages_flagged++;
			}
		}
		// show the first page
		var curr_page = 1;
		$(el_set).hide().filter('[data-page="' + curr_page + '"]').show();
		// set the page handlers
		$(pagination).find('a').click(function () {
			if(!$(this).hasClass('active')) {
				curr_page = $(this).data('page');
				$(pagination).find('a').removeClass('active').filter('[data-page="' + $(this).data('page') + '"]').addClass('active');
				$(pagination_parent).find(el).hide().filter('[data-page="' + curr_page + '"]').show();
				if(parseInt(curr_page) == pages) {
					$(pagination).find('a.next').addClass('active');
				} else {
					$(pagination).find('a.next').removeClass('active').data('page', parseInt(curr_page) + 1);
				}
			}
			return false;
		});
	}
};



// Live Chat functionality

var lc_url = "http://troybilt.custhelp.com/app/chat/chat_launch";
var lc_window_name = "TroyBilt_Live_Chat";
var lc_window_params = "toolbar=no,width=400,height=750,scrollbars=yes,location=no";
// view names, as determined by parseUri(document.location.href).file, where Live Chat link is to be displayed in header
var arrLiveChatViews = new Array("ARIPartFinderView","OrderItemDisplay", "OrderItemDisplayView", "BillingAddressView", "OrderDisplay", "OperatorManualPartFinderView", "SearchDisplay", "parts-and-service");
//when view names are not sufficient, try a match on query string as determined parseUri(document.location.href).query
var arrLiveChatQStrings = new Array("top_category=1211102&parent_category_rn=1211102&langId=-1&storeId=10001&catalogId=14102&categoryId=1211102");
// live chat anchor element
var liveChatAnchor = $(document.createElement("a"))
    .attr({ href: "#cmlivechat"})
    .addClass("chat-btn")
    .text("LIVE CHAT");
//append live chat anchor to element and bind onclick function to it
function appendLiveChatAnchor(className){
	if(className){
		// if class name is supplied, appends Live Chat button to element
		$.each($('.'+className), function() {
			if( $(this).children('a.chat-btn').size() == 0){
				$(this).append(
					liveChatAnchor.clone().bind('click', function() {
					//	cmCreateConversionEventTag("Live Chat","2","Live Chat");
			  			window.open(lc_url, lc_window_name, lc_window_params);
					}
				));
			}
		});
	}else{
		//prepends Live Chat button in default location in header to left of search box
		$('.search-form .toolbar-search').before(
			liveChatAnchor.clone().bind('click', function() {
			//	cmCreateConversionEventTag("Live Chat","2","Live Chat");
	  			window.open(lc_url, lc_window_name, lc_window_params);
			}
		));
	}
}

$(document).ready(function(){
	//check to see if view should have live chat in header before appending it
	if($.inArray(parseUri(document.location.href).file, arrLiveChatViews) > -1   || $.inArray(parseUri(document.location.href).query, arrLiveChatQStrings) > -1){
		if (_storeId != '40001') {
			appendLiveChatAnchor(null);
		}
	}
	//ARI verbage hack
	if(parseUri(document.location.href).file == 'ARIPartFinderView'){
		$("#ariPartSelectPanel #ariSearchLabel.ariMainTitle").html("Enter a Model and/or Part Number to Perform a Quick Part Search");
	}

	if(parseUri(document.location.href).file == 'ProductFinderView'){//fix default product finder question 1 image
		var defaultPFImage = $("#question-1 span:first input:first").val();
		$("#question-1 span.img-caption").css('background-image','url('+defaultPFImage +')');		
	}
	/* RightNow start */
	$.ajax({
		url: "//troybilt.widget.custhelp.com/euf/rightnow/RightNow.Client.js",
	  	dataType: "script",
	  	success: function(json){
			/* RightNow end */
			MTDProLiveChat.init();
    	}
	});
	
});

Seasonal.buildGrid = function () {
	if($('#seasonal-content').size() > 0) {
		$('#seasonal-content').masonry({
			itemSelector: '.box',
			gutterWidth: 16,
			containerStyle: { position: 'relative' }
		});
		$('#seasonal-content .video h2').each(function () {
			if($(this).text().length > 40) {
				$(this).addClass('small');
			}
		});
	}
};

FormValidation.init = function () {
	//fill in the default values
	FormValidation.defaultValues();
	//make sure it checks everything when the submit btn is clicked
	$('form.validate').on('submit', function (e) {
		if ( ! FormValidation.validate($(this))) { e.preventDefault() }
	});
	//be nice and let people know they typed in valid passwords
	//check valid password
	$('input.password').keyup(function () {
		var field = this;
		!FormValidation.validPassword(field) ? submit_form = false : '';
	});
	//check password confirmation
	$('input.confirm-password').keyup(function () {
		var field = this;
		!FormValidation.confirmPassword(field) ? submit_form = false : '';
	});
	$('p.check.has-warning input[type="checkbox"]').click(function () {
		if($(this).is(":checked")) {
			$(this).siblings('.warning').addClass('hide');
		} else {
			$(this).siblings('.warning').removeClass('hide');
		}
	});
	$('p.check.has-alt-warning input[type="checkbox"]').click(function () {
		if(!$(this).is(":checked")) {
			$(this).siblings('.warning').addClass('hide');
		} else {
			$(this).siblings('.warning').removeClass('hide');
		}
	});
};

FormValidation.defaultValues = function (form) {
	//check for default values and fill in as needed
	$('.default-field-value').each(function (i) {
		$(this).next('input').val($(this).html()).addClass('has-default-value');
	});
	//remove default val on focus
	$('input.has-default-value').focus(function () {
		$(this).val() == $(this).prevAll('.default-field-value').html() ? $(this).val('') : '';
	});
	//put back default val on blur
	$('input.has-default-value').blur(function () {
		$(this).val() == '' ? $(this).val($(this).prevAll('.default-field-value').html()) : '';
	});
};

FormValidation.validate = function (form) {

	var submit_form = true;
	//check all required fields to see if they are either blank or their default values
	$(form).find('.required').each(function () {
		var field = $(this);
		if(field.val() == "" || (field.hasClass('has-default-value') && (field.val() == field.prevAll('.default-field-value').html()))) {
			
	field.addClass('fixme')
		.nextAll('.field-description')
		.addClass('fixme')
		.html(field.prevAll('label').html().replace(':','').replace('(required)','') + ' cannot be blank.');
			submit_form = false;
		} else {
			field.removeClass('fixme').nextAll('.field-description').removeClass('fixme').html('');
		}
	});
	//check valid email addresses
	var email_pattern = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
	$(form).find('input.email').each(function () {
		var field = $(this);
		if(!email_pattern.test(field.val())) {
			submit_form = false;
			field.addClass('fixme').nextAll('.field-description').addClass('fixme').html(field.prevAll('label').html().replace(':','').replace('(required)','') + ' is an invalid email address.');
		} else {
			field.removeClass('fixme').nextAll('.field-description').removeClass('fixme').html('');
		} 
	});	
	//validate comma-separated email list
	$(form).find('textarea.email-list').each(function () {
		var field = $(this);
		var emails = field.val().replace(/\s/g,'').split(',');
		var emails_valid = true;
		$(emails).each(function () {
			if(!email_pattern.test(this)) {
				emails_valid = false;
			}
		});
		if(!emails_valid) {
	    submit_form = false;
	    field.addClass('fixme').nextAll('.field-description').addClass('fixme').html(field.prevAll('label').html().replace(':','').replace('(required)','').replace('Maximum of 5','').replace(/<br\s*[\/]?>/gi,'') + ' contains one or more invalid emails or emails were not comma-separated.');
	   } else if(emails.length > 5) { 
	     submit_form = false;
	    field.addClass('fixme').nextAll('.field-description').addClass('fixme').html(field.prevAll('label').html().replace(':','').replace('(required)','').replace('Maximum of 5','').replace(/<br\s*[\/]?>/gi,'') + ' contains more than 5 email addresses.');
	    } else {
	    field.removeClass('fixme').nextAll('.field-description').removeClass('fixme').html('');
	   }
	});
	//check valid date field entry
	var date_pattern = /^[0-9]{2}\/[0-9]{2}\/[0-9]{4}$/;
	$(form).find('input.date').each(function () {
		var field = $(this);
		if(!date_pattern.test(field.val())) {
			submit_form = false;
			field.addClass('fixme').nextAll('.field-description').addClass('fixme').html(field.prevAll('label').html().replace(':','').replace('(required)','') + ' is an invalid date.');
		} else if(!field.hasClass('fixme')) {
			field.removeClass('fixme').nextAll('.field-description').removeClass('fixme').html('');
		}
	});
	//check valid password
	$(form).find('input.password').each(function () {
		var field = $(this);
		!FormValidation.validPassword(field) ? submit_form = false : '';
	});
	//check password confirmation
	$(form).find('input.confirm-password').each(function () {
		var field = $(this);
		!FormValidation.confirmPassword(field) ? submit_form = false : '';
	});
	return submit_form;
};

//to use for submit and keyup
FormValidation.validPassword = function (field) {
	var submit_form = true;
	var valid_password = /^.*(?=.{6,30})(?=.*\d)(?=.*[a-zA-Z]).*$/;
	if(!valid_password.test(field.val())) {
		submit_form = false;
		field.removeClass('valid').addClass('fixme').nextAll('.field-description').removeClass('valid').addClass('fixme').html('*Password must be 6 or more characters minimum and contain 1 letter and 1 number.');
	} else {
		field.removeClass('fixme').nextAll('.field-description').removeClass('fixme').addClass('valid').html('Password is valid!');
	}
	return submit_form;
};

//to use for submit and keyup
FormValidation.confirmPassword = function (field) {
	var submit_form = true;
	var pw_field = field.closest('form').find('input.password');	
	if(!$(pw_field).hasClass("fixme")) {
		if(field.val() != $(pw_field).val()) {
			submit_form = false;
			field.removeClass('valid').addClass('fixme').nextAll('.field-description').removeClass('valid').addClass('fixme').html('*Confirmation does not match password.');
		} else {
			field.removeClass('fixme').nextAll('.field-description').removeClass('fixme').addClass('valid').html('Passwords match!');
		}
	}	
	return submit_form;
};


ShareBar.init = function() {
	// only add social scripts if share bar is present
	var shareBar = $('.share-bar'), shareBarNum = shareBar.length;
	if (shareBarNum > 0) {
		// load social scripts async so they don't block the page from rendering
	  (function (d, scriptsToInclude) {
	    var homeScript, newScript, n = scriptsToInclude.length, i;
	    for (i = 0; i < n; i = i + 1) {
	      newScript = d.createElement('script');
	      newScript.type = 'text/javascript';
	      newScript.async = true;
	      newScript.src = scriptsToInclude[i];
	      homeScript = d.getElementsByTagName('script')[0];
	      homeScript.parentNode.insertBefore(newScript, homeScript);
	    }
	  }(document, [
	  		'//connect.facebook.net/en_US/all.js#xfbml=1',
	  	  '//platform.twitter.com/widgets.js',
	  	  '//assets.pinterest.com/js/pinit.js',
	  	  '//apis.google.com/js/plusone.js',
	  	  '//platform.linkedin.com/in.js'
	  	])
	  );
	}	
};

function displayColor(index, partNumber, isModal)
	{
	if(isModal)
	{
		//alert( $('#attrValue_modal').val());
		
		var partColor = document.getElementById("attrValue_modal").options[index].title;
		var attrValueId = document.getElementById("attrValue_modal").options[index].id;
		var partNo = document.getElementById('partno_modal');
		var paintedImage = document.imageColor_modal;
		
	}
	else
	{
		var partColor = document.getElementById("attrValue").options[index].title;
		var attrValueId = document.getElementById("attrValue").options[index].id;
		var partNo = document.getElementById('partno');
		var paintedImage = document.imageColor;
	}
		
		
		
		partNo.innerHTML = "Part Number:" + partNumber;
		if(index==0){
			//document.getElementById('imageColor').style.display = "none";
			paintedImage.src = "/wcpics/global/images/painted/empty.gif";
		}else if(attrValueId=="false"){
			//document.getElementById('imageColor').style.display = "none";
			partNo.innerHTML += '-' + partColor;
			paintedImage.src = "/wcpics/global/images/painted/notavailable.jpg";
		}else{
			//document.getElementById('imageColor').style.display = "block";
			partNo.innerHTML += '-' + partColor;
			paintedImage.src = "/wcpics/global/images/painted/" + partColor + ".jpg";
		}
		
		
	
	}
function createCookie(name,value,days) {
	if(days){
		var date = new Date();
		date.setTime(date.getTime()+(days*24*60*60*1000));
		var expires = "; expires="+date.toGMTString();
	}
	else {
		var expires = "";
	}
	document.cookie = name+"="+value+expires+"; path=/";
}
function readCookie(name) {
	var nameEQ = name + "=";
	var ca = document.cookie.split(';');
	for(var i=0;i < ca.length;i++) {
		var c = ca[i];
		while (c.charAt(0)==' ') c = c.substring(1,c.length);
		if (c.indexOf(nameEQ) == 0) return c.substring(nameEQ.length,c.length);
	}
	return null;
}
function eraseCookie(name) {
	createCookie(name,"",-1);
}
function setMTDMobileCookie(useMobile, url){
	if(useMobile){
		createCookie('MTDMobile','mobile=yes',null);
	}else{
		createCookie('MTDMobile','mobile=no',null);
	}
	window.location.replace(url ? url : _homeUrl);
}

function searchFocused (){
	var searchBox = document.getElementById('searchTerm');
	if (searchBox.value == 'search keyword'){
		searchBox.value = '';
	}

	if (searchBox.value =='recherche'){
		searchBox.value = '';
	}
}
function emailFocused(){
	var emailField = document.getElementById('emailField');	
	if (emailField.value == 'enter your email address'){
		emailField.value = '';
	}
	if (emailField.value == 'entrez votre adresse courriel'){
		emailField.value = '';
	}	
}

function searchBlurred (){

}


function validateSearch() {
	  var form  = document.SearchForm;
	  if (form.searchText.value != "") {
	     form.submit();
	   } else {
		   return false;
	   }
	}

Promo.init = function () {
       $('.cta.group').each(function () {
              var offset = Math.floor(($(this).height() - $(this).find('.cta-text:first').outerHeight()) / 2);
              offset > 0 ? $(this).find('.cta-text:first').css('margin-top', offset + 'px') : '';
       });
};


var TROYBILT = (typeof TROYBILT !== 'undefined') ? TROYBILT : {};

(function (troybilt) {
	
	  // validate email signup field		
	troybilt.validEmail = {
	    init: function() {
	      this.submit();
	    },
	    submit: function() {
	      $emailForm.on('submit', function(e) {  
	        var $form = $(this);
	        troybilt.formHelper.resetConfirmation($form);
	        // submit the form via ajax if valid
	        if (troybilt.validEmail.validate($form)) {
	          $.ajax({
	            url: $form.prop('action'),
	            data: troybilt.validEmail.serializeObject($form),
	            dataType: 'json',
	            type: 'POST',
	            headers: { 
	              'Accept': 'application/json',
	              'Content-Type': 'application/json'
	          	}
	          }).done(function(data) {
	        	var message = typeof data.message !== 'undefined' ? data.message : 'We were unable to process your request. Please try again.';
	        	if (data.result == 'failure') {
	        		$emailInput = $form.find('input[type="email"]').first();
	        		troybilt.formHelper.inputInvalid($emailInput);
	        	} else {
	        		troybilt.formHelper.showConfirmation($form, message);
	        	}
	          });
	        }
	        e.preventDefault();
	      });
	    },
	    validate: function($form) {
	      $emailInput = $form.find('input[type="email"]').first();
	      troybilt.formHelper.resetInvalid($emailInput);

	      if (troybilt.formHelper.hasFormValidation()) { // does browser support checkValidity?       
	        if (!$emailInput[0].checkValidity()) { // validate using checkValidity()
	          troybilt.formHelper.inputInvalid($emailInput);
	          return false;
	        } else { // make sure number less than equal to max qty and not 0
	          return true;
	        }
	      } else { // else use own JS to see if valid
	        var enteredEmail = $emailInput.val();
	        var pattern = new RegExp($emailInput.attr('pattern'));
	        if(!pattern.test(enteredEmail)) {
	          troybilt.formHelper.inputInvalid($emailInput);
	          return false;
	        } else { 
	          return true;
	        }
	      }
	    },
	    serializeObject: function($form) {
	    	var obj = {},
	        arr = $form.serializeArray();

		    $.each(arr, function () {
		        if (typeof obj[this.name] !== "undefined") {
		            if (!obj[this.name].push) {
		                obj[this.name] = [obj[this.name]];
		            }
		            obj[this.name].push(this.value || "");
		        } else {
		            obj[this.name] = this.value || "";
		        }
		    });
		
		    return JSON.stringify(obj);
	    }
	  },
	  // helper methods for form validation
	  troybilt.formHelper = {
	    hasFormValidation: function() {
	      return (typeof document.createElement( 'input' ).checkValidity == 'function');
	    },
	    inputInvalid: function($el) {
	      $el.addClass('invalid').focus();
	      $('#' + $el.data('invalid-message')).removeClass('hide');
	    },
	    resetInvalid: function($el) {
	      $el.removeClass('invalid');
	      $('#' + $el.data('invalid-message')).addClass('hide');     
	    },
	    showConfirmation: function($el, message) {
	      $('#' + $el.data('confirmation-message')).addClass('show').text(message);
	    },
	    resetConfirmation: function($el) {
	      $('#' + $el.data('confirmation-message')).removeClass('show').empty();
	    }
	  };
} (TROYBILT));

$(function() {
	$emailForm = $('.email-list-form');
	TROYBILT.validEmail.init();
});

