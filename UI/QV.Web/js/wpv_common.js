jQuery.WPV = jQuery.WPV || {}; // Namespace
	
/* Vamtam common javascript effects and scripts */
VideoJS.setupAllWhenReady();

// The equalHeight plugin
jQuery.fn.equalHeight = function() {
	var tallest = 0;
	return this.each(function() {
		var thisHeight = jQuery(this).height();
		if(thisHeight > tallest) {
			tallest = thisHeight;
		}
	}).height(tallest);
};	

// The jQuery.rawContentHandler function
(function($) {
	var readyStarted = false;
	var readyEnded   = false;
	
	// This should be the FIRST ready handler to execute
	$(function() {
		readyStarted = true;
	});
	
	// This should be the LAST ready handler to execute
	$(document).bind("ready", function() {
		readyEnded = true;
	});
	
	$.rawContentHandler = function(cb) {
		if ($.isFunction(cb)) {
			if (!readyStarted) {
				$(function() { 
					$.rawContentHandler(cb);
				});
			}
			else {
				if (!readyEnded) {
					var tgt = $("body")[0];
					cb.call(tgt, tgt.childNodes);
				}
				
				$(window).bind("rawContent", function(e, items) {
					cb.call(e.target, items || e.target.childNodes);
				});
			}
		}
	};
})(jQuery);

