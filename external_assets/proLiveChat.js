/*
 * proactive chat rules for troybilt
 * pop a proactive chat window on ARI Part Finder page
 *  
 * */
var MTDProLiveChat = {};
MTDProLiveChat.isActive = true;
MTDProLiveChat.chatInProgress = false;
MTDProLiveChat.manualsSearchAttempt = 'manualsSearchAttempt';
MTDProLiveChat.partsSearchAttempt = 'partsSearchAttempt';
MTDProLiveChat.ariSearchAttempt = 'ariSearchAttempt';
MTDProLiveChat.timerBasedViews = { partfinder : 30, ARIPartFinderView : 30, OperatorManualPartFinderView : 15, partsandservice : 15};

MTDProLiveChat.init = function () {
	if(MTDProLiveChat.isActive){
		//MTDProLiveChat.eraseNoChatCookie();
		MTDProLiveChat.initModal();
		//MTDProLiveChat.checkReferrer();
		//MTDProLiveChat.checkIfWholeGoodInCart();
		MTDProLiveChat.isATimerBasedView();
		//MTDProLiveChat.initAriOnClickListener();
		//MTDProLiveChat.initOrderPreviewListener();
	}
};
MTDProLiveChat.eraseNoChatCookie = function () {
	eraseCookie('noChat');
};
MTDProLiveChat.initModal = function () {
	if (!($.browser == "msie" && $.browser.version < 7)) {
        var target = "#proactiveChatContainer";
       if ($(target).length){
       var top = $(target).offset().top - parseFloat($(target).css("margin-top").replace(/auto/, 0));
        $(window).scroll(function(event) {
            if (top <= $(this).scrollTop()) {
                $(target).addClass("fixed");
            } else {
                $(target).removeClass("fixed");
            }
        
        });
    }
       }
};
MTDProLiveChat.checkReferrer = function () {
	if(!MTDProLiveChat.chatInProgress){
		var plcDelay = parseUri(document.referrer).queryKey.plc;
		if(plcDelay){
			MTDProLiveChat.popLiveChat(plcDelay);
		}
	}
};
MTDProLiveChat.isATimerBasedView = function () {
	if(!MTDProLiveChat.chatInProgress){
		var views = [];
		jQuery.each(MTDProLiveChat.timerBasedViews, function(name, val) {
	        views.push(name);
	    });
		if($.inArray(parseUri(document.location.href).file.replace(/-/g,''), views) > -1){
			var delay = eval('MTDProLiveChat.timerBasedViews.'+parseUri(document.location.href).file.replace(/-/g,''));
			MTDProLiveChat.popLiveChat(delay);
		}
	}
};
MTDProLiveChat.initOrderPreviewListener = function () {
	if(parseUri(document.location.href).file == 'OrderDisplay'){
		$('#container').mouseleave(function() {
			Shadowbox.open({
	            content: '#orderPreviewExitModal',
	            player: 'inline',
	            height: 450,
	            width: 500,
	            modal: false
	        });
		});
	}
};
MTDProLiveChat.popLiveChat = function (delay) {
	/* 
	 * avatar_image:""
	 * logo_image:"http://www.troybilt.com/wcpics/TroyBiltUS/en_US/images/proactive_chat_logo_troy.jpg"
	*/

    RightNow.Client.Controller.addComponent(
        {
            avatar_image: "/euf/assets/images/avatar2.png",
			label_dialog_header: "Troy-Bilt Live Chat Help",
			label_question: "A Chat Assistant is available to help you find your part. Would you like to chat?",
			label_title: "Do you need help finding a part?",
			logo_image: "/euf/assets/images/TBChat.png",
            min_agents_avail_type: "sessions",
            seconds: delay,
            wait_threshold: 1,
            instance_id: "spac_0",
            div_id: "proactiveChatContainer",
            module: "ProactiveChat",
            type: 2
        },
        "//troybilt.widget.custhelp.com/ci/ws/get"
    );
	MTDProLiveChat.chatInProgress = true;
	//Wrapping buttons around <a> tags for coremetrics tagging.
	var checkExist = setInterval(function() {
		if ($('#proactiveChatContainer button').length) {
			$("#proactiveChatContainer").find("button").each(function(){
				if (!$(this).parent().is("a")) {
					var buttonContent = $(this).html().trim();
					$(this).wrap('<a href="#" id="LiveChat_'+buttonContent+'"></a>');
					$('#proactiveChatContainer').on('click','#LiveChat_'+buttonContent,function(e){
						e.preventDefault();
						//cmCreateManualLinkClickTag('#','LiveChat_'+buttonContent+'',null);
					});
				}
				$(this).css('min-width','0px');
			});
			clearInterval(checkExist);
		}
	}, 100); // check every 100ms
};
MTDProLiveChat.incrementManualsAttempt = function () {
	if(MTDProLiveChat.isActive){
		var manualsCookieVal = readCookie(MTDProLiveChat.manualsSearchAttempt)*1 || 0;
		manualsCookieVal += 1;
		if(manualsCookieVal < 2)
			createCookie(MTDProLiveChat.manualsSearchAttempt,manualsCookieVal,null);
		else if(!MTDProLiveChat.chatInProgress){
			MTDProLiveChat.popLiveChat(1);
			eraseCookie(MTDProLiveChat.manualsSearchAttempt);
		}
	}	
};
MTDProLiveChat.incrementPartsAttempt = function () {
	if(MTDProLiveChat.isActive){
		var partsCookieVal = readCookie(MTDProLiveChat.partsSearchAttempt)*1 || 0;
		partsCookieVal += 1;
		if(partsCookieVal < 2)
			createCookie(MTDProLiveChat.partsSearchAttempt,partsCookieVal,null);
		else if(!MTDProLiveChat.chatInProgress){
			MTDProLiveChat.popLiveChat(1);
			eraseCookie(MTDProLiveChat.partsSearchAttempt);
		}
	}
};
MTDProLiveChat.checkIfWholeGoodInCart = function () {
	var b = ( typeof(_orderContainsWholeGood) !== 'undefined' ) ? _orderContainsWholeGood : false;
	if(MTDProLiveChat.isActive){
		if(!MTDProLiveChat.chatInProgress && b){
			MTDProLiveChat.popLiveChat(1);
		}
	}
};
MTDProLiveChat.checkIfReturningCustomer = function () {
	/**/
};
MTDProLiveChat.incrementAriSearchAttempts = function () {
	if(MTDProLiveChat.isActive){
		var ariCookieVal = readCookie(MTDProLiveChat.ariSearchAttempt)*1 || 0;
		ariCookieVal += 1;
		if(ariCookieVal < 2)
			createCookie(MTDProLiveChat.ariSearchAttempt,ariCookieVal,null);
		else if(!MTDProLiveChat.chatInProgress){
			MTDProLiveChat.popLiveChat(1);
			eraseCookie(MTDProLiveChat.ariSearchAttempt);
		}
	}
};
MTDProLiveChat.initAriOnClickListener = function () {
	if( parseUri(document.location.href).file == 'partfinder' || parseUri(document.location.href).file == 'ARIPartFinderView'){
		$('#arisearch_btnLookup').click(function() {
			MTDProLiveChat.incrementAriSearchAttempts();
		});
	} 
};



