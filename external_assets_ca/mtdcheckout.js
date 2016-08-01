// jquery payment plugin
(function(){var e,t,n,r,i,s,o,u,a,f,l,c,h,p,d,v,m,g,y,b=[].slice,w=[].indexOf||function(e){for(var t=0,n=this.length;t<n;t++){if(t in this&&this[t]===e)return t}return-1},E=this;e=jQuery;e.payment={};e.payment.fn={};e.fn.payment=function(){var t,n;n=arguments[0],t=2<=arguments.length?b.call(arguments,1):[];return e.payment.fn[n].apply(this,t)};i=/(\d{1,4})/g;r=[{type:"maestro",pattern:/^(5018|5020|5038|6304|6759|676[1-3])/,format:i,length:[12,13,14,15,16,17,18,19],cvcLength:[3],luhn:true},{type:"dinersclub",pattern:/^(36|38|30[0-5])/,format:i,length:[14],cvcLength:[3],luhn:true},{type:"laser",pattern:/^(6706|6771|6709)/,format:i,length:[16,17,18,19],cvcLength:[3],luhn:true},{type:"jcb",pattern:/^35/,format:i,length:[16],cvcLength:[3],luhn:true},{type:"unionpay",pattern:/^62/,format:i,length:[16,17,18,19],cvcLength:[3],luhn:false},{type:"discover",pattern:/^(6011|65|64[4-9]|622)/,format:i,length:[16],cvcLength:[3],luhn:true},{type:"mastercard",pattern:/^5[1-5]/,format:i,length:[16],cvcLength:[3],luhn:true},{type:"amex",pattern:/^3[47]/,format:/(\d{1,4})(\d{1,6})?(\d{1,5})?/,length:[15],cvcLength:[3,4],luhn:true},{type:"visa",pattern:/^4/,format:i,length:[13,14,15,16],cvcLength:[3],luhn:true}];t=function(e){var t,n,i;e=(e+"").replace(/\D/g,"");for(n=0,i=r.length;n<i;n++){t=r[n];if(t.pattern.test(e)){return t}}};n=function(e){var t,n,i;for(n=0,i=r.length;n<i;n++){t=r[n];if(t.type===e){return t}}};h=function(e){var t,n,r,i,s,o;r=true;i=0;n=(e+"").split("").reverse();for(s=0,o=n.length;s<o;s++){t=n[s];t=parseInt(t,10);if(r=!r){t*=2}if(t>9){t-=9}i+=t}return i%10===0};c=function(e){var t;if(e.prop("selectionStart")!=null&&e.prop("selectionStart")!==e.prop("selectionEnd")){return true}if(typeof document!=="undefined"&&document!==null?(t=document.selection)!=null?typeof t.createRange==="function"?t.createRange().text:void 0:void 0:void 0){return true}return false};p=function(t){var n=this;return setTimeout(function(){var n,r;n=e(t.currentTarget);r=n.val();r=e.payment.formatCardNumber(r);return n.val(r)})};u=function(n){var r,i,s,o,u,a,f;s=String.fromCharCode(n.which);if(!/^\d+$/.test(s)){return}r=e(n.currentTarget);f=r.val();i=t(f+s);o=(f.replace(/\D/g,"")+s).length;a=16;if(i){a=i.length[i.length.length-1]}if(o>=a){return}if(r.prop("selectionStart")!=null&&r.prop("selectionStart")!==f.length){return}if(i&&i.type==="amex"){u=/^(\d{4}|\d{4}\s\d{6})$/}else{u=/(?:^|\s)(\d{4})$/}if(u.test(f)){n.preventDefault();return r.val(f+" "+s)}else if(u.test(f+s)){n.preventDefault();return r.val(f+s+" ")}};s=function(t){var n,r;n=e(t.currentTarget);r=n.val();if(t.meta){return}if(t.which!==8){return}if(n.prop("selectionStart")!=null&&n.prop("selectionStart")!==r.length){return}if(/\d\s$/.test(r)){t.preventDefault();return n.val(r.replace(/\d\s$/,""))}else if(/\s\d?$/.test(r)){t.preventDefault();return n.val(r.replace(/\s\d?$/,""))}};a=function(t){var n,r,i;r=String.fromCharCode(t.which);if(!/^\d+$/.test(r)){return}n=e(t.currentTarget);i=n.val()+r;if(/^\d$/.test(i)&&i!=="0"&&i!=="1"){t.preventDefault();return n.val("0"+i+" / ")}else if(/^\d\d$/.test(i)){t.preventDefault();return n.val(""+i+" / ")}};f=function(t){var n,r,i;r=String.fromCharCode(t.which);if(!/^\d+$/.test(r)){return}n=e(t.currentTarget);i=n.val();if(/^\d\d$/.test(i)){return n.val(""+i+" / ")}};l=function(t){var n,r,i;r=String.fromCharCode(t.which);if(r!=="/"){return}n=e(t.currentTarget);i=n.val();if(/^\d$/.test(i)&&i!=="0"){return n.val("0"+i+" / ")}};o=function(t){var n,r;if(t.meta){return}n=e(t.currentTarget);r=n.val();if(t.which!==8){return}if(n.prop("selectionStart")!=null&&n.prop("selectionStart")!==r.length){return}if(/\d(\s|\/)+$/.test(r)){t.preventDefault();return n.val(r.replace(/\d(\s|\/)*$/,""))}else if(/\s\/\s?\d?$/.test(r)){t.preventDefault();return n.val(r.replace(/\s\/\s?\d?$/,""))}};g=function(e){var t;if(e.metaKey||e.ctrlKey){return true}if(e.which===32){return false}if(e.which===0){return true}if(e.which<33){return true}t=String.fromCharCode(e.which);return!!/[\d\s]/.test(t)};v=function(n){var r,i,s,o;r=e(n.currentTarget);s=String.fromCharCode(n.which);if(!/^\d+$/.test(s)){return}if(c(r)){return}o=(r.val()+s).replace(/\D/g,"");i=t(o);if(i){return o.length<=i.length[i.length.length-1]}else{return o.length<=16}};m=function(t){var n,r,i;n=e(t.currentTarget);r=String.fromCharCode(t.which);if(!/^\d+$/.test(r)){return}if(c(n)){return}i=n.val()+r;i=i.replace(/\D/g,"");if(i.length>6){return false}};d=function(t){var n,r,i;n=e(t.currentTarget);r=String.fromCharCode(t.which);if(!/^\d+$/.test(r)){return}i=n.val()+r;return i.length<=4};y=function(t){var n,i,s,o,u;n=e(t.currentTarget);u=n.val();o=e.payment.cardType(u)||"unknown";if(!n.hasClass(o)){i=function(){var e,t,n;n=[];for(e=0,t=r.length;e<t;e++){s=r[e];n.push(s.type)}return n}();n.removeClass("unknown");n.removeClass(i.join(" "));n.addClass(o);n.toggleClass("identified",o!=="unknown");return n.trigger("payment.cardType",o)}};e.payment.fn.formatCardCVC=function(){this.payment("restrictNumeric");this.on("keypress",d);return this};e.payment.fn.formatCardExpiry=function(){this.payment("restrictNumeric");this.on("keypress",m);this.on("keypress",a);this.on("keypress",l);this.on("keypress",f);this.on("keydown",o);return this};e.payment.fn.formatCardNumber=function(){this.payment("restrictNumeric");this.on("keypress",v);this.on("keypress",u);this.on("keydown",s);this.on("keyup",y);this.on("paste",p);return this};e.payment.fn.restrictNumeric=function(){this.on("keypress",g);return this};e.payment.fn.cardExpiryVal=function(){return e.payment.cardExpiryVal(e(this).val())};e.payment.cardExpiryVal=function(e){var t,n,r,i;e=e.replace(/\s/g,"");i=e.split("/",2),t=i[0],r=i[1];if((r!=null?r.length:void 0)===2&&/^\d+$/.test(r)){n=(new Date).getFullYear();n=n.toString().slice(0,2);r=n+r}t=parseInt(t,10);r=parseInt(r,10);return{month:t,year:r}};e.payment.validateCardNumber=function(e){var n,r;e=(e+"").replace(/\s+|-/g,"");if(!/^\d+$/.test(e)){return false}n=t(e);if(!n){return false}return(r=e.length,w.call(n.length,r)>=0)&&(n.luhn===false||h(e))};e.payment.validateCardExpiry=function(t,n){var r,i,s,o;if(typeof t==="object"&&"month"in t){o=t,t=o.month,n=o.year}if(!(t&&n)){return false}t=e.trim(t);n=e.trim(n);if(!/^\d+$/.test(t)){return false}if(!/^\d+$/.test(n)){return false}if(!(parseInt(t,10)<=12)){return false}if(n.length===2){s=(new Date).getFullYear();s=s.toString().slice(0,2);n=s+n}i=new Date(n,t);r=new Date;i.setMonth(i.getMonth()-1);i.setMonth(i.getMonth()+1,1);return i>r};e.payment.validateCardCVC=function(t,r){var i,s;t=e.trim(t);if(!/^\d+$/.test(t)){return false}if(r){return i=t.length,w.call((s=n(r))!=null?s.cvcLength:void 0,i)>=0}else{return t.length>=3&&t.length<=4}};e.payment.cardType=function(e){var n;if(!e){return null}return((n=t(e))!=null?n.type:void 0)||null};e.payment.formatCardNumber=function(e){var n,r,i,s;n=t(e);if(!n){return e}i=n.length[n.length.length-1];e=e.replace(/\D/g,"");e=e.slice(0,+i+1||9e9);if(n.format.global){return(s=e.match(n.format))!=null?s.join(" "):void 0}else{r=n.format.exec(e);if(r!=null){r.shift()}return r!=null?r.join(" "):void 0}}}).call(this);