(function ($, undefined) {
	
	jQuery.WPV.initJailImages = function( context, filter, speed, callback ) {
		var images = $("img.lazy[data-href]", context || document).not(".jail-started, :animated");
		if (filter) {
			images.filter(filter);
		}
		if (images.length) {
			var prefs = {speed : speed || 1000, timeout: 0};
			if (callback) {
				prefs.callback = callback;
			}
			images.addClass("jail-started").jail(prefs);
		}
		else {
			if (callback) {
				callback();
			}
		}
		images = null;
	};
	
	$(function () {
		$('#feedback.slideout').click(function(e) {
			var wrap = $(this).parent();
			var new_left = (wrap.position().left < 0) ? 0 : -200;
			wrap.animate({
				left: new_left
			}, 400);
			
			e.preventDefault();
		});

		// lazy load images
		// The JAIL plugin is written in such a way that makes an error if it's 
		// applied in empty collection!
		var commonImages = $('img.lazy').not(".portfolios.sortable img, :animated, .wpv-wrapper img");
		if (commonImages.length) {
			commonImages.addClass("jail-started").jail({
				speed: 800
			});
		}
		
		var sliderImages = $('.wpv-wrapper img.lazy');
		if(sliderImages.length) {
			sliderImages.addClass("jail-started").jail({
				speed: 1400,
				event: 'load'
			});
		}

		// lightbox
		$.rawContentHandler(function() {
			$(".colorbox, .lightbox", this)
			.not('.no-lightbox, .size-thumbnail, .cboxElement')
			.each(function() {
				var $link = $(this);
				
				var iframe = $link.attr('data-iframe');

				if (iframe == undefined || iframe == 'false') iframe = false;
				else iframe = true;

				var href = this.href || false;
				var inline = $link.attr('data-inline');
				if (inline == undefined || inline == 'false') {
					inline = false;
				}
				else {
					inline = true;
					href = $link.attr('data-href') || this.href || false;
				}

				var width = $link.attr('data-width');
				if (width == undefined) {
					if (iframe == true || inline == true) width = '80%';
					else width = '';
				}
				var height = $link.attr('data-height');
				if (height == undefined) {
					if (iframe == true || inline == true) height = '80%';
					else height = '';
				}

				var photo = $link.attr('data-photo');
				photo = !(photo == undefined || photo == 'false');

				var close = $link.attr('data-close');
				close = !! (close == undefined || close == 'true');

				$link.colorbox({
					opacity: 0.7,
					innerWidth: width,
					innerHeight: height,
					iframe: iframe,
					inline: inline,
					href: href,
					photo: photo,
					scalePhotos: true,
					maxWidth   : "90%",
					maxHeight  : "90%",
					title: function () {
						var share = '';

						if ($('body').hasClass('cbox-share-facebook')) {
							share += '<iframe src="http://www.facebook.com/plugins/like.php?app_id=222649311093721&amp;href=' + window.location.href + '&amp;send=false&amp;layout=button_count&amp;width=140&amp;show_faces=false&amp;action=like&amp;colorscheme=light&amp;font&amp;height=20" scrolling="no" frameborder="0" style="border:none; overflow:hidden; width:140px; height:20px;" allowTransparency="true"></iframe>';
						}

						if ($('body').hasClass('cbox-share-twitter')) {
							share += '<a href="http://twitter.com/share" class="twitter-share-button" data-count="horizontal">Tweet</a>\
							  <script type="text/javascript" src="http://platform.twitter.com/widgets.js"></script>';
						}

						var title = $link.attr('title') || '';

						return '<div id="cboxShare">' + share + '</div><div id="cboxTextTitle">' + title + '</div>';
					},
					onLoad: function () {
						if (!close) $("#cboxClose").css("visibility", "hidden");
						else $("#cboxClose").css("visibility", "visible");

						$("#colorbox").removeClass('withVideo');
					}
				});
			});
		});
		
		// tabs and accordions
		$('.tabs').tabs().each(function () {
			if (Number($(this).attr('data-delay'))) {
				$(this).tabs('rotate', $(this).attr('data-delay'));
			}
		});
		$('.accordion').accordion({
			autoHeight: false
		});

		$(".toggle_title").click(function () {
			if ($(this).is('.toggle_active')) {
				$(this).removeClass('toggle_active').siblings('.toggle_content').slideUp("fast");
			} else {
				$(this).addClass('toggle_active').siblings('.toggle_content').slideDown("fast");
			}
		}).siblings('.toggle_content.load_hidden').hide();

		// style images (those with hover icon)


		function style_images() {
			$('.image_styled').each(function () {
				$('a', this).append('<div class="icon"></div>');
			});
		}
		style_images();

		// :before and :after fixes for ie7
		if ($.browser.msie && $.browser.version == 7) {
			var ba = '.widget_pages li a';

			$('*').each(function (i) {
				if ($(this)[0].currentStyle['before']) {
					var before = $(this).prepend('<span class="before"></span>').find('span.before');
					before.text($(this)[0].currentStyle['before'].replace(/'/g, ''));
				}

				if ($(this)[0].currentStyle['after']) {
					var after = $(this).append('<span class="after"></span>').find('span.after');
					after.text($(this)[0].currentStyle['after'].replace(/'/g, ''));
				}
			});
		}

		
		// Load More Button
		// ---------------------------------------------------------------------
		$(".load-more").die("click.pagination").live("click.pagination", function(e) {

			// Skip if alredy started
			if ($(this).is(":animated")) {
				return false;
			}
			
			var $currentLink = $(this);
			var $currentList = $currentLink.prev();
			
			var containerSelector = $currentList.is("section.portfolios > ul")
			? "section.portfolios > ul"
			: $currentList.is(".loop-wrapper") 
				? ".loop-wrapper:first"
				: null;

			if (containerSelector) {
				// Start loading indicator
				$(this).addClass("loading").find("> *").animate({opacity: 0});
				
				$.ajax({
					url      : $("a.lm-btn", this).attr("href"),
					dataType : "text",
					success  : function(html) {
						
						var article = $('<div/>').html(
							html.replace(/[\s\S]*?<article\b[^>]*>([\s\S]*)<\/article>[\s\S]*/i, "$1")
						);
						
						var newContainer = $(containerSelector, article);
						if (newContainer.length) {
							
							// get the height to start from
							var startHeight = $currentList.height();
							
							// Append the new items as transparent ones
							var newItems = newContainer.children().css("opacity", 0);
							$currentList.append(newItems);
							
							$currentList.trigger("rawContent", newItems.get());
							
							// Get the final height
							var endHeight = $currentList.height();
							
							// Expand the container 
							$currentList.height(startHeight).animate({ height: endHeight }, 600, "swing", function() {
								$currentList.css("height", "auto").children().animate({opacity: 1}, 1000);
								jQuery.WPV.initHoverFX($currentList);
								
								var newPager = $(".load-more", article);
								
								if (newPager.length) {
									$currentLink.html(newPager.html()).find("> *").animate({opacity: 1}, 600, "linear", function() {
										$currentLink.removeClass("loading");
									});
								}
								else {
									$currentLink.slideUp().remove();
								}
								$(window).trigger("resize").trigger("scroll");
								article = newContainer = startHeight = endHeight = newPager = null;
							});
						}
					}
				});
			}
			return false;
		});
		
		// Prev/Next Pagination
		// ---------------------------------------------------------------------
		$(".next-post a, .prev-post a").live("click.pagination", function(e) {
			// Stop the link but pass the event to it's container to be handled below
			e.preventDefault();
		});
		
		$(".next-post, .prev-post").die("click.pagination").live("click.pagination", function(e) {
			
			var thisContainer = $("#main").find(".page-wrapper:first");
			
			if (thisContainer.css("position") == "static") {
				thisContainer.css("position", "relative");
			}
			
			thisContainer.css("overflow", "hidden").height(thisContainer.height());
			
			$("> a", this).addClass("loading").css({ 
				color : "transparent !important"
			});
			
			var markerStart = "<!-- #main (do not remove this comment) -->";
			var markerEnd = "<!-- / #main (do not remove this comment) -->";
			
			$.ajax({
				url      : $("> a", this).attr("href"),
				dataType : "text",
				success  : function(html) {
					
					var start = html.indexOf(markerStart);
					var end = html.indexOf(markerEnd);
					if (start < 0 || end <= start) {
						return;
					}
					start += markerStart.length;
					
					var startHeight = thisContainer.height();
					
					html = html.substring(start, end); //console.log(html);
					
					var header = $("<div />");
					html = html.replace(/<header\b[\s\S]*?<\/header>/i, function(all) {
						header.html(all);
					});
					
					// Go 3 DIVs deeper
					html = html.replace(/^[\s\S]*?<div\b[^<]+/i, '').replace(/([\s\S]*)<\/div>[\s\S]*?$/i, '$1')
							   .replace(/^[\s\S]*?<div\b[^<]+/i, '').replace(/([\s\S]*)<\/div>[\s\S]*?$/i, '$1')
							   .replace(/^[\s\S]*?<div\b[^<]+/i, '').replace(/([\s\S]*)<\/div>[\s\S]*?$/i, '$1');
							   
					var oldChildren = thisContainer.children();

					var page = $('<div/>').css({
						height : "auto",
						opacity: 0
					}).appendTo(thisContainer).html(html);
					
					$(".page-wrapper:first", page).removeClass("page-wrapper");
					
					var newTitle = $("h1", header).html();
					var newBtns  = $(".prev-next-posts-links", header).html();

					$(".share-btns", page).parent().remove();
					
					page.trigger("rawContent");
					
					var _done = 0;
					function commonCallback() {
						if (++_done == 2) {
							jQuery.WPV.initPortfolioGallery(page);
							$('#commentform').validator();
							setTimeout(function() {
								var endHeight = page.height();
								if (startHeight != endHeight) {
									thisContainer.animate({height: endHeight}, 600, "swing", function() {
										$(window).trigger("scroll").trigger("resize");
									});
								}
							}, 1000);
							$(window).trigger("scroll").trigger("resize");
						}
					}
					
					oldChildren.animate({opacity: 0}, 800, "linear", function() {
						$(this).find("*").unbind().removeData().end().remove();
						commonCallback();
					});

					jQuery.WPV.initHoverFX(page);
					$("header h1").html(newTitle);
					$(".prev-next-posts-links").html(newBtns);
					
					page.animate({opacity : 1}, 1000, "linear", commonCallback);
				}
			});
		});
	});
	
})(jQuery);

