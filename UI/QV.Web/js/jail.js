;(function($){
	var $window = $(window);
	
	// Function that returns true if the image is visible inside the "window" 
	// (or specified container element)
	function _isInTheScreen($img, $ct, optionOffset) {
		$ct = $ct || $window;
		optionOffset = optionOffset || 0;
		var is_ct_window  = $ct[0] === window,
			ct_offset  = (is_ct_window ? { top:0, left:0 } : $ct.offset()),
			ct_top     = ct_offset.top + ( is_ct_window ? $ct.scrollTop() : 0),
			ct_left    = ct_offset.left + ( is_ct_window ? $ct.scrollLeft() : 0),
			ct_right   = ct_left + $ct.width(),
			ct_bottom  = ct_top + $ct.height(),
			img_offset = $img.offset(),
			img_width = $img.width(),
			img_height = $img.height();
		
		return (ct_top - optionOffset) <= (img_offset.top + img_height) &&
			(ct_bottom + optionOffset) >= img_offset.top &&
				(ct_left - optionOffset)<= (img_offset.left + img_width) &&
					(ct_right + optionOffset) >= img_offset.left;
	}
	
	function doLoadSingleImage($img, src, options) {
		$img.css("opacity", 0).attr("src", src).removeClass("loading").addClass("loaded");
		
		$img.delay(500).animate({
			opacity : 1
		}, 
		{
			duration : options.speed, 
			easing   : "linear", 
			queue    : false,
			complete : function() {
				if (options.callbackAfterEachImage) {
					options.callbackAfterEachImage.call(this, $img, options);
				}
				
				if (options.images && options.callback && areAllImagesLoaded(options.images)) {
					options.callback();
				}
			}
		});
	}
	
	function doLoadImages(event) {
		
		$("img.lazy[data-href]").each(function(i, o) {
			var $img = $(o);
			var options = $.extend({
				timeout                : 10,
				effect                 : false,
				speed                  : 400,
				selector               : null,
				offset                 : 0,
				event                  : 'scroll',
				callback               : jQuery.noop,
				callbackAfterEachImage : jQuery.noop,
				placeholder            : false,
				container              : window
			}, $img.data("jailOptions") || {});
			
			if (!event || options.event == event) {
				if (!(/scroll|resize/i).test(options.event) || _isInTheScreen($img)) {
					if (!$img.hasClass("loading")) {
						$img.addClass("loading");
						var img = new Image();
						img.onload = function() { 
							doLoadSingleImage($img, this.src, options);
						};
						img.src = o.getAttribute("data-href");
						o.removeAttribute("data-href");
					}
				}
			}
		});
	}
	
	function areAllImagesLoaded($images) {
		var loaded = true;
		$images.each(function() {
			if (!$(this).hasClass("loaded")) {
				loaded = false;
				return false; // break each()
			}
		});
		return loaded;
	}
	
	$.fn.asynchImageLoader = $.fn.jail = function(options) {
		return $(this).data("jailOptions", $.extend({}, options, { images: this }));
	};
	
	$window.bind("scroll resize load", function(e) { doLoadImages(e.type); });
	
	$(function() {
		setTimeout(function() { doLoadImages("scroll"); }, 10);
	});
	
}(jQuery));