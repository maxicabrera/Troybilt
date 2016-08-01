
jQuery.fn.jqueryAccordion = function(options){
	var settings = {
		interval	 		: 400,     	// animation time (ms)
		fadeContent			: false,	// content fading
		open				: false, 	// determines if the accordion starts with a item opened
		defaultOpenIndex	: 1,		// index of the item opened
		hideRest			: true,		// EV added: determine if other content should be hidden while one is displayed
		nestColors			: false		// EV added: determine if parent color should be shown in nested headers
	};
	$.extend( settings, options );
	
	var accordion = $(this);
	
	if(settings.open == true){
		$(accordion).children(".accordion-item:nth-child(" + settings.defaultOpenIndex +")").children(".accordion-header").addClass("opened focus");
		$(accordion).children(".accordion-item:nth-child(" + settings.defaultOpenIndex +")").children(".accordion-content").show(0);
	}
	
	/* EV */
	if(settings.nestColors == false) {
		if($(accordion).parent().hasClass("accordion-content")) {
			$(accordion).children(".accordion-item").children(".accordion-header").addClass("focus-nest");
		}
	}
	$(accordion).children(".accordion-item").children(".accordion-header").each(function(){
		if(!$(accordion).parent().hasClass("accordion-content")) { //Top level accordion header
			var anchorId = "Contact_Us_"+$(this).children(".title").text().replace(/[^A-Za-z0-9_-]+/g, "_");
			$(this).wrap('<a href="#" id="'+anchorId+'"></a>');
		}
	});
	
	//Bind the header items (top level which have anchor tags for coremetrics liveview tagging).
	$(accordion).children(".accordion-item").children("a").children(".accordion-header").bind("click", function(e){
		e.preventDefault();
		var attr = $(this).attr('header-anchor');
		if (typeof attr !== 'undefined' && attr !== false) {
		    window.location = attr;
		} else {
			if($(this).parent().siblings(".accordion-content").is(":hidden")){
				if(settings.fadeContent == true && settings.hideRest == true){
					$(accordion).children(".accordion-item").children(".accordion-content").children().animate({opacity: 0}, 0);
				}
				if(settings.hideRest == true) {
					$(accordion).children(".accordion-item").children("a").children(".accordion-header").removeClass("opened focus");
					$(accordion).children(".accordion-item").children(".accordion-content").slideUp(settings.interval);
				}
				$(this).parent().siblings(".accordion-content").slideDown(settings.interval);
				/* EV */
				$(this).addClass("opened");
				if (settings.nestColors == true || (settings.nestColors == false && !$(accordion).parent().parent().hasClass("accordion-content"))) {
					$(this).addClass("focus");
				}
				/* EV */
				if(settings.fadeContent == true){
					var time = 0;
					for(var i = 1; i < $(this).parent().siblings(".accordion-content").children().length + 1; i++){
						$(this).parent().siblings(".accordion-content").children(":nth-child(" + i +")").delay(settings.interval + time).animate({opacity: 1}, 300);
						time = time + 100;
					}
				}
			}
			else{
				$(this).parent().siblings(".accordion-content").slideUp(settings.interval);
				$(this).removeClass("opened focus");
			}
		}
	});
	
	//Bind the lower level header items that don't have anchor tags for coremetrics tagging. Same logic as above but with different parent.
	$(accordion).children(".accordion-item").children(".accordion-header").bind("click", function(e){
		e.preventDefault();
		var attr = $(this).attr('header-anchor');
		if (typeof attr !== 'undefined' && attr !== false) {
		    window.location = attr;
		} else {
			if($(this).siblings(".accordion-content").is(":hidden")){
				if(settings.fadeContent == true && settings.hideRest == true){
					$(accordion).children(".accordion-item").children(".accordion-content").children().animate({opacity: 0}, 0);
				}
				if(settings.hideRest == true) {
					$(accordion).children(".accordion-item").children(".accordion-header").removeClass("opened focus");
					$(accordion).children(".accordion-item").children(".accordion-content").slideUp(settings.interval);
				}
				$(this).siblings(".accordion-content").slideDown(settings.interval);
				/* EV */
				$(this).addClass("opened");
				if (settings.nestColors == true || (settings.nestColors == false && !$(accordion).parent().hasClass("accordion-content"))) {
					$(this).addClass("focus");
				}
				/* EV */
				if(settings.fadeContent == true){
					var time = 0;
					for(var i = 1; i < $(this).siblings(".accordion-content").children().length + 1; i++){
						$(this).siblings(".accordion-content").children(":nth-child(" + i +")").delay(settings.interval + time).animate({opacity: 1}, 300);
						time = time + 100;
					}
				}
			}
			else{
				$(this).siblings(".accordion-content").slideUp(settings.interval);
				$(this).removeClass("opened focus");
			}
		}
	});
	
}