/*!
 * hoverIntent r7 // 2013.03.11 // jQuery 1.9.1+
 * http://cherne.net/brian/resources/jquery.hoverIntent.html
 *
 * You may use hoverIntent under the terms of the MIT license.
 * Copyright 2007, 2013 Brian Cherne
 */
(function(e){e.fn.hoverIntent=function(t,n,r){var i={interval:100,sensitivity:7,timeout:0};if(typeof t==="object"){i=e.extend(i,t)}else if(e.isFunction(n)){i=e.extend(i,{over:t,out:n,selector:r})}else{i=e.extend(i,{over:t,out:t,selector:n})}var s,o,u,a;var f=function(e){s=e.pageX;o=e.pageY};var l=function(t,n){n.hoverIntent_t=clearTimeout(n.hoverIntent_t);if(Math.abs(u-s)+Math.abs(a-o)<i.sensitivity){e(n).off("mousemove.hoverIntent",f);n.hoverIntent_s=1;return i.over.apply(n,[t])}else{u=s;a=o;n.hoverIntent_t=setTimeout(function(){l(t,n)},i.interval)}};var c=function(e,t){t.hoverIntent_t=clearTimeout(t.hoverIntent_t);t.hoverIntent_s=0;return i.out.apply(t,[e])};var h=function(t){var n=jQuery.extend({},t);var r=this;if(r.hoverIntent_t){r.hoverIntent_t=clearTimeout(r.hoverIntent_t)}if(t.type=="mouseenter"){u=n.pageX;a=n.pageY;e(r).on("mousemove.hoverIntent",f);if(r.hoverIntent_s!=1){r.hoverIntent_t=setTimeout(function(){l(n,r)},i.interval)}}else{e(r).off("mousemove.hoverIntent",f);if(r.hoverIntent_s==1){r.hoverIntent_t=setTimeout(function(){c(n,r)},i.timeout)}}};return this.on({"mouseenter.hoverIntent":h,"mouseleave.hoverIntent":h},i.selector)}})(jQuery);

// simple refresh method
$.fn.refresh = function() {
  return $(this.selector);
};

var mtdcheckout = (typeof mtdcheckout !== 'undefined') ? mtdcheckout : {};

