////////////////////////////////////////////////////////////////////////////////
//                                                                            //
//                          Grid-based Effects                                //
//                                                                            //
////////////////////////////////////////////////////////////////////////////////
(function ($, undefined) {

	function getGrid(cfg) {
		var root = cfg.slider.view;
		var gridLayer = $(".wpv-fx-grid", root);

		if (!gridLayer.length) {
			gridLayer = $('<div class="wpv-fx-grid" />').css({
				width: "100%",
				height: "100%",
				position: "absolute",
				zIndex: 30
			})
			.bind("click", function(e) {
				cfg.slider.getCurrentSlide().trigger(e);
			})
			.appendTo(root);
		} else {
			gridLayer.unbind().empty();
		}

		var facetWidth = Math.ceil($(root).width() / cfg.cols);
		var facetHeight = Math.ceil($(root).height() / cfg.rows);
		var i = 0;
		for (var row = 0; row < cfg.rows; row++) {
			for (var col = 0; col < cfg.cols; col++) {
				var facet = $('<div class="wpv-fx-grid-facet" />').css({
					width: facetWidth,
					height: facetHeight,
					left: col * facetWidth,
					top: row * facetHeight,
					position: "absolute",
					overflow: "hidden",
					zIndex: 30
				}).appendTo(gridLayer);

				facet[0].row = row;
				facet[0].col = col;
				facet[0].facetWidth = facetWidth;
				facet[0].facetHeight = facetHeight;
				facet[0].rows = cfg.rows;
				facet[0].cols = cfg.cols;
				facet[0].index = i++;
			}
		}

		if (cfg.toShow) {
			cfg.toShow.unbind("fxStop").bind("fxStop", function () {
				gridLayer.find("wpv-fx-grid-facet").andSelf().stop(1, 1);
			});
		}

		if (cfg.visibleGrid) {
			var gridMask = $(".wpv-fx-grid-mask", root);
			if (!gridMask.length) {
				gridMask = gridLayer.clone().attr("class", "wpv-fx-grid-mask").css({
					position: "absolute",
					overflow: "hidden",
					width: "100%",
					height: "100%",
					zIndex: 31
				})
				.bind("click", function(e) {
					cfg.slider.getCurrentSlide().trigger(e);
				})
				.appendTo(root);
			} else {
				$(".wpv-fx-grid-mask", root).fadeIn(600);
			}
		}

		return gridLayer;
	}

	function toNum(x, defaultValue) {
		x = parseFloat(x);
		if (isNaN(x)) {
			return defaultValue || 0;
		}
		return x;
	}

	function parseCssPrefs(css, slice) {
		var newCss = {};

		function parse(x) {
			return eval(x.replace(/@(.+?)\b/g, function (a, b) {
				return slice[b];
			}));
		}

		for (var x in css) {
			if ($.isArray(css[x]) && typeof css[x][0] == "string") {
				newCss[x] = [parse(css[x][0]), css[x][1]];
			} else if (String(css[x]).indexOf("@") != -1) {
				newCss[x] = parse(css[x]);
			} else {
				newCss[x] = css[x];
			}
		}
		return newCss;
	}

	function wave(grid, cfg, callback) {
		var cnt = cfg.cols * cfg.rows;
		var waveDuration = Math.max(cfg.waveDuration, cnt);
		var subDelay = Math.floor(waveDuration / cnt);
		var done = 0;
		var img = cfg.toShow.show().find("> img");

		cfg.toShow.show();
		//var top = (toNum(img.css("top")) + toNum(img.css("marginTop"))) - toNum(img.css("marginBottom"));
		//var left = (toNum(img.css("left")) + toNum(img.css("marginLeft"))) - toNum(img.css("marginRight"));
		var top  = Math[$.browser.webkit ? "floor" : "round"]((cfg.toShow.parent().height() - $(img).height())/2);
		var left = Math[$.browser.webkit ? "floor" : "round"]((cfg.toShow.parent().width () - $(img).width ())/2);
		cfg.toShow.hide();

		var facetImage = $('<img src="' + img[0].src + '" />').css({
			width: img[0].style.width,
			height: img[0].style.height
		});

		var _grid = sortGrid(grid, cfg.waveType);

		$.each(_grid, function (i, o) {
			var cssFrom = parseCssPrefs(cfg.cssFrom, o);
			var cssTo = parseCssPrefs(cfg.cssTo, o);
			var facet = $(o);

			facetImage.clone().css({
				marginLeft: left + (o.facetWidth * o.col * -1),
				marginTop: top + (o.facetHeight * o.row * -1)
			}).appendTo(o);

			facet.stop(1, 0).delay(Math.ceil(subDelay * i)).css(cssFrom).animate(cssTo, cfg.subslideDuration, cfg.easing, function () {
				facet.css("filter", "none");
				cssFrom = cssTo = facet = null;
				if (++done >= cnt) {
					callback();
				}
			});
		});

		img = facetImage = null;
	}

	function initGridFx(slider) {
		getGrid($.extend({
			rows: 3,
			cols: 6,
			slider: slider,
			visibleGrid: true
		}, slider.options.effect_settings));
	}

	function runGridFx(cfg) {
		if (cfg.toShow.data("Slide").type == "image") {
			var _cfg = $.extend(true, {
				rows: 3,
				cols: 6,
				subslideDuration: 300,
				subslideTransition: "fade",
				waveDuration: 900,
				waveType: "natural",
				easing: "easeOutQuint",
				cssFrom: {},
				cssTo: {},
				visibleGrid: false
			}, cfg);

			var grid = getGrid(_cfg);

			var w1 = cfg.toHide ? $("> .wpv-slide", cfg.toHide).width() : 0;
			var h1 = cfg.toHide ? $("> .wpv-slide", cfg.toHide).height() : 0;
			var w2 = $("> .wpv-slide", cfg.toShow).width();
			var h2 = $("> .wpv-slide", cfg.toShow).height();
			
			wave(grid, _cfg, function () {
				_cfg.toHide.hide();
				_cfg.toShow.show();
				grid.remove();
				_cfg.callback();
				_cfg = grid = null;
			});
		}

		/*
		 * Grid-based effects does not support content other than images thus we
		 * need to create a pseudo-fx for this cases
		 * (img to html and html to html transitions)
		 */
		else {
			$(".wpv-fx-grid-mask", cfg.slider.view).fadeOut();
			$.WPVSlider.fx.fade.run(cfg);
		}
	}

	function sortGrid(grid, sorter) {
		var slices = $(".wpv-fx-grid-facet", grid).get();
		if (sorter && sorter != "natural") {
			slices.sort(_sorters[sorter]);
		}
		return slices;
	}

	// Grid sorting functions ----------------------------------------------------
	var _sorters = {
		R2L: function (a, b) { // right to left
			return a.col === b.col ? _sorters.T2B(a, b) : a.col < b.col ? 1 : -1;
		},
		R2L_SNAKE: function (a, b) { // right to left - snake
			return a.col === b.col ? _sorters[a.col % 2 == 0 ? "B2T" : "T2B"](a, b) : a.col < b.col ? 1 : -1;
		},
		L2R: function (a, b) { // left to right
			return a.col === b.col ? _sorters.T2B(a, b) : a.col < b.col ? -1 : 1;
		},
		L2R_SNAKE: function (a, b) { // left to right - snake
			return a.col === b.col ? _sorters[a.col % 2 == 0 ? "T2B" : "B2T"](a, b) : a.col < b.col ? -1 : 1;
		},
		B2T: function (a, b) { // bottom to top
			return a.row === b.row ? _sorters.L2R(a, b) : a.row < b.row ? 1 : -1;
		},
		B2T_SNAKE: function (a, b) { // bottom to top - snake
			return a.row === b.row ? _sorters[a.row % 2 == 0 ? "L2R" : "R2L"](a, b) : a.row < b.row ? 1 : -1;
		},
		T2B: function (a, b) { // top to bottom
			return a.row === b.row ? _sorters.L2R(a, b) : a.row < b.row ? -1 : 1;
		},
		T2B_SNAKE: function (a, b) { // top to bottom - snake
			return a.row === b.row ? _sorters[a.row % 2 == 0 ? "L2R" : "R2L"](a, b) : a.row < b.row ? -1 : 1;
		},
		BR2TL: function (a, b) { // bottom/right to top/left
			var x = a.col + a.row;
			var y = b.col + b.row;
			return x === y ? _sorters.B2T(a, b) : x < y ? 1 : -1;
		},
		TL2BR: function (a, b) { // top/left to bottom/right
			var x = a.col + a.row;
			var y = b.col + b.row;
			return x === y ? _sorters.T2B(a, b) : x < y ? -1 : 1;
		},
		TR2BL: function (a, b) { // top/right to bottom/left
			var x = a.col - a.row;
			var y = b.col - b.row;
			return x === y ? _sorters.T2B(a, b) : x < y ? 1 : -1;
		},
		BL2TR: function (a, b) { // bottom/left to top/right
			var x = a.col - a.row;
			var y = b.col - b.row;
			return x === y ? _sorters.B2T(a, b) : x < y ? -1 : 1;
		},
		RAND: function (a, b) { // random
			var x = Math.random();
			return x == 0.5 ? 0 : x < 0.5 ? -1 : 1;
			//return _sorters[["R2L", "L2R", "B2T", "T2B", "BR2TL", "TL2BR", "TR2BL", "BL2TR"][Math.floor(Math.random() * 8)]].call(null, a, b);
		}
	}

	$.WPVSlider.fx.gridFadeQueue = {
		init: initGridFx,
		changeCaptions: $.WPVSlider.captionFx.toggle,
			/* Here cfg contains:
			slider
			toShow
			toHide
			dir
			callback
			duration
			easing
			*/
		run: function (cfg) {

			runGridFx(
			$.extend({
				easing: "linear",
				waveDuration: 600,
				subslideDuration: 600,
				cssFrom: {
					opacity: 0
				},
				cssTo: {
					opacity: 1
				},
				visibleGrid: true
			}, cfg, cfg.slider.options.effect_settings));
		}
	};

	$.WPVSlider.fx.gridWaveBL2TR = {
		init: initGridFx,
		changeCaptions: $.WPVSlider.captionFx.toggle,
		run: function (cfg) {
			runGridFx(
			$.extend({
				easing: "linear",
				waveType: "BL2TR",
				waveDuration: 200,
				subslideDuration: 300,
				visibleGrid: true,
				rows: 3,
				cols: 6,
				cssFrom: {
					opacity: 0,
					marginTop: "@facetHeight",
					marginLeft: "-@facetWidth"
				},
				cssTo: {
					opacity: [1, "easeInSine"],
					marginTop: 0,
					marginLeft: 0
				}
			}, cfg, cfg.slider.options.effect_settings));
		}
	};

	$.WPVSlider.fx.gridRandomSlideDown = {
		init: initGridFx,
		changeCaptions: $.WPVSlider.captionFx.toggle,
		run: function (cfg) {
			runGridFx(
			$.extend({
				waveType: "RAND",
				rows: 3,
				cols: 6,
				waveDuration: 600,
				subslideDuration: 600,
				visibleGrid: true,
				easing: "easeOutExpo",
				cssFrom: {
					height: 0,
					marginTop: "-@facetHeight",
					opacity: 0
				},
				cssTo: {
					opacity: 1,
					height: "@facetHeight",
					marginTop: 0
				}
			}, cfg, cfg.slider.options.effect_settings));
		}
	};

	// effects with subcaptions

	function getSubcaptionSpeed(subcaption, cfg) {
		var x = parseInt($(subcaption).attr("data-animation-duration"), 10);
		if (isNaN(x) || x < 0) {
			x = cfg.speed;
		}
		return x;
	}

	// NOTE that the per-subcaption delay is added to the global one!

	function getSubcaptionDelay(subcaption, cfg) {
		var x = parseInt($(subcaption).attr("data-animation-delay"), 10);
		if (isNaN(x) || x < 0) {
			x = 0;
		}
		return x;
	}

	function getSubcaptionEasing(subcaption, cfg) {
		return $(subcaption).attr("data-animation-easing") || cfg.slider.options.effect_settings.easing || "easeInOutCirc";
	}

	$.WPVSlider.fx.slideMultipleCaptions = {

		// Use the built-in slide transition for main animations
		run: function () {
			return $.WPVSlider.fx.slide.run.apply(this, arguments);
		},

		/**
		 * cfg contains:
		 * - oldCaption {jQuery}
		 * - newCaption {jQuery}
		 * - slider (The instance)
		 * - slideToShow {Slide}
		 * - slideToHide {Slide}
		 */
		changeCaptions: function (cfg, callback) {

			// Go deeper in the captions to look for subcaptions to animate
			var oldSubCaptions = cfg.oldCaption.find(".sub-caption");
			var newSubCaptions = cfg.newCaption.find(".sub-caption");

			if (!oldSubCaptions.length) {
				oldSubCaptions = cfg.oldCaption;
			}

			if (!newSubCaptions.length) {
				newSubCaptions = cfg.newCaption;
			}

			$(newSubCaptions).removeClass("visible");

			var hideFunctions = [];
			oldSubCaptions.each(function (i, o) {
				var speed = getSubcaptionSpeed(o, cfg);
				var easing = getSubcaptionEasing(o, cfg);
				var delay = getSubcaptionDelay(o, cfg);
				if (!cfg.slider.options.effect_settings.caption_queue) {
					hideFunctions.push(function (next) {
						$(o).delay(delay).removeClass("visible", speed, easing);
						next();
					});
				} else {
					hideFunctions.push(function (next) {
						$(o).delay(delay).removeClass("visible", speed, easing, next);
					});
				}
			});
			
			hideFunctions.push(function (next) {
				if (cfg.newCaption.length) {
					cfg.newCaption.animate({
						opacity: "show"
					}, 500, "linear");
				}
				next();
			});

			var showFunctions = [];
			newSubCaptions.each(function (i, o) {
				var speed = getSubcaptionSpeed(o, cfg);
				var easing = getSubcaptionEasing(o, cfg);
				var delay = getSubcaptionDelay(o, cfg);
				if (!cfg.slider.options.effect_settings.caption_queue) {
					showFunctions.push(function (next) {
						$(o).delay(delay).addClass("visible", speed, easing);
						next();
					});
				} else {
					showFunctions.push(function (next) {
						$(o).delay(delay).addClass("visible", speed, easing, next);
					});
				}
			});

			showFunctions.push(function (next) {
				if (cfg.oldCaption.length) {
					cfg.oldCaption.animate({
						opacity: "hide"
					}, 300, "linear", next);
				} else {
					next();
				}
			});

			$.WPVSlider.createCaptionFx(
			cfg, hideFunctions, showFunctions, callback || $.noop)();
		}
	};

	// zoom effects
	$.WPVSlider.fx.zoomIn = {
		
		init : function(slider) {
			if (slider.options.captionContainer) { 
				var captionContainer = $(slider.options.captionContainer);
				$(slider.view).bind({
					"afterChange" : function() {
						if ($(".wpv-caption:visible", captionContainer).length === 0) {
							captionContainer.hide();
						}
					},
					"beforeChange" : function() {
						captionContainer.show();
					}
				});
			}
		},
		
		run: function (cfg) {

			cfg = $.extend({
				duration: 1000,
				easing: "easeOutSine"
			}, cfg);

			var content = $(cfg.toShow[0].firstChild);
			var targetHeight = cfg.toShow.height();
			var targetWidth = cfg.toShow.width();
			var halfX = targetWidth / 2;
			var halfY = targetHeight / 2;
			var contentHeight = content.height();
			var contentWidth = content.width();

			cfg.toHide.css({
				zIndex: 2
			});

			if (content.is("img")) {
				var diffY = Math.abs(parseFloat(content.css("marginTop" )));
				var diffX = Math.abs(parseFloat(content.css("marginLeft")));
				content.css({
					opacity: 0,
					position: "absolute",
					clip: "rect(" 
						+ (diffY + halfY) + "px " 
						+ (diffX + halfX) + "px " 
						+ halfY + "px " 
						+ halfX + "px)"
				}).show().animate({
					opacity: 1
				}, {
					duration: cfg.duration,
					easing: cfg.easing,
					step: function (cur, fx) {
						content[0].style.clip = "rect( " 
						+ (diffY - halfY * fx.pos) + "px " 
						+ (diffX + halfX * fx.pos) + "px " 
						+ (diffY + halfY * fx.pos) + "px " 
						+ (diffX - halfX * fx.pos) + "px)";
					},
					complete: function () {
						cfg.toHide.hide();
						content.css({
							clip: "auto"
						});
						cfg.callback();
					}
				});
				cfg.toShow.css({
					display: "block",
					zIndex: 3
				});
			} else {
				var cssBackup = {
					// top          : content.css("top"),
					//left         : content.css("left"),
					//marginRight  : content.css("marginRight"),
					//marginBottom : content.css("marginBottom")
				};

				content.css({
					//top          : "50%",
					//left         : "50%",
					width: "100%",
					height: "100%"
				});

				cfg.toShow.css({
					opacity: 0,
					zIndex: 3,
					display: "block",
					position: "absolute",
					width: 0,
					height: 0,
					top: "50%",
					left: "50%"
				}).animate({
					opacity: 1,
					top: 0,
					left: 0,
					width: "100%",
					height: "100%"
				}, {
					duration: cfg.duration,
					easing: cfg.easing,
					//step : function(cur, fx) {
					//  if (fx.prop == "opacity") {
					//    content[0].style.top  = halfY - (halfX * fx.pos) + "px";
					//    content[0].style.left = halfX - (halfX * fx.pos) + "px";
					//    content[0].style.height  = (targetHeight * fx.pos) + "px";
					//    content[0].style.width = (targetWidth * fx.pos) + "px";
					//  }
					//},
					complete: function () {
						cfg.toHide.hide();
						//content.css(cssBackup);
						cfg.callback();
					}
				});
			}
		},

		/**
		 * cfg contains:
		 * - oldCaption {jQuery}
		 * - newCaption {jQuery}
		 * - slider (The instance)
		 * - slideToShow {Slide}
		 * - slideToHide {Slide}
		 */
		changeCaptions: function (cfg, callback) {

			var Z = 200,
				delay = Math.round(cfg.slider.options.animation_time * 0.3),
				time = Math.round(cfg.slider.options.animation_time * 0.4);

			if (cfg.newCaption.length) {
				cfg.newCaption.css({
					opacity: 0,
					zIndex: Z + 1
				}).show().delay(delay).fadeTo(time, 1, "linear", callback);
			} else {
				callback();
			}

			// This is FALSE on the first showing of the first slide!
			if (cfg.oldCaption) {
				cfg.oldCaption.css({
					zIndex: Z
				}).delay(delay).fadeTo(time, 0, "linear", function () {
					cfg.oldCaption.hide();
				});
			}
		}
	};

	// shrink
	$.WPVSlider.fx.shrink = {
		
		init: function(slider) {
			if ($.browser.webkit) {
				$("#container").css("WebkitTransform", "none");
			}
			//console.log(this, arguments);
		},
		
		// Use the built-in slide transition for main animations
		run: function (cfg) {

			var captionToHide, captionToShow = cfg.toShow.data("Slide").getCaption(),
				wI = cfg.toShow.closest(".wpv-wrapper").width(),
				wO = cfg.toShow.closest(".wpv-wrapper").innerWidth();

			if (cfg.toHide) {

				captionToHide = cfg.toHide.data("Slide").getCaption();

				cfg.toHide.css({
					zIndex: 2
				}).animate({
					left: cfg.dir == "prev" ? wO : -wO / 2,
					opacity: 0
				}, cfg.duration, cfg.easing);
			}

			//w = cfg.toShow.width();
			cfg.toShow.css({
				left: wO * (cfg.dir == "next" ? 1 : -1),
				zIndex: 4,
				opacity: 1
			}).show().animate({
				left: 0
			}, {
				duration: cfg.duration,
				easing: cfg.easing,
				step: function (cur, fx) {

					if (captionToShow && captionToShow.length) {
						captionToShow.css({
							left: cur + wI,
							opacity: fx.pos
						});
					}

					if (captionToHide && captionToHide.length) {
						captionToHide.css({
							left: wI - wO * fx.pos * (cfg.dir == "prev" ? -1 : 1),
							opacity: 1 - fx.pos
						});
					}
				},
				complete: function () {
					cfg.toHide.hide();
					cfg.callback();
				}
			});
		},

		/**
		 * Just define an empty function here to get rid of the default one. In this
		 * case the caption animations are easier to handle in the main function above
		 */
		changeCaptions: function (cfg, callback) {
			callback();
		}
	};

	$.WPVSlider.fx.peek = {

		run: function (cfg) {
			var padd = 20;
			var slide = cfg.toHide;
			var slides = slide.parent().find(".wpv-slide-wrapper").hide();
			var indexToHide = slides.index(cfg.toHide);
			var indexToShow = slides.index(cfg.toShow);

			cfg.toHide.show().css({
				left: 0
			});

			if (cfg.dir == "next") {
				cfg.toShow.show().css({
					left: slide.width() + padd
				});
				if (indexToShow == slides.length - 1) {
					slides.eq(0).show().css({
						left: slide.width() + cfg.toShow.width() + padd * 2
					});
				} else {
					cfg.toShow.next().show().css({
						left: slide.width() + cfg.toShow.width() + padd * 2
					});
				}
			} else {
				cfg.toShow.show().css({
					left: -cfg.toShow.width() - padd
				});
				if (indexToHide == slides.length - 1) {
					slides.eq(0).show().css({
						left: cfg.toHide.width() + padd
					});
				} else {
					cfg.toHide.next().show().css({
						left: cfg.toHide.width() + padd
					});
				}
			}

			slide.parent().css({
				left: 0
			}).animate({
				left: (slide.width() + padd) * (cfg.dir == "next" ? -1 : 1)
			}, cfg.duration, cfg.easing, cfg.callback);
		},

		changeCaptions: function (cfg, callback) {
			if (cfg.newCaption.parent().length) {
				var startTop = cfg.newCaption.parent()[0].scrollTop;
				var top = cfg.newCaption[0].offsetTop - cfg.newCaption.scrollTop();

				if (cfg.newCaption.parent().css('opacity') != 0) {
					cfg.newCaption.parent().css({
						dummy: 0
					}).animate({
						dummy: 1
					}, {
						duration: cfg.slider.options.animation_time,
						easing: "easeInOutCubic",
						step: function (cur) {
							this.scrollTop = startTop + (cur * (top - startTop));
						},
						complete: callback
					});
				} else {
					cfg.newCaption.parent().scrollTop = top;
					cfg.newCaption.parent().animate({
						opacity: 1
					}, {
						duration: cfg.slider.options.animation_time,
						easing: "easeInOutCubic",
						complete: callback
					});
				}
			} else {
				if (cfg.oldCaption.length > 0) {
					cfg.oldCaption.parent().animate({
						opacity: 0
					}, {
						duration: cfg.slider.options.animation_time,
						easing: "easeInOutCubic",
						complete: callback
					});
				} else {
					callback();
				}
			}
		}
	};

})(jQuery);