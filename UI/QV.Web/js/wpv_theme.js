jQuery.WPV = jQuery.WPV || {}; // Namespace

(function ($, undefined) {
	
	$(function () {

		// Fullwidth slider is without rounded corners
		/*
		if( ! $(".header-slider-wrapper").hasClass("fullwidth") ) { 
			$(".wpv-wrapper").corner();
		}
		*/
		
		$('#commentform, .searchform').validator();

		$("nav > div > ul > li:last").css("paddingRight", 0);

		$("nav ul li").each(function (i, o) {

			$(this).find("ul").css({
				visibility: "hidden",
				display: "none",
				opacity: 0
			});

			$(this).hover(

			function () {

				$('ul:first', this).stop(1, 1).delay(200).queue(function () {

					if ($(o).is(".hover")) {
						return;
					}

					var submenu = $('ul:first', o);
					var thisOffset = $(o).offset();
					var vw = $(window).width();
					var isFirst = submenu.is("nav > div > ul > li > ul");

					submenu.css({
						visibility: "hidden",
						display: "inline-block"
					});

					$(o).addClass("hover");

					if (thisOffset.left + $(o).outerWidth({margin: true}) + submenu.outerWidth({margin: true}) > vw) {
						submenu.css({
							right: isFirst ? 0 : "100%",
							left: "auto"
						});
					} else {
						submenu.css({
							left: isFirst ? 0 : "100%",
							right: "auto"
						});
					}

					$(this).css({
						opacity: 0,
						visibility: "visible"
					}).animate({
						opacity: 1
					}, 200, "linear").dequeue();
				});
			}, function () {
				$('ul:first', this).stop(1, 0).delay(200).queue(function () {
					$(this).animate({
						opacity: 0
					}, 100, "linear", function () {
						$(this).css({
							display: "none"
						});
						$(o).removeClass("hover");
					}).dequeue();
				});
			});
		});

		$("nav ul li ul li:has(ul)").find("a:first").append(" &raquo; ");

		$('.post-head a img').parent().addClass('a-reset');

		$('.sitemap li:not(:has(.children))').addClass('single');

		var tooltip_animation = 250;
		$('.shortcode-tooltip').hover(function () {
			$(this).find('.tooltip').fadeIn(tooltip_animation).animate({
				bottom: 25
			}, tooltip_animation);
		}, function () {
			$(this).find('.tooltip').animate({
				bottom: 35
			}, tooltip_animation).fadeOut(tooltip_animation);
		});

		// Starts hover effect -------------------------------------------------
		$(".thumbnail .thumbnail-pad, .thumbnail .info-pad").hide();
		
		jQuery.WPV.initHoverFX = function(context) {
			$(".thumbnail:not(.hoverable)", context).each(function(i, thumb) { 
				var $thumb = $(this), 
					$info  = $(".thumbnail-pad, .info-pad", this).css({ opacity : 1}),
					$img   = $("img.lazy", this);
				
				if (!$info.length) {
					return true; // continue
				}
				
				$thumb.addClass("hoverable").css("height", $img.attr("height"));
				
				$img = $("img.lazy", this).width($thumb.width());
				$info.show();
				$info.each(function() { 
					$(this).css({
						marginTop : -$(this).outerHeight()
					})
				});
				
				
				
				$thumb
					.die ("mouseenter.thumbnailHover")
					.live("mouseenter.thumbnailHover", function(e) {
						$info
							.stop(1, 0)
							.delay(200)
							.animate({ marginTop: 0, opacity : 1 }, 400, "easeOutExpo");
						$img
							.stop(1, 0)
							.delay(500)
							.animate({ opacity  : 0.7 }, 400, "linear");
						$thumb.css({ backgroundColor : "#000"});
					})
					.die ("mouseleave.thumbnailHover")
					.live("mouseleave.thumbnailHover", function(e) {
						$info
							.stop(1, 0)
							.delay(100)
							.animate({ marginTop: -$info.height() }, 500, "easeInOutExpo");
						$img
							.stop(1, 0)
							.delay(500)
							.animate({ opacity : 1 }, 400, "linear", function() {
								$thumb.css({ backgroundColor : "transparent"});
							});
					});
			});
		}
		
		$(window).bind("load", function() {
			jQuery.WPV.initHoverFX(document);
		});
		// Ends hover effect ---------------------------------------------------

		// Starts Portfolio ----------------------------------------------------
		jQuery.WPV.initPortFolio = function(context) {
			var portfolioImages = $('.portfolios.sortable', context).not(".jail-started").find("img.lazy");
			if (portfolioImages.length) {
				portfolioImages.addClass("jail-started").jail({
					speed: 1400,
					event: "load",
					callback: function () {
						jQuery.WPV.initHoverFX(portfolioImages);
						setTimeout(function () {
							$(".portfolios.sortable").each(function () {

								var list = $('ul', this);
								var items = $("li", list);
								var links = $('.sort_by_cat a', this);

								list.css({
									width: list.width(),
									height: list.height(),
									position: "relative"
								});

								var places = [];
								items.each(function (i, item) {
									var box = {
										top: item.offsetTop,
										left: item.offsetLeft
									};

									$(this).css(box);

									box.height = $(item).height();
									box.width = $(item).width();

									places.push(box);
								});

								var columns = {
									portfolio_two_columns: 2,
									portfolio_three_columns: 3,
									portfolio_four_columns: 4
								};

								items.css({
									position: "absolute"
								});
								fixRowHeights(items);

								function getNumColumns() {
									for (var c in columns) {
										if (list.hasClass(c)) {
											return columns[c];
										}
									}
									return 1;
								}

								function fixRowHeights(items) {
									var cols = getNumColumns();
									if (cols > 1) {
										var h = 0,
											bottomLine = 0,
											last = items[0];
										items.each(function (j) {
											$(this).css({
												height: "auto"
											});
											h = Math.max(h, $(this).outerHeight());

											$(this).css({
												top: bottomLine
											})

											if ((j + 1) % cols === 0 || j == items.length - 1) {

												$(this).prevUntil(last).andSelf().css({
													height: h,
													marginTop: 0,
													marginBottom: 0
												});

												bottomLine += h + 20;
												h = 0;
												last = this;
											}
										});

									}
								}

								links.each(function (i, link) {

									var cat = $(this).attr('data-value');
									var toShow = cat == 'all' ? items : items.filter('[data-type*=' + cat + ']');
									var toHide = cat == 'all' ? $() : items.not('[data-type*=' + cat + ']');

									$(this).click(function (e) {
										links.removeClass('active');
										$(this).addClass('active');

										var cols = getNumColumns();
										var H = 0,
											L = toShow.length,
											curH = 0,
											$img, bottomLine = 0,
											last = toShow[0];

										toShow.each(function (j) {
											$img = $(this).stop(1, 0).css("zIndex", 2);

											if (!$img.is(":visible")) {
												$img.css({
													opacity: 0,
													display: "block"
												});
											}

											$img.css({
												height: "auto"
											}).data("targetPositionTop", places[j].top);

											curH = Math.max(curH, $img.outerHeight());

											if (cols > 1) {
												if ((j + 1) % cols === 0 || j == L - 1) {
													var coll = $img.prevUntil(last).andSelf();
													if (toShow.index(last) === 0) {
														coll.add(last);
													}
													coll.data("targetPositionTop", bottomLine).css({
														height: curH
													});

													bottomLine += curH + 20;
													curH = 0;
													last = this;
												}
											}
										}).each(function (j) {

											$(this).delay(j * 100).animate({
												opacity: [1, "linear"],
												top: $.data(this, "targetPositionTop"),
												left: places[j].left
											}, 800, "easeInOutExpo", function() {
												$(this).addClass("no-filter");
											});

											H = Math.max(H, places[j].top + $(this).height());
										});

										list.animate({
											height: bottomLine || H
										}, {
											duration : 500 + Math.max(toShow.length, toHide.length) * 100, 
											easing   : "easeInOutExpo", 
											queue    : false,
											complete : function() {
												$(window).trigger("scroll");
											}
										});

										toHide.filter(":visible").each(function (j) {
											$(this).stop(1, 0).delay(j * 100).queue(function() {
												$(this)
												.css({ zIndex: 1 })
												.removeClass("no-filter")
												.animate({ opacity: "hide" }, 800, "linear");
											}).dequeue();
										});

										return false;
									});

								});
							});
						}, 0);
					}
				});
			}
		}
		jQuery.WPV.initPortFolio(document);
		// Ends Portfolio ------------------------------------------------------


		// adds the 'carved' button arrow
		/*
		$('a.button.carved, .button.carved a').append(function () {
			return $('<div></div>').css({
				bottom: -5,
				left: 0,
				right: 0
			}).append(function () {
				return $('<div></div>').css({
					margin: 'auto',
					width: 0,
					height: 0,
					borderLeft: '10px solid transparent',
					borderRight: '10px solid transparent',
					borderBottom: '5px solid #fff'
				});
			});
		});
		*/

		// scroll to top button
		$(window).bind('resize scroll', function () {
			if (window.pageYOffset > 0) $('#scroll-to-top').fadeIn('normal');
			else $('#scroll-to-top').fadeOut('normal');
		});

		$('#scroll-to-top').click(function () {
			$('html,body').animate({
				scrollTop: 0
			}, 300);
		});

		/* header slider */

		function getThumbSrc(dir, slider) {
			var src = "about:blank";
			var nextSlide = slider.wpvSlider(dir == "next" ? "getNextSlide" : "getPreviousSlide");
			if (nextSlide.length) {
				src = nextSlide = nextSlide.find("> .wpv-slide").data("thumb") || "";
			}
			return src;
		}

		function setThumb(dir, slider) {
			var btn = $(dir == "next" ? ".wpv-nav-next" : ".wpv-nav-prev", slider.parent());
			var thumb = btn.find("> img.wpv-preview-thumb");
			var thumbSrc = getThumbSrc(dir, slider);
			if (thumbSrc) {
				if (!thumb.length) {
					thumb = $('<img class="wpv-preview-thumb" />').appendTo(btn);
				}
				thumb.attr("src", thumbSrc).css({
					visibility: "visible"
				});
			} else {
				thumb.css({
					visibility: "hidden"
				});
			}
		}

		$("#header-slider, .slider-shortcode").bind("afterChange sliderload", function () {
			setThumb("next", $(this));
			setThumb("prev", $(this));
		});

		// slide the nav buttons with the navigation-preview design
		$(".style-navigation-preview .wpv-nav-next, .style-gallery .wpv-nav-next").live("mouseenter", function () {
			$(this).stop(1, 0).animate({
				marginLeft: -$(this).outerWidth(),
				opacity: 1
			});
		}).live("mouseleave", function () {
			$(this).stop(1, 0).animate({
				marginLeft: -40,
				opacity: 0.3
			});
		});

		$(".style-navigation-preview .wpv-nav-prev, .style-gallery .wpv-nav-prev").live("mouseenter", function () {
			$(this).stop(1, 0).animate({
				marginRight: -$(this).outerWidth(),
				opacity: 1
			});
		}).live("mouseleave", function () {
			$(this).stop(1, 0).animate({
				marginRight: -40,
				opacity: 0.3
			});
		});

		// helpers for the peek slider design
		$(".style-peek .wpv-nav-next").live("mouseenter", function () {
			$(this).stop(1, 0).animate({
				width: 50
			}, 130);
		}).live("mouseleave", function () {
			$(this).stop(1, 0).animate({
				width: 40
			}, 130);
		});

		$(".style-peek .wpv-nav-prev").live("mouseenter", function () {
			$(this).stop(1, 0).animate({
				marginLeft: 0
			}, 130);
		}).live("mouseleave", function () {
			$(this).stop(1, 0).animate({
				marginLeft: -10
			}, 130);
		});

		$(".style-peek #header-slider").one("sliderload", function (e, slider) {

			$(".wpv-slide-wrapper", slider.view).each(function (i, o) {
				$.data(o, "Slide").getCaption();

				// Click to scroll 
				$(o).click(function () {
					if (!$(o).is(".active")) {
						slider.goTo(i);
						return false;
					}
				})
			});

			$("#header-slider-caption-wrapper").show();
		});

		$(".style-peek #header-slider").one("beforeChange", function (e, slider, slideToShow, slideToHide) {
			var cur = slideToHide || slideToShow;
			var next = cur.next(".wpv-slide-wrapper");
			if (!next.length) {
				next = cur.parent().find(".wpv-slide-wrapper:first");
			}
			next.show().css({
				left: cur.position().left + cur.width() + 20
			});
		});
	}); 
	
	
	// Share buttons -----------------------------------------------------------
	$(".share-btns").css({ overflow: "hidden", left: -70, width: 60 });
	
	$('.real-btns').css({
		right	: "100%",
		zIndex   : 100,
		padding  : 2,
		position : "relative",
		width	: "auto"
	}).show();
	
	$('.fake-btns').css({ right: 0 }).bind("mouseenter", function() {
		$('.real-btns').stop(1, 0).animate({ right: 0 }, 400);
	});
	
	$('.real-btns').bind("mouseleave", function() {
	  $(this).stop(1, 0).animate({ right: "100%" }, 400);
	}).find("iframe").css({
		width: 55,
		height: 140
	});
	
	$(".fake-btns > span").css({
		top: 2,
		right: 2
	});
	
	(function() {
		var btns = $(".share-btns");
		
		if (!btns.length) {
			return;
		}
		
		// Store some data about the initial position
		btns.each(function(i, o) {
			$(o).data("original-offset", {
				styleLeft  : $(o).css("left"),
				left	   : $(o).offset().left,
				offsetTop : $(o).offset().top
			}).css("top", 0);
		});
		
		function _repositionButtons(e) {
			btns.each(function(i, o) {
				var oot = $(o).data("original-offset"), fy = 20;
				if (oot) {
					if (oot.offsetTop < $(window).scrollTop()) {
						if ($(o).css("position") != "fixed") {
							$(o).css({
								left: $(o).offset().left,
								position: "fixed"
							});
						}
						else {
							if ( e && e.type == "resize") {
								$(o).css(
									"left",
									$(o).parent().offset().left + parseFloat(oot.styleLeft)
								);
							}
						}
					}
					else {
						$(o).css({
							position: "absolute",
							left: oot.styleLeft
						});
					}
					
					if ( e && e.type == "resize") {
						oot.offsetTop = $(o).offset().top;
					}
				}
			});		
		}
		
		$(window)
		.unbind("scroll.sharebtns")
		.unbind("resize.sharebtns")
		.bind("scroll.sharebtns resize.sharebtns", _repositionButtons);
		
		_repositionButtons();
	})();
	
	// Portfolio - detail page -------------------------------------------------
	jQuery.WPV.initPortfolioGallery = function(context) {
		$("article.portfolio", context || document).each(function(i, o) {
			var viewer	 = $("> .portfolio_image_wrapper", this),
				thumbs	 = $("> .portfolio_details a.portfolio-small", this);
			
			thumbs.removeClass("lightbox").unbind("click").bind("click.portfolioGallery", function(e) {
				var oldView = $("> a.portfolio_image", viewer).css({ zIndex : 1 }),
					viewWidth  = viewer.innerWidth(),
					viewHeight = viewer.innerHeight();
				var newView = $('<a class="portfolio_image colorbox"/>').attr({
					rel  : this.rel,
					href : this.href,
					title: this.title
				})
				.css({
					position : "absolute",
					display  : "block",
					zIndex   : 3,
					width	: viewWidth,
					height   : viewHeight,
					opacity  : 0,
					top	  : 0,
					left	 : 0
				})
				.append(
					$('<img />').attr({
						alt : $("> img", this).attr("alt")
					})
					.css({
						maxWidth: "100%",
						maxHeight: "100%",
						position : "absolute",
						zIndex : 3,
						left: "50%",
						top : "50%"
					})
				)
				.appendTo(viewer);
				
				$("> img", newView).bind("load error", function(e) {
					$(this).css({
						marginLeft: -this.offsetWidth  / 2,
						marginTop : -this.offsetHeight / 2
					});
					
					oldView.animate({opacity:0}, 400, "linear");
					newView.animate({opacity:1}, 400, "linear", function() {
						newView.css({
							zIndex   : 1,
							position : "relative"
						});
						oldView.unbind().remove();
					});
				}).attr("src", this.href);
				
				return false;
			});
		});
	};
	jQuery.WPV.initPortfolioGallery();
		
	// Internet Explorer fixes -------------------------------------------------
	if ($.browser.msie && $.browser.version == 8) { 
		$('p:empty').hide(); 
		$('p:last-child, ul li:last-child, ol li:last-child, .widget:last-child, .accordion:last-child, .toggle:last-child, .toggle_content:last-child, .main-footer .clearboth.push:last-child').addClass('last');
	}  
 
	// -------------------------------------------------------------------------
	$.rawContentHandler(function() {
		$(".loop-wrapper.news .page-content, .loop-wrapper.split .page-content", this).equalHeight();
	});
	
	$(function() { 
		// Fake buttons fix 
		$(".page-outer-wrapper").append($(".share-btns.vertical")); 
	});
	
})(jQuery);