(function (mtdco) {
  mtdco.promotionCode = {
    dom : {
      FORM: $('#promoCode'),
      FIELDS: $('#promotion-code-fields'),
      ALL_FIELDS: $('#promotion-code-fields *'),
      ERROR_FIELD: $('#promotion-code-fields .field-valid')
    },
    init : function() {
      this.toggleFields();
    },
    toggleFields : function () {
      var promotionCode = mtdco.promotionCode.dom.FORM;
      var promotionCodeFields = mtdco.promotionCode.dom.FIELDS;
      if(promotionCode.length > 0) {
        promotionCode.focus(function () {
          promotionCodeFields.addClass('focused');
        });
        $(document).click(function(e){
          var target = $(e.target);
          if (target.is(mtdco.promotionCode.dom.FIELDS) || target.is(mtdco.promotionCode.dom.ALL_FIELDS)) {
            return;
          }
          promotionCodeFields.removeClass('focused').find('input').blur().removeClass('invalid');
          mtdco.promotionCode.dom.ERROR_FIELD.removeClass('error').removeClass('valid');
        });
      }
    }
  },
  mtdco.shipping = {
		    dom: {
		      SHIPPING_METHOD: $('.shipping-method'),
		      CURR_SHIPPING: $('#order-shipping'),
		      CURR_DISCOUNT: $('.discount > span:nth-child(1)'),
		      CURR_SHIPADJ: $('#shipping-discount'),
		      CURR_TOTAL: $('#order-total'),
		      CURR_SUBTOTAL: $('.subtotal .amount'),
		      CURR_ESD: $('#estShipDate'),
		      CURR_EDD: $('#estDeliveryDate'),
		      CURR_DESC: $('#shippingModeDescription'),
		      CURR_TAX: $('#order-tax'),
		      NEXT_DAY_ALERT: $('.alert.next-day'),
		      CREATE_ACCOUNT: $('.create-account'),
		      OPTIONAL_REGISTRATION: $('#optional-registration'),
		      PASSWORD: $('#secure-password')
		    },
		    idtext: {
		      NEXT_DAY: 'shipping-method-NEXTDAY',
		      SECOND_DAY: 'shipping-method-SECONDDAY',
		      GROUND: 'shipping-method-GROUND'
		    },
		    init : function() {
		      this.setShippingMethod();
		      this.toggleCreateAccount();
		    },
		    setShippingMethod : function() {
		      var shippingMethod = mtdco.shipping.dom.SHIPPING_METHOD;     
		      if (shippingMethod.length > 0) {
		    	  
		    	var currTax = mtdco.shipping.dom.CURR_TAX.text().replace('$','');
		    	currTax = parseFloat(currTax);
		    	  
		        var currShippingCost = mtdco.shipping.dom.CURR_SHIPPING.text().replace('$','');
		        currShippingCost = parseFloat(currShippingCost);
		        
		        var orderDiscountAmount = mtdco.shipping.dom.CURR_DISCOUNT.text();
		        orderDiscountAmount = orderDiscountAmount.replace('$','');
		        orderDiscountAmount = orderDiscountAmount.replace('-','');
		        if(orderDiscountAmount == null || typeof(orderDiscountAmount) == 'undefined' || isNaN(orderDiscountAmount) || orderDiscountAmount == ''){
		        	orderDiscountAmount = parseFloat(0.00);
		        }else{
		        	orderDiscountAmount = parseFloat(orderDiscountAmount);
		        }
		        
		        var currShippingDiscount = mtdco.shipping.dom.CURR_SHIPADJ.data('shipdiscount');
		        if(currShippingDiscount == null || typeof(currShippingDiscount) == 'undefined'){
		        	currShippingDiscount = parseFloat(0.00);
		        }else{
		        	currShippingDiscount = currShippingDiscount.replace('-','');
		        	currShippingDiscount = currShippingDiscount.replace('$','');
		        	currShippingDiscount = parseFloat(currShippingDiscount);
		        }
		        
		        var currTotalCost = mtdco.shipping.dom.CURR_SUBTOTAL.text().replace(',','');
		        currTotalCost = currTotalCost.replace('$','');
		        currTotalCost = parseFloat(currTotalCost);
		        
		        //set default esd & edd after page load:
		        var defaultESD = $('input:radio:checked', shippingMethod).data('esd');
		        var defaultEDD = $('input:radio:checked', shippingMethod).data('edd');
		        var defaultDESC = $('input:radio:checked', shippingMethod).data('desc');
		        
		        var defaultShippingCost = $('input:radio:checked', shippingMethod).data('cost');
		        if(defaultShippingCost != null && typeof(defaultShippingCost) !== 'undefined'){
		        	defaultShippingCost = defaultShippingCost.replace('$','');
		        	defaultShippingCost = parseFloat(defaultShippingCost);
		        }
		        
		        var defaultShippingDiscount = $('input:radio:checked', shippingMethod).data('discount');
		        if(defaultShippingDiscount != null && typeof(defaultShippingDiscount) !== 'undefined'){
		        	defaultShippingDiscount = defaultShippingDiscount.replace('$','');
		        	defaultShippingDiscount = defaultShippingDiscount.replace('-','');
		        	defaultShippingDiscount = defaultShippingDiscount.replace('(','');
		        	defaultShippingDiscount = defaultShippingDiscount.replace(')','');
		        	defaultShippingDiscount = parseFloat(defaultShippingDiscount);
		        }else{
		        	defaultShippingDiscount = parseFloat(0.00);
		        }
		        
		        if(defaultESD != null && typeof(defaultESD) !== 'undefined'){
		        	mtdco.shipping.dom.CURR_ESD.val(defaultESD);
		        }
		        
		        if(defaultEDD != null && typeof(defaultEDD) !== 'undefined'){
		        	mtdco.shipping.dom.CURR_EDD.val(defaultEDD);
		        }
		        
		        if(defaultDESC != null && typeof(defaultDESC) !== 'undefined'){
		        	mtdco.shipping.dom.CURR_DESC.val(defaultDESC);
		        }
		        
		        /*alert('orderDiscountAmount:'+orderDiscountAmount);
		        alert('currShippingDiscount:'+currShippingDiscount);
		        alert('defaultShippingDiscount:'+defaultShippingDiscount);
		        alert('display discount:'+(((orderDiscountAmount - currShippingDiscount) + defaultShippingDiscount)).toFixed(2));
		        
		        alert('currTotalCost:'+currTotalCost);
		        alert('currShippingCost:'+currShippingCost);
		        alert('currShippingDiscount:'+currShippingDiscount);
		        alert('defaultShippingCost:'+defaultShippingCost);
		        alert('display total:'+(((currTotalCost - currShippingCost + currShippingDiscount) + defaultShippingCost) - ((orderDiscountAmount - currShippingDiscount) + defaultShippingDiscount)).toFixed(2));*/
		        
		        if(defaultShippingCost != null && typeof(defaultShippingCost) !== 'undefined'){
		        	mtdco.shipping.dom.CURR_DISCOUNT.text('-$'+(((orderDiscountAmount - currShippingDiscount) + defaultShippingDiscount)).toFixed(2));
		        	mtdco.shipping.dom.CURR_SHIPADJ.data('shipdiscount',(defaultShippingDiscount).toFixed(2));
		        	mtdco.shipping.dom.CURR_SHIPPING.text('$'+defaultShippingCost.toFixed(2));
		            //mtdco.shipping.dom.CURR_TOTAL.text('$'+(((currTotalCost - currShippingCost + currShippingDiscount) + defaultShippingCost) - ((orderDiscountAmount - currShippingDiscount) + defaultShippingDiscount) + currTax).toFixed(2).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ","));
					mtdco.shipping.dom.CURR_TOTAL.text('$'+(currTotalCost + defaultShippingCost - orderDiscountAmount - currShippingDiscount + currTax).toFixed(2).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ","));

		        }
		        
		        //Onload show/hide expidited alert as needed
		        var selectedId = $('input:radio:checked', shippingMethod).attr('id');
		        if(selectedId != null && typeof(selectedId) !== 'undefined'){
		        	if (selectedId === mtdco.shipping.idtext.NEXT_DAY || selectedId === mtdco.shipping.idtext.SECOND_DAY || selectedId === mtdco.shipping.idtext.GROUND) {
		        		mtdco.shipping.dom.NEXT_DAY_ALERT.addClass('show');
		            }else {
		              mtdco.shipping.dom.NEXT_DAY_ALERT.removeClass('show');
		            }
		        }else{
		        	mtdco.shipping.dom.NEXT_DAY_ALERT.removeClass('show');
		        }
		        
		        $('input', shippingMethod).on('change', function(e) {
		        	if ($('#ShopCartForm').length) { //If we are on the review and place order page, force an update of the cart on shipping change
		        		$('body').css('opacity','0.4');
		        		$('#ShopCartForm').find('input[name=shipModeId]').val($(this).val());
		        		$('#ShopCartForm').submit();
		        	}
		        	var currShippingCost = mtdco.shipping.dom.CURR_SHIPPING.text().replace('$','');
			        currShippingCost = parseFloat(currShippingCost);
		        	var orderDiscountAmount = mtdco.shipping.dom.CURR_DISCOUNT.text();
			        orderDiscountAmount = orderDiscountAmount.replace('$','');
			        orderDiscountAmount = orderDiscountAmount.replace('-','');
			        if(orderDiscountAmount == null || typeof(orderDiscountAmount) == 'undefined' || isNaN(orderDiscountAmount) || orderDiscountAmount == ''){
			        	orderDiscountAmount = parseFloat(0.00);
			        }else{
			        	orderDiscountAmount = parseFloat(orderDiscountAmount);
			        }
			        var currShippingDiscount = mtdco.shipping.dom.CURR_SHIPADJ.data('shipdiscount');
			        if(currShippingDiscount == null || typeof(currShippingDiscount) == 'undefined'){
			        	currShippingDiscount = parseFloat(0.00);
			        }else{
			        	currShippingDiscount = currShippingDiscount.replace('-','');
			        	currShippingDiscount = currShippingDiscount.replace('$','');
			        	currShippingDiscount = parseFloat(currShippingDiscount);
			        }
			        var currTotalCost = mtdco.shipping.dom.CURR_SUBTOTAL.text().replace(',','');
			        currTotalCost = currTotalCost.replace('$','');
			        currTotalCost = parseFloat(currTotalCost);
		          var newShippingCost = $(this).data('cost').replace('$','');
		          newShippingCost = parseFloat(newShippingCost);
		          
		          var discountAttr = $(this).attr('data-discount');
		          var newShippingDiscount = 0.0;
		          if (typeof discountAttr !== typeof undefined && discountAttr !== false) {
		        	  newShippingDiscount = $(this).data('discount').replace('$','');
			          newShippingDiscount = newShippingDiscount.replace('-','');
			          newShippingDiscount = newShippingDiscount.replace('(','');
			          newShippingDiscount = newShippingDiscount.replace(')','');
			          newShippingDiscount = parseFloat(newShippingDiscount);
		          }
		          var newShippingESD = $(this).data('esd');
		          var newShippingEDD = $(this).data('edd');
		          var newShippingDESC = $(this).data('desc');
		          
		          mtdco.shipping.dom.CURR_DISCOUNT.text('-$'+(((orderDiscountAmount - currShippingDiscount) + newShippingDiscount)).toFixed(2));
		          mtdco.shipping.dom.CURR_SHIPADJ.data('shipdiscount',(newShippingDiscount).toFixed(2));
		          mtdco.shipping.dom.CURR_SHIPPING.text('$'+newShippingCost.toFixed(2));
		          //mtdco.shipping.dom.CURR_TOTAL.text('$'+((((currTotalCost + orderDiscountAmount) - currShippingCost + currShippingDiscount) + newShippingCost) - ((((orderDiscountAmount - currShippingDiscount) + newShippingDiscount))) + currTax).toFixed(2).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ","));
				  mtdco.shipping.dom.CURR_TOTAL.text('$'+(currTotalCost - orderDiscountAmount + currShippingDiscount + newShippingCost - currShippingDiscount + newShippingDiscount + currTax).toFixed(2).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ","));

		          mtdco.shipping.dom.CURR_ESD.val(newShippingESD);
		          mtdco.shipping.dom.CURR_EDD.val(newShippingEDD);
		          mtdco.shipping.dom.CURR_DESC.val(newShippingDESC);
		          
		          if ($(this).attr('id') === mtdco.shipping.idtext.NEXT_DAY || $(this).attr('id') === mtdco.shipping.idtext.SECOND_DAY || $(this).attr('id') === mtdco.shipping.idtext.GROUND) {
		        	  mtdco.shipping.dom.NEXT_DAY_ALERT.addClass('show');
		          }else {
		            mtdco.shipping.dom.NEXT_DAY_ALERT.removeClass('show');
		          }
		          
		        });
		      }
		    },
		    toggleCreateAccount : function() {
		      mtdco.shipping.dom.CREATE_ACCOUNT.on('click', function(e) {
		      mtdco.shipping.dom.OPTIONAL_REGISTRATION.toggleClass('expanded');
		      mtdco.shipping.dom.PASSWORD.focus();
		      })
		    }
		  },
  mtdco.ziplookup = {
    dom : {
      ZIP: $('#zip'),
      CITY: $('#city'),
      STATE: $('#state'),
      CITY_VALID: $('#valid-city'),
      STATE_VALID: $('#valid-state'),
      LOADING: $('#ziplookup')
    },
    service : {
      URL: $.protocolServerNameAndContextRoot + '/AjaxAddressLookup' + $.standardQueryStringParams
    },
    init : function() {
      this.findCityState();
    },
    findCityState : function() {
      var zip = mtdco.ziplookup.dom.ZIP;
      var countryAbbr = "US";
      if (zip.attr("countryabbr")) {
    	  countryAbbr = zip.attr("countryabbr");
      }
      if (zip.length > 0) {
        var loading =  mtdco.ziplookup.dom.LOADING;
        mtdco.ziplookup.dom.ZIP.on('keyup change', function(e) {
          var zipValue = zip.val().replace(/ /g,'').toLowerCase();
          if ((countryAbbr == "US" && ((zipValue.length === 5) && (mtdco.ziplookup.isInt(zipValue)))) ||
        		  (countryAbbr == "CA" && (zipValue.length === 6))) {
            loading.addClass('show');
            var request = $.get(mtdco.ziplookup.service.URL + '&postalCode='+zipValue+'&country='+countryAbbr, function(data) {
              if(typeof(data) !== 'undefined' && data != null && data.indexOf(zipValue) !== -1){
            	  var response = $.parseJSON(data);
	              mtdco.ziplookup.dom.CITY_VALID.removeClass('error').addClass('valid');
	              mtdco.ziplookup.dom.STATE_VALID.removeClass('error').addClass('valid');
	              mtdco.ziplookup.dom.CITY.val(response.city).removeClass('invalid');
	              
	              mtdco.ziplookup.dom.STATE.removeClass('invalid').find('option').removeAttr('selected');
	              var state = mtdco.ziplookup.dom.STATE.find('option[value="' + response.state + '"]').text();
	              
	              /* EV adding for TroyBilt/Cub user registration.*/
	              if ($('#shipping-form').length == 0) {
	            	  mtdco.ziplookup.dom.STATE.find('option[value="' + response.state + '"]').attr('selected','selected');
	              }
	              /* EV */
	              
	              mtdco.ziplookup.dom.STATE.siblings('.custom.dropdown').find('li').filter(function() {
	                return $(this).text().toLowerCase() == state.toString().toLowerCase();
	               }).trigger('click');
	              Foundation.libs.forms.refresh_custom_select(mtdco.ziplookup.dom.STATE, true);
              }
              loading.removeClass('show');
            })
            .fail(function() {
              loading.removeClass('show');
            });
          }
        });
      }
    },
    isInt : function(value) {
      if ((parseFloat(value) == parseInt(value)) && !isNaN(value)) {
        return true;
      } else { 
        return false;
      } 
    }
  },
  mtdco.phonefocus = {
    dom : {
      PHONE1: $('#phone'),
      PHONE2: $('#phone2'),
      PHONE3: $('#phone3'),
      COMPLETE_NUM: $('#phone-complete'),
      INPUT_CLASS: $('.field-phone')
    },
    init : function() {
      this.advance();
      this.fillPhoneParts();
    },
    advance : function() {
      var phone1 = mtdco.phonefocus.dom.PHONE1;
      if (phone1.length > 0) {
        var phone2 = mtdco.phonefocus.dom.PHONE2;
        var phone3 = mtdco.phonefocus.dom.PHONE3;
        this.focusEl(phone1, phone2);
        this.focusEl(phone2, phone3);
        this.setFullPhoneNum();
        this.autofillPhone();
      }
    },
    focusEl : function(elCurrent, elFocus) {
      elCurrent.keyup(function() {
        if (elCurrent.val().length === 3) {
          elFocus.focus();
        }
      });
    },
    setFullPhoneNum : function() {
      this.dom.INPUT_CLASS.blur(function() {
        var fullNumber = mtdco.phonefocus.dom.PHONE1.val() + mtdco.phonefocus.dom.PHONE2.val() + mtdco.phonefocus.dom.PHONE3.val()
        mtdco.phonefocus.dom.COMPLETE_NUM.val(fullNumber);
      })
    },
    autofillPhone : function () {
      if(mtdco.phonefocus.dom.PHONE3.size() > 0 && mtdco.phonefocus.dom.PHONE3.val() != '' ) {
        var fullNumber = mtdco.phonefocus.dom.PHONE1.val() + mtdco.phonefocus.dom.PHONE2.val() + mtdco.phonefocus.dom.PHONE3.val()
        mtdco.phonefocus.dom.COMPLETE_NUM.val(fullNumber);
      }
    },
    fillPhoneParts : function () {
    	if(mtdco.phonefocus.dom.COMPLETE_NUM.size() > 0) {
        	var fullNumber = mtdco.phonefocus.dom.COMPLETE_NUM.val().replace(/[^0-9]+/g, '');
            mtdco.phonefocus.dom.PHONE1.val(fullNumber.substring(0,3));
            mtdco.phonefocus.dom.PHONE2.val(fullNumber.substring(3,6));
            mtdco.phonefocus.dom.PHONE3.val(fullNumber.substring(6,10));
        }
    }
  },
  mtdco.payment = {
    dom : {
      FORM: $('#payment-form'),
      CARD_NUM: $('#card-number'),
      CARD_NUMBER: $('#cardNumber'),
      LAST_FOUR: $('#lastFour'),
      EXP_DATE: $('#expiration-date'),
      EXP_MONTH: $('#cardExpiryMonth'),
      EXP_YEAR: $('#cardExpiryYear'),
      CARD_BRAND: $('#cardBrand'),
      SECURITY_CODE: $('#security-code')
    },
    init : function() {
      var paymentForm = mtdco.payment.dom.FORM;
      if (paymentForm.length > 0) {
        this.cardNumber();
        this.expirationDate();
        this.securityCode();
      }     
    },
    cardNumber : function() {
      var cardNumber = this.dom.CARD_NUM;
      cardNumber.payment('formatCardNumber');
    },
    expirationDate : function() {
      var expDate = this.dom.EXP_DATE;
      expDate.payment('formatCardExpiry');
    }, 
    securityCode : function() {
      var securityCode = this.dom.SECURITY_CODE;
      securityCode.payment('formatCardCVC');
    } 
  },
  mtdco.validate = {
    dom : {
      REQUIRED_FORM: $('form.validate'),
      REQUIRED_INPUT: $('form.validate input[required], form.validate input[pattern]'),
      MATCH_INPUT : $('[data-match]'),
      REQUIRED_SELECT: $('form.validate select[required]'),
      REQUIRED_ALL: $('form.validate input[required], form.validate select[required], form.validate .required-phone'),
      LOGIN_ERROR: $('#secure-options.login-error'),
      LOGIN_EMAIL_FIELD: $('#secure-email'),
      PAGE_ALERT: $('#page-alert'),
      SUBMIT_ONLY_CLASS: '.validate-submit-only'
    },
    init : function() {
      this.dom.REQUIRED_FORM.on('submit', mtdco.validate.perform);
      this.dom.REQUIRED_ALL.not(mtdco.validate.dom.SUBMIT_ONLY_CLASS).on('blur', mtdco.validate.perform);
      this.dom.REQUIRED_SELECT.on('change', mtdco.validate.perform);
      this.dom.REQUIRED_ALL.not(mtdco.validate.dom.SUBMIT_ONLY_CLASS).on('change', mtdco.validate.perform);
      this.dom.REQUIRED_SELECT.on('validate', mtdco.validate.perform);
      this.dom.REQUIRED_FORM.on('toggle','.custom.dropdown', function () {
        if(!$(this).hasClass('open')) {
          $(this).siblings('select[required]').eq(0).trigger('validate');
        }
      });
      this.dom.REQUIRED_INPUT.on('invalid', mtdco.validate.catchInvalid);
      this.dom.LOGIN_ERROR.on('show-message', mtdco.validate.checkLoginError).trigger('show-message');
    },
    refresh : function () {
      for(i in this.dom) {
        if (typeof this.dom[i] !== 'string') {
        this.dom[i] = $(this.dom[i].selector);
      }
      }
      this.init();
    },
    checkLoginError: function () {
      mtdco.validate.dom.LOGIN_EMAIL_FIELD.focus();
    },
    checkPaymentField : function (el) {
      var valid = true;
      switch($(el).data('payment-field')) {
        case "card-number":
          if (!$.payment.validateCardNumber(mtdco.payment.dom.CARD_NUM.val())) {
            valid = false;
          }else{
        	  var cardType = "VISA";
        	  //if valid set the cardBrand hidden input value
        	  var cardNumberClass = mtdco.payment.dom.CARD_NUM.attr("class");
        	  
        	  if(cardNumberClass.indexOf("visa") !== -1){
        		  cardType = "VISA";
        	  }else if(cardNumberClass.indexOf("amex") !== -1){
        		  cardType = "AMEX";
        	  }else if(cardNumberClass.indexOf("discover") !== -1){
        		  cardType = "Discover";
        	  }else if(cardNumberClass.indexOf("mastercard") !== -1){
        		  cardType = "Master Card";
        	  }
        	  mtdco.payment.dom.CARD_BRAND.val(cardType);
        	  var cardNumber = mtdco.payment.dom.CARD_NUM.val().replace(/ /g,'');
        	  var lastFour = cardNumber.substring((cardNumber.length - 4));
        	  mtdco.payment.dom.CARD_NUMBER.val(cardNumber);
        	  mtdco.payment.dom.LAST_FOUR.val(lastFour);
          }
          break;
        case "expiration-date":
          if (!$.payment.validateCardExpiry(mtdco.payment.dom.EXP_DATE.payment('cardExpiryVal'))) {
            valid = false;
          }else{
        	  //if valid exp... set the two part hidden input fields for exp month/year
        	  var expMonth = mtdco.payment.dom.EXP_DATE.val().substring(0,2);
        	  var expYear = mtdco.payment.dom.EXP_DATE.val().substring(5);
        	  if(expYear.length == 2){
        		  expYear = "20"+expYear;
        	  }
        	  mtdco.payment.dom.EXP_MONTH.val(expMonth,"");
        	  mtdco.payment.dom.EXP_YEAR.val(expYear,"");
          }
          break;
        case "security-code":
          if (!$.payment.validateCardCVC(mtdco.payment.dom.SECURITY_CODE.val())) {
            valid = false;
          }
          break;
        default:
          break;
      }
      if (valid) {
        // valid num
        $(el).removeClass('invalid');
        $('#' + $(el).data('valid')).removeClass('error').addClass('valid');
      }else {
        $(el).addClass('invalid');
        if($(el).val() != '') {
          $('#' + $(el).attr('data-valid')).find('.message').html('<span class="field-name">' + $(el).siblings('label').eq(0).text() + '</span> is invalid. Please correct it.');
        }
        $('#' + $(el).data('valid')).removeClass('valid').addClass('error');
      }
      return valid;
    },
    perform : function(e) { 
      var fields = [];
      var errors = 0;
      var blur = false;
      if(this.nodeName.toLowerCase() == "select") {
        blur = true;
        fields.push(this);
      } else if(this.nodeName.toLowerCase() == "input") {
        blur = true;
        if($(this).hasClass('payment-field')) {
          if(!mtdco.validate.checkPaymentField(this)) {
            errors++;
          }
        } 
        else if($(this).hasClass('required-phone')) {
          fields.push(document.getElementById($(this).nextAll('.hidden-phone').eq(0).attr('id')));
        } else {
          fields.push(this);
        }
      } else {
        mtdco.phonefocus.autofillPhone();
        $(this).find('*').each(function () {
          mtdco.validate.hideError(this);
          if(this.hasAttribute('required')) {
            if($(this).hasClass('required-phone')) {
              fields.push(document.getElementById($(this).nextAll('.hidden-phone').eq(0).attr('id')));
            } else if ($(this).hasClass('payment-field')) {
              if(!mtdco.validate.checkPaymentField(this)) {
                errors++;
              }
            } else {
              fields.push(this);
            }
          } else if(this.hasAttribute('pattern') && $(this).val() != ""){
        	fields.push(this);
          }
        });
      }
      $(fields).each(function(i) {
        if (!mtdco.validate.hasValue(this)) {   
          mtdco.validate.showError(this);
          errors++;
        } else {
          mtdco.validate.hideError(this);
          if(mtdco.validate.hascheckValidity() && !this.hasAttribute('pattern')) {
            if(!this.checkValidity()) {
              errors++;
            }
          } else if(this.hasAttribute('pattern')) {
            var pattern = new RegExp($(this).attr('pattern'));
            if(!pattern.test($(this).val())) {
              errors++;
              $(this).trigger('invalid');
            }
          }
        }
      });
      $(mtdco.validate.dom.MATCH_INPUT).each(function(i) {
        if($(this).val() != "" && $(this).val() != $('#' + $(this).data('match')).val() ) {
          $('#' + $(this).data('match')).trigger('invalid');
          errors++;
        }
      });
      if (errors > 0) {
        if(mtdco.validate.dom.PAGE_ALERT.size() > 0 && !blur) {
          mtdco.validate.dom.PAGE_ALERT.empty().html('<div data-alert class="alert-box alert" id="form-submission-alert">Please correct the fields marked in red below.<a href="#" class="close"><i class="icon icon-circle-x"></i></a></div>');
          $("html, body").animate({ scrollTop: mtdco.validate.dom.PAGE_ALERT.offset().top + 'px' });
          
        }
        e.preventDefault();
      }
    },
    hascheckValidity : function() {
      return (typeof document.createElement( 'input' ).checkValidity === 'function');
    },
    hasValue : function(el) {
      var type = el.nodeName.toLowerCase();
      switch(type) {
        case 'select':
          return el.options[el.selectedIndex].value != '';
          break;
        default:
          if ($(el).attr('type') == 'checkbox') {
            return el.checked;
          }else {
            return $(el).val().length > 0; 
          }         
          break;
      }
    },
    catchInvalid : function (e) {
      var el = this;
      var field_type = $(el).attr('type');
      var msgBefore = '<span class="field-name">';
      var msgAfter = '</span> is invalid. Please correct it.';
      var msgEnd = '';
      var msg = el.validationMessage;
      if((msg != 'value missing' && $(el).val() != '' && !$(el).hasClass('payment-field')) ||  ($(el).val() == '' && el.hasAttribute('data-match-target'))) {
        switch(field_type) {
          case 'tel':
          case 'hidden':
            msg = msgBefore + $($('label[for="' + $(el).attr('id') + '"]')).html().replace('*','').replace(':','').replace('.','') + msgAfter;
            break;
          case 'checkbox':
            msg = $('#' + $(el).data('valid')).find('message').html();
            break;
          case 'radio':
        	msg = $('#' + $(el).data('valid')).find('message').html();
        	break;
          default:
            msg = msgBefore +  $(el).siblings('label').eq(0).text().replace('*','').replace(':','').replace('.','') + msgAfter;
            break;
        }
        $('#' + $(el).attr('data-valid')).find('.message').html(msg);
        mtdco.validate.showError(el);
      }
    },
    showError : function(el) {
      var field_error = $(el).attr('data-valid');
      if (field_error) {
        if( $('#' + field_error).prevAll('.custom.dropdown').size() > 0) {
          $('#' + field_error).prevAll('.custom.dropdown').addClass('invalid');
        }
        if( $('#' + field_error).prevAll('.form-input').find('.custom.radio').size() > 0) {
        	$('#' + field_error).prevAll('.form-input').find('.custom.radio').addClass('invalid');
        }
        $('#' + field_error).closest('.form-input').find('input').addClass('invalid');
        $('#' + field_error).removeClass('valid').addClass('error');
        if ($('#' + field_error).is(":hidden")) {
        	$('#' + field_error).css('display','block');
        }
      }
    },
    hideError : function(el) {
      var field_error = $(el).attr('data-valid');
      if (field_error) {
        if($('#' + field_error).prevAll('.custom.dropdown').size() > 0) {
          $('#' + field_error).prevAll('.custom.dropdown').removeClass('invalid');
        }
        if( $('#' + field_error).prevAll('.form-input').find('.custom.radio').size() > 0) {
        	$('#' + field_error).prevAll('.form-input').find('.custom.radio').removeClass('invalid');
        }
        $('#' + field_error).closest('.form-input').find('input').removeClass('invalid');
        $('#' + field_error).removeClass('error').addClass('valid');
      }   
    }
  },
  mtdco.minicart = {
    dom : {
      ADD_MODAL: '#add-to-cart-modal',
      CART_LINK: $('#cart-link'),
      MINI_CART: $('#minicart'),
      CART_TOTAL: $('#mini-cart-total'),
      FORM_TRIGGER: '[data-cart-add]',
      HEADER_WRAPPER: '.top',
      MODAL_CLOSE_TRIGGER: $('.close-modal'),
      MODAL_CLOSE: $('.close-reveal-modal'),
      CART_ITEM_CLASS: '.cart-item',
      HIDE_OVERFLOW_CLASS: 'hide-overflow'
    },
    service : {	
		REFRESH_URI: $.protocolServerNameAndContextRoot + '/QuickCartView' + $.standardQueryStringParams
    },
    init : function() {
     if(typeof mtdco.minicart.setup === 'undefined') {
        mtdco.minicart.setup = true;
        mtdco.minicart.addItem();
     }
      mtdco.minicart.toggleMiniCart();
      mtdco.minicart.dom.MINI_CART.attr('style','');
      mtdco.minicart.dom.MODAL_CLOSE_TRIGGER.click(function (){ mtdco.minicart.dom.MODAL_CLOSE.trigger('click'); return false; });
    },
    refreshDom : function () {
    	for(i in this.dom) {
    		if (typeof this.dom[i] !== 'string') {
    			this.dom[i] = $(this.dom[i].selector);
    		}
    	}
    	this.init();
    },
    toggleMiniCart : function() {
      // handle click or touch
      mtdco.minicart.dom.CART_LINK.hoverIntent(function () {
    	$(this).closest(mtdco.minicart.dom.HEADER_WRAPPER).addClass('tall');
        mtdco.minicart.dom.MINI_CART.removeClass('hide');
      },function () {
    	$(this).closest(mtdco.minicart.dom.HEADER_WRAPPER).removeClass('tall');
        mtdco.minicart.dom.MINI_CART.addClass('hide');
      });      
    },
    addItem : function () {
    	$(document).on('submit',mtdco.minicart.dom.FORM_TRIGGER,function(e) {
        e.preventDefault();
        
        var dataArray = $(this).serializeArray(),
        len = dataArray.length,
        dataObj = {};

	    for (i=0; i<len; i++) {
	      dataObj[dataArray[i].name] = dataArray[i].value;
	      //alert(dataArray[i].name + ' ' + dataArray[i].value);
	    }
	    
	    var isModal = dataObj['isModal'];
	    var isARIModal = dataObj['isARIModal'];
	    var catentryId = dataObj['productId'];
	    var modalUrl = dataObj['URL'];
	    var quantity = dataObj['quantity'];
	    var updateModalOnly = dataObj['updateModalOnly'];
	    if(isNaN(quantity) ||  quantity<=0)
		   {
			   alert("Please enter Quantity");
			   return false;
		   }
	    var toggleElems = {};
		toggleElems.addElemName = $.addToCartSharedDisplayObject.addElemName + catentryId;
		toggleElems.waitElemName = $.addToCartSharedDisplayObject.waitElemName + catentryId;
		
		if(isModal === 'true'){
			toggleElems.addElemName += '_modal';
			toggleElems.waitElemName += '_modal';
			var jqmModalId = '.jqmWindow';
		}
		
		if (updateModalOnly !== 'true') {
			toggleAddAndWaitDisplay(toggleElems);
		}
	    
	    if( typeof(dataObj['categoryId_'+catentryId]) !== 'undefined' && dataObj['categoryId_'+catentryId].length){
			dataObj['categoryId'] = dataObj['categoryId_'+catentryId];
		}else if(typeof(parseUri(document.location.href).queryKey.categoryId) !== 'undefined'){
			dataObj['categoryId'] = parseUri(document.location.href).queryKey.categoryId;
		}
	    
	    if( typeof(dataObj['replacedPartNumber']) !== 'undefined' && dataObj['replacedPartNumber'].length) {
	    	dataObj['comment'] = dataObj['replacedPartNumber'];
		}
	    
	    var url = $(this).attr('action');
		var form_data = $.param(dataObj);
        var addToCart = $.ajax({
           url: url,
           data: form_data,
           type: 'POST',
           dataType: 'html',
           cache: false
        });
        addToCart.done(function(data) {
          if(typeof(data) !== 'undefined' && data !== '' && updateModalOnly === 'true' && (data.indexOf('errorMessageKey') !== -1 || data.indexOf('Generic System Error') !== -1)){
        	  $('#order-button-'+catentryId).hide();
        	  if (data.indexOf('Generic System Error') !== -1) {
        		  $('#order-button-'+catentryId+'-error').html($.addToCartSharedDisplayObject.genericAddToCartErrorMessage);
        	  } else if (data.indexOf('errorMessageKey') !== -1) {
        		  var json = JSON.parse(data);
            	  
            	  var errorMessage = $.addToCartSharedDisplayObject.genericAddToCartErrorMessage;
            	  
            	  if(json.errorMessageKey == '_ERR_INSUFFICIENT_INVENTORY'){
            		  errorMessage = $.addToCartSharedDisplayObject.insufficientInventoryErrorMessage;
            	  }else if(json.errorMessageKey == '_ERR_UNABLE_DECREMENT_INVENTORY'){
            		  errorMessage = 'unable to decrement';
            	  }else if(json.errorMessageKey == '_API_CANT_RESOLVE_FFMCENTER'){
            		  errorMessage = $.addToCartSharedDisplayObject.outOfStockErrorMessage;
            	  }else if(json.errorMessageKey == '_MTD_API_BAD_INV'){
      				var errorMessageParam = json.errorMessageParam;
      				var origMessage = $.addToCartSharedDisplayObject.insufficientInventoryErrorMessage;
      				errorMessage = origMessage.replace('{0}',errorMessageParam[0]).replace('{1}',errorMessageParam[1]);
            	  }
            	  $('#order-button-'+catentryId+'-error').html(errorMessage);
        	  }
        	  $('#order-button-'+catentryId+'-error').show();
        	  setTimeout(function(){
        		  $('#order-button-'+catentryId+'-error').hide();
        		  $('#order-button-'+catentryId).show();
        	  },3000);
          } else if(typeof(data) !== 'undefined' && data !== '' && updateModalOnly === 'true' && data.indexOf('errorMessageKey') === -1){
        	  var json = JSON.parse(data);
        	  $('#total-items-in-cart').html(json.totalItemsInCart+' item(s) in cart');
        	  $('#cart-subtotal').html(json.cartSubTotal);
        	  $('#order-button-'+catentryId).hide();
        	  $('#order-button-'+catentryId+'-confirm').show();
        	  mtdco.minicart.refresh();
        	  setTimeout(function(){
        		  $('#order-button-'+catentryId+'-confirm').hide();
        		  $('#order-button-'+catentryId).show();
        	  },2000);
          } else if(typeof(data) !== 'undefined' && data.indexOf('add-to-cart-modal') !== -1){
        	  if(isModal === 'true' && isARIModal !== 'true'){
            	  $(jqmModalId).jqmHide(); 
              }
        	  if(isModal === 'true' && isARIModal === 'true'){
            	  createCookie("bRefreshCart","true");
            	  window.close();
            	  //note: refresh is done in parent window
              }else{
            	  $('body').find(mtdco.minicart.dom.ADD_MODAL).remove();
    	          $(data).appendTo('body').foundation('reveal', 'open');
    	          mtdco.minicart.refresh();
    	          toggleAddAndWaitDisplay(toggleElems);
    	          mtdco.minicart.refreshDom();
              }
          }else{
        	  if(isModal === 'true' && isARIModal !== 'true'){
            	  $(jqmModalId).jqmHide(); 
              }
        	  if(isModal === 'true' && isARIModal === 'true'){
            	  createCookie("bRefreshCart","true");
            	  createCookie("bRefreshCartError","true");
            	  window.close();
            	  //note: refresh is done in parent window
              }else{
            	  var json = JSON.parse(data);
            	  
            	  var errorMessage = $.addToCartSharedDisplayObject.genericAddToCartErrorMessage;
            	  
            	  if(json.errorMessageKey == '_ERR_INSUFFICIENT_INVENTORY'){
            		  errorMessage = $.addToCartSharedDisplayObject.insufficientInventoryErrorMessage;
            	  }else if(json.errorMessageKey == '_ERR_UNABLE_DECREMENT_INVENTORY'){
            		  errorMessage = 'unable to decrement';
            	  }else if(json.errorMessageKey == '_API_CANT_RESOLVE_FFMCENTER'){
            		  errorMessage = $.addToCartSharedDisplayObject.outOfStockErrorMessage;
            	  }else if(json.errorMessageKey == '_MTD_API_BAD_INV'){
      				var errorMessageParam = json.errorMessageParam;
      				var origMessage = $.addToCartSharedDisplayObject.insufficientInventoryErrorMessage;
      				errorMessage = origMessage.replace('{0}',errorMessageParam[0]).replace('{1}',errorMessageParam[1]);
            	  }
            	  
            	  var modalErrorUrl = modalUrl+'&errorMessage='+errorMessage;
            	  var addToCartError = $.ajax({
                      url: modalErrorUrl,
                      type: 'POST',
                      dataType: 'html',
                      cache: false
                   });
            	  addToCartError.done(function(errorData) {
           	          $('body').find(mtdco.minicart.dom.ADD_MODAL).remove();
           	          $(errorData).appendTo('body').foundation('reveal', 'open');
                   });
            	  
            	  toggleAddAndWaitDisplay(toggleElems);
              }
          }
        });
        addToCart.error(function() {
        	if(isModal === 'true' && isARIModal !== 'true'){
          	  $(jqmModalId).jqmHide(); 
            }
        	if(isModal === 'true' && isARIModal === 'true'){
        	  createCookie("bRefreshCart","true");
          	  createCookie("bRefreshCartError","true");
          	  window.close();
          	  //note: refresh is done in parent window
            }else{
            	var errorMessage = $.addToCartSharedDisplayObject.genericAddToCartErrorMessage;
            	
                var modalErrorUrl = modalUrl+'&errorMessage='+errorMessage;
          	  var addToCartError = $.ajax({
                    url: modalErrorUrl,
                    type: 'POST',
                    dataType: 'html',
                    cache: false
                 });
          	  addToCartError.done(function(errorData) {
         	          $('body').find(mtdco.minicart.dom.ADD_MODAL).remove();
         	          $(errorData).appendTo('body').foundation('reveal', 'open');
                 });
          	  
                toggleAddAndWaitDisplay(toggleElems);
            }
        })
      });
    },
    refresh : function () {
		var brand = '&brand='+$.brand;
		var quickCartUrl = mtdco.minicart.service.REFRESH_URI+brand;
		var refresh = $.ajax({
         url: quickCartUrl,
         type: 'GET',
         dataType: 'html',
         cache: false
      });
      refresh.done(function(data) {
    	var updatedMiniCart = $(data); 
    	if(updatedMiniCart.find(mtdco.minicart.dom.CART_ITEM_CLASS).size() > 3) {
    		mtdco.minicart.dom.MINI_CART.addClass(mtdco.minicart.dom.HIDE_OVERFLOW_CLASS);
    	}
        mtdco.minicart.dom.MINI_CART.html(updatedMiniCart.html());
        mtdco.minicart.dom.CART_TOTAL.html(updatedMiniCart.data('cart-total'));
      });
    }
  },
  mtdco.chat = {
    dom : {
      CHAT_CONTAINER: $('.chat')
    },
    views : {	
		CHAT_VIEWS: new Array("OrderItemDisplay", "OrderItemDisplayView","CheckoutShippingView","CheckoutBillingView", "OrderDisplay")
    },
    init : function() {
    	if($.inArray(parseUri(document.location.href).file, mtdco.chat.views.CHAT_VIEWS) > -1 ){
    		mtdco.chat.appendChatAnchor();
    	}
    },
    appendChatAnchor : function() {
    	var chatAnchor = $(document.createElement("a"))
        .attr({ href: "#cmlivechat"})
        .addClass("btn btn-pri btn-medium-alt")
        .text("Live Chat");
    	
    	chatAnchor.empty().html("<i class='icon icon-chat'></i> Live Chat");
    	
    	if($.brand == 'mtdparts'){
    		var brandChatDomain = 'buymtdonline';
    	}else if($.brand == 'arnold'){
    		var brandChatDomain = 'arnoldparts';
    	}else if($.brand == 'cubcadet'){
    		var brandChatDomain = 'cubcadet';
    	}else if($.brand == 'troybilt'){
    		var brandChatDomain = 'troybilt';
    	}
    	
		$.each(mtdco.chat.dom.CHAT_CONTAINER, function() {
			if( $(this).children('a').size() == 0){
				$(this).append(
					chatAnchor.clone().bind('click', function() {
						//cmCreateConversionEventTag("Live Chat","2","Live Chat");
			  			window.open('http://'+brandChatDomain+'.custhelp.com/app/chat/chat_launch','','toolbar=no,width=500,height=700,scrollbars=yes,location=no');
					}
				));
			}
		});
    }
  },
  mtdco.forgotPassword = {
	  dom : {
	  	FORM: $('.forgot-form'),
	  	LINK: $('.forgot-link a')
	  },
	  init : function() {
		  this.showForm();
	  },
	  showForm : function() {
	  	mtdco.forgotPassword.dom.LINK.on('click', function(e) {
	  		e.preventDefault();
	  		mtdco.forgotPassword.dom.FORM.toggleClass('show');
	  });
	  }
  }
} (mtdcheckout));

$(function() {
  mtdcheckout.promotionCode.init();
  mtdcheckout.shipping.init();
  mtdcheckout.ziplookup.init();
  mtdcheckout.phonefocus.init();
  mtdcheckout.payment.init();
  mtdcheckout.minicart.init();
  mtdcheckout.validate.init();
  mtdcheckout.chat.init();
  mtdcheckout.forgotPassword.init();
});