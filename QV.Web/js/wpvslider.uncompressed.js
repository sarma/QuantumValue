// wpvSlider.js
/**
 * A tipical HTML structure after the script has ran ( NOT FINAL!):
 * <div class="wpv-wrapper">
 *   <div class="wpv-view">
 *     <div class="wpv-slide-wrapper"><img class="wpv-slide" /></div>
 *     <div class="wpv-slide-wrapper"><img class="wpv-slide" /></div>
 *     <div class="wpv-slide-wrapper"><img class="wpv-slide" /></div>
 *     <div class="wpv-slide-wrapper"><img class="wpv-slide" /></div>
 *   </div>
 *   <div class="wpv-prev" /></div>
 *   <div class="wpv-next" /></div>
 *   <div class="wpv-pager" />
 *     <a href="#slide1" />
 *     <a href="#slide2" />
 *     <a href="#slide3" />
 *   </div>
 *   <div class="wpv-caption" />
 *   <div class="wpv-caption" />
 * </div>
 */
(function ($) {

	// Force the hardware acceleration on Safari (this is cousing problems on Chrome)
	// Please consider this EXPERIMENTAL and remove it if needed
	//if ($.browser.webkit && !window.chrome) {
	//  $("body").css({
	//    "WebkitTransform": "translateZ(0)"
	//  });
	//}
	var _defaults = {

		// inner width of the slider (content width)
		width: "auto",

		// height of the slider (content height)
		height: 300,

		// No height (let it resize to fit to the slide's height).
		// NOTE: If this is true the "height" option is ignored
		autoHeight: false,

		// boolean that indicates whether the slider expands horizontally to the
		// viewport or sticks to the content width (option allowing a) boxed layout
		// where the slider?s width equals to the content width, or b) slider that
		// is laid to the whole width of the screen resolution)
		expand: false,

		// ms in which each slide is shown
		pause_time: 4000,

		// in ms
		animation_time: 800,

		// effect slug. If this is a function, it is expected to
		// return the fx name
		effect: "fade",

		// A placeholder for custom fx settings
		effect_settings: {
			easing: "easeInOutExpo"
		},

		// initial slide index
		start_slide: 0,

		// ?left?, ?right? or ?none?
		auto_direction: "right",

		// boolean; whether to show left/right arrows
		show_arrows: true,

		// boolean; whether to show slide bullets as navigation
		show_bullets: true,

		// boolean; whether to show captions
		show_caption: true,

		// boolean; whether to clear the pending timeout for next animation
		pause_on_hover: true,
		
		// string: 
		// "crop"    - Display the content as is, centered and cropped if needed
		// "fit"     - Resize proportionally untill both sides are less or equal 
		//             to the available space 
		// "stretch" - Resize both sides to match the available space. For HTML 
		//             The proportion is lost...
		resizing: "crop",

		// string; text for ?Previous? button
		prev_text: "Previous",

		// string; for ?Next? button
		next_text: "Next",

		// boolean; whether to show slide number in each bullet, used when
		// show_bullets is true
		//show_bullet_numbers : false,
		// boolean, looks for the data-thumb attribute in the current slide and
		// uses this link as a thumbnail for the current bullet. We will provide
		// a single slider with consistent sized thumbnails, but each slider
		// should accommodate for different sized thumbnail. If it is a problem
		// to auto detect their sizes, we may add options for that.
		//thumbnail_bullets : false,
		// number from 0 to 1, you should convert it to a MS filter rule for IE.
		caption_opacity: 0.6,

		// Others maybe? -----------------------------------------------------------
		loop: 0,
		// not implemented
		// The following are selectors that should match existing elements to be
		// used as custom containers for captions and navigation elements. If these
		// are not found, the generig elements will be appended to the gallery's
		// outer-most wrapper. These can also be dom elements.
		captionContainer: null,
		navPrevContainer: null,
		// not implemented
		navNextContainer: null,
		// not implemented
		pagerContainer: null // not implemented
	};

	/** ==========================================================================
	 * The Slide class. Each slider has a "slides" property that is an array
	 * collection of Slide instancies
	 */

	function Slide(element, type, slider) {
		
		var slideInstance = this;
		
		this.element = element;

		this.wrapper = element.parentNode;

		this.type = type;

		this.slider = slider;

		/**
		 * This should be private and is only used to cache the object!
		 * Use the "getCaption" getter instead.
		 */
		this._caption = null;

		var $element = $(element);

		$.data(this.element, "Slide", this);
		$.data(this.wrapper, "Slide", this);

		// Store it's natural Width and Height
		if ("naturalWidth" in element) {
			this.width = element.naturalWidth;
			this.height = element.naturalHeight;
		} else {
			this.width = $element.width();
			this.height = $element.height();
		}

		// Apply the custom style (if any)
		$element.parent().attr("style", this.getStyle());
		
		// Center the content and crop it if needed
		$element.css({
			top : "50%",
			left: "50%",
			marginLeft: -this.width/2,
			marginTop: -this.height/2
		});
		
		// The slides are initially hidden (BUT AFTER the above measurenments and if
		// NOT already marked as active)
		if (!$element.parent().is(".active")) {
			$element.parent().hide();
		}
		
		// Attach the onclick behavior if needed 
		var _href = this.getHref();
		if (_href) { 
			$(this.wrapper).css({ 
				cursor: "hand", // Old IE	 	
				cursor: "pointer" 
			}).click(function(e) {
				
				// Attaching link behavior to the slides makes sence for image 
				// slides only. However, it is not disabled for the HTML slides
				// here are some cases that should be filtered:
				// 1. Click on link - let it go 
				// 2. Click anything within form - leave it as is. Too many 
				//    things could be broken otherwise...
				if ($(e.target).is("a, form")) {
					return true;
				}
				
				// Respect those
				if (e.isDefaultPrevented()) {
					return false;
				}
				
				if (!$(this).is(".active")) {
					return false;
				}
				
				var target = slideInstance.getHrefTarget().replace(/^_/, "");
				if (target == "blank" || target == "new") {
					window.open(_href);
				}
				else { 
					try {
						// top, parent, self, frame name...
						window[target].location = _href;
					} 
					catch (ex) {
						// perhaps cross-domain restriction
					}
				}
			});
		}
    
		var wrapper;
		this.getCaptionWrapper = function () {
		  if ( !wrapper ) {
			if ( !! this.slider.options.captionContainer) {
			  wrapper = $(this.slider.options.captionContainer);
			  if (!wrapper.length) {
				wrapper = $(this.element).closest(".wpv-wrapper");
			  } else {
				// Attach the pause_on_hover listeners
				if ( !!this.slider.options.pause_on_hover ) {
				  var _inst = this.slider;
				  wrapper.hover(function () {
					_inst.pause();
				  }, function () {
					_inst.resume();
				  });
				}
				wrapper = wrapper.eq(0);
			  }
			} else {
			  wrapper = $(this.element).closest(".wpv-wrapper");
			}
		  }
		  return wrapper;
		}
	}
	
	Slide.prototype = {
    
		/**
		 * Returns the caption element (jQuery) for this slide or null
		 */
		getCaption: function () {
			if (!this._caption) { // check for cached object
				var src = unescape($(this.element).attr("data-caption") || $(this.element).attr("alt") || "");

				if (!src) {
					return null;
				}

				var wrapper = this.getCaptionWrapper();

				// If a slide?s caption starts with a hash sign, then this is an id
				// pointing to the html element containing a html caption
				var isId = src.indexOf("#") === 0,
					elem = null;

				if (isId) {
					elem = $(src);
					if (!elem.length) {
						elem = null;
					} else {
            
						// clone the element and append it to container (but only if its not
						// allready a child of the container)
						if (!elem.closest(wrapper).length) {
						  elem = elem.clone().removeAttr("id").addClass("wpv-caption").appendTo(wrapper);
						}
					}
				}

				// create one if needed
				if (!elem && !isId) {
					elem = $('<div class="wpv-caption" />').html(src).appendTo(wrapper);
				}

				if (elem) {
					elem.addClass("wpv-caption");
          var style = this.getCaptionStyle();
          if (style) {
            elem.attr("style", style);
          }
					this._caption = elem;
				}
			}
			return this._caption;
		},

		/**
		 * Returns the custom style for this slide as string (can be empty string)
		 */
		getStyle: function () {
			return unescape($(this.element).attr("data-style") || "");
		},

		/**
		 * Returns the custom style for this slide's caption as string
		 * (can be empty string)
		 */
		getCaptionStyle: function () {
			return unescape($(this.element).attr("data-caption-style") || "");
		},
		
		/**
		 * Returns the "link URL" for that slide as string
		 * (can be empty string)
		 */
		getHref: function () {
			return unescape($(this.element).attr("data-href") || "");
		},
		
		/**
		 * Returns the "link URL - target" for that slide as string
		 */
		getHrefTarget: function () {
			return unescape($(this.element).attr("data-target") || "_self");
		}

	};

	/** ==========================================================================
	 * The WPVSlider class
	 */

	function WPVSlider(elem, options) {

		var _inst = this;

		this.view = elem;

		var _cfg = $.extend(true, {}, _defaults, options);

		this.options = _cfg;

		/**
		 * The id (unique name) of the FX that is currently in use
		 */
		var _fxId = "fade";

		this.slides = [];

		this.showLoadingMask = function () {
			var mask = $(".wpv-loading-mask", this.view);
			if (!mask.length) {
				mask = $('<div class="wpv-loading-mask"/>').appendTo(this.view);
			}
			mask.css({
				top: 0,
				left: 0,
				right: 0,
				bottom: 0,
				opacity: 1,
				display: "block"
			});
		};

		this.hideLoadingMask = function (callback) {
			var mask = $(".wpv-loading-mask", this.view);
			if (mask.length) {
				mask.animate({
					opacity: 0
				}, 1000, "easeInQuad", function () {
					$(this).hide();
					(callback || $.noop)();
				});
			}
		};

		this.showLoadingMask();

		// Slideshow and Navigation Controll Methods -------------------------------
		var _slideShowTimer, _paused = 0,
			_isAnimating, _isAnimatingCaptions;

		// Be CAREFUL with timers!
		$(window).bind("unload beforeunload", function () {
			_inst.stop();
		});

		/**
		 * Starts the slideshow if it's not already running
		 */
		this.start = function (delay) {

			if (_isAnimating || _isAnimatingCaptions || _paused) {
				_slideShowTimer = window.setTimeout(function () {
					_inst.start(_cfg.pause_time);
				}, 200);
				return;
			}

			_slideShowTimer = window.setTimeout(function () {
				if (_paused) {
					_inst.start(_cfg.pause_time);
				} else {
					_inst[_inst.getDirection() == "right" ? "next" : "prev"](function () {
						if ( !! _slideShowTimer) { // false if stopped while animating
							_inst.start(_cfg.pause_time);
						}
					});
				}
			}, delay || 0);
		};

		/**
		 * Stops the slideshow (if it is currently running)
		 */
		this.stop = function () {
			if (_slideShowTimer) {
				window.clearTimeout(_slideShowTimer);
				_slideShowTimer = null;
			}
			_paused = 0;
		};

		/**
		 * Pauses the running slideshow
		 */
		this.pause = function () {
			_paused = +new Date();
		};

		/**
		 * Resumes the running slideshow
		 */
		this.resume = function () {
			_paused = 0;
		};

		/**
		 * Returns a boolean to indicate if the slideshow is currently running
		 */
		this.isRunning = function () {
			return !!_slideShowTimer;
		};

		/**
		 * Returns the zero-based index of the currently active slide. If there is
		 * no active slide (initially, and if none is specified in start_slide
		 * option) this method just returns -1.
		 * @return {int}
		 */
		this.getIindex = function () {
			return $(".wpv-slide-wrapper", elem).filter(".active").index();
		};

		this.getSlideElements = function () {
			return $(".wpv-slide-wrapper", elem);
		};

		/**
		 * Returns the currently active Slide object.
		 * NOTE: This can be undefined if there is no active item!
		 * @return {Slide}
		 */
		this.getCurrentSlide = function () {
			return $(".wpv-slide-wrapper.active", elem).eq(0);
		};

		/**
		 * Returns next slide (the one after the currently active). If the last
		 * slide is active this will return the first one.
		 * NOTE: This can be undefined if there are no slides!
		 * NOTE: This can be the active slide if there is only one slide!
		 * @return {jQuery}
		 */
		this.getNextSlide = function () {
			var cur = this.getCurrentSlide();
			var next = cur.next(".wpv-slide-wrapper", elem);
			if (!next.length) {
				next = $(".wpv-slide-wrapper:first", elem);
			}
			return next.eq(0);
		};

		/**
		 * Returns previous slide (the one before the currently active). If the
		 * first slide is active this will return the last one.
		 * NOTE: This can be an empty jQuery object if there are no slides!
		 * NOTE: This can be the active slide if there is only one slide!
		 * @return {jQuery}
		 */
		this.getPreviousSlide = function () {
			var cur = this.getCurrentSlide();
			var prev = cur.prev(".wpv-slide-wrapper", elem);
			if (!prev.length) {
				prev = $(".wpv-slide-wrapper:last", elem);
			}
			return prev.eq(0);
		};

		/**
		 * Returns "left" or "right" depending on the CURRENT value of the
		 * "auto_direction" config. property.
		 * @return {string}
		 */
		this.getDirection = function () {
			return _cfg.auto_direction == "left" ? "left" : "right";
		};

		/**
		 * Runs a transition to the next slide
		 */
		this.next = function (callback) {
			this.goTo("next", callback);
		};

		/**
		 * Runs a transition to the previous slide
		 */
		this.prev = function (callback) {
			this.goTo("prev", callback);
		};

		this.goTo = function (index, callback) {

			if (_isAnimating || _isAnimatingCaptions) {
				return false; // Do we need queue here?
			}

			if (index == this.getIindex()) {
				return;
			}

			var toHide = this.getCurrentSlide();

			var toShow;
			if (index == "prev") {
				toShow = this.getPreviousSlide();
			} else {
				if (index == "next") {
					toShow = this.getNextSlide();
				} else {
					toShow = $(".wpv-slide-wrapper", elem).eq(index);
				}
			}

			var evt = new $.Event("beforeChange");
			$(elem).trigger(evt, [this, toShow, toHide]);

			if (evt.isDefaultPrevented()) {
				return;
			}

			toHide.removeClass("active").addClass("animated");
			toShow.addClass("active animated");

			function _mainAnimationCallback() {

				toShow.removeClass("animated");
				toHide.removeClass("animated");
				$(_inst.view.parentNode).removeClass("animated");
				_isAnimating = false;

				if ($.isFunction(callback)) {
					callback.apply(_inst, arguments);
				}

				var evt = new $.Event("afterChange");
				$(elem).trigger(evt, [_inst, toShow, toHide]);
				if (evt.isDefaultPrevented()) {
					_inst.stop();
				}

				if (toShow[0] == $(".wpv-slide-wrapper", elem).filter(":last")[0]) {
					evt = new $.Event("lastSlide");
					$(elem).trigger(evt, [_inst, toShow, toHide]);
					if (evt.isDefaultPrevented()) {
						_inst.stop();
					}
				} else {
					if (toShow[0] == $(".wpv-slide-wrapper", elem).filter(":first")[0]) {
						evt = new $.Event("firstSlide");
						$(elem).trigger(evt, [_inst, toShow, toHide]);
						if (evt.isDefaultPrevented()) {
							_inst.stop();
						}
					}
				}
			}

			function _runMainAnimation() {
				$(_inst.view.parentNode).addClass("animated");

				_inst.setFX(_inst.options.effect);

				_isAnimating = true;

				if (!WPVSlider.fx[_fxId]) {
					_mainAnimationCallback();
				} else {

					var dir = $.WPVSlider.Util.getDirection(toHide, toShow, $(".wpv-slide-wrapper", elem));

					if (!dir) {
						$(_inst.view.parentNode).removeClass("animated");
						_isAnimating = false;
						return;
					}

					toShow.stop(1, 1).trigger("fxStop");
					toHide.stop(1, 1).trigger("fxStop");

					WPVSlider.fx[_fxId].run({
						slider: _inst,
						toShow: toShow,
						toHide: toHide,
						dir: dir,
						callback: _mainAnimationCallback,
						duration: _cfg.animation_time,
						easing: _cfg.effect_settings.easing
					});
				}
			}

			_runMainAnimation();
		};

		this.getFX = function () {
			return _fxId;
		};

		this.setFX = function (fxId) {
			var _oldId = _fxId;
			var id = $.isFunction(fxId) ? fxId() : fxId;
			if (id in WPVSlider.fx) {
				if (id != _fxId) {

					var oldFx = WPVSlider.fx[id];
					if ($.isFunction(oldFx.uninit)) {
						oldFx.uninit(this);
					}
					oldFx = null;

					var newFx = WPVSlider.fx[id];
					if ($.isFunction(newFx.init)) {
						newFx.init(this);
					}
					newFx = null;

					_fxId = id;
				}
			}
		};

		this.getOption = function (name) {
			return _cfg[name];
		};
		
		this.setOption = function (name, value) {
			_cfg[name] = value;
			return this;
		};

		// Layout Controll Methods ---------------------------------------------
		this.setWidth = function (w) {
			$elem.width(calcWidth(w));
		};

		this.setHeight = function (h) {
			$elem.height(h);
		};
		
		this.setResizing = function( resizing ) {
			var view       = $elem.closest(".wpv-view"),
				viewWidth  = view.width(),
				viewHeight = view.height();
			
			function cropSlide($el) {
				var slide = $el.data("Slide");
				if (slide) {
					$el.css({
						width     : "auto",
						height    : "auto",
						top       : "50%",
						left      : "50%",
						marginLeft: -slide.width/2,
						marginTop : -slide.height/2
					}).find("iframe").each(function() {
						$(this).css({
							width : $(this).attr("width" ) || 'auto',
							height: $(this).attr("height") || 'auto'
						});
					});
				}
			}
			
			function fitSlide($el) {
				var slide = $el.data("Slide");
				if (slide) {
					var w = slide.width,
						h = slide.height;
					
					if ( viewWidth < slide.width ) {
						w = viewWidth;
						h = h * (viewWidth / slide.width);
					}
					if ( h > viewHeight ) {
						w = w * (viewHeight / h);
						h = viewHeight;
					}
					$el.css({
						width     : w,
						height    : h,
						top       : "50%",
						left      : "50%",
						marginLeft: -w/2,
						marginTop : -h/2
					});
				}
			}
			
			function stretchSlide($el) {
				$el.css({
					width : viewWidth,
					height: viewHeight,
					top       : "50%",
					left      : "50%",
					marginLeft: -viewWidth/2,
					marginTop : -viewHeight/2
				}).find("iframe").css({
					width : viewWidth,
					height: viewHeight
				});
			}
			
			$(".wpv-slide", view).each(function (i, o) {
				var $el = $(o),
					slide = $el.data("Slide");

				// The image is not yet loaded
				if (!slide) {
					return true;
				}
								
				resizing = String(resizing).toLowerCase();
				switch ( resizing ) {
					case "fit":
						if ($el.is("img")) {
							fitSlide($el);
						}
						else {
							cropSlide($el);
						}
					break;
					case "stretch":
						stretchSlide($el);
						break;
					case "crop":
					default:
						cropSlide($el);
						break;
				}
			});
		};
		
		this.setExpanded = function (bExpanded) {
			var _outerWrapper = $elem.parent();
			_outerWrapper.height(_outerWrapper.height());
			_outerWrapper[ !! bExpanded ? "addClass" : "removeClass"]("wpv-full-width");

			function syncExpandedView() {
				if (bExpanded) {
					var w = $("body").width();

					_outerWrapper.width(w);

					var bp = (window.width - window.innerWidth) / 2;
					var l = _outerWrapper.offset().left;

					if (l > bp) {
						_outerWrapper.css("left", bp - l);
					}
				} else {
					$(elem).add(_outerWrapper).width(calcWidth());
				}
				_inst.setResizing(_cfg.resizing);
			}

			if ( !! bExpanded) {
				$(window).unbind("resize.syncWPV", syncExpandedView).bind("resize.syncWPV", syncExpandedView);
				syncExpandedView();
			} else {
				syncExpandedView();
				$(window).unbind("resize.syncWPV");
			}
		};

		this.isExpanded = function () {
			return $(elem).parent().hasClass("wpv-full-width");
		};

		this.setShowArrows = function (bShow) {
			var _outerWrapper = $(elem).parent();
			var leftArrow = $(".wpv-nav-prev", _outerWrapper);
			var rightArrow = $(".wpv-nav-next", _outerWrapper);

			// create them if needed
			if ( !! bShow) {

				if (!leftArrow.length) {
					leftArrow = $('<div class="wpv-nav-prev" />').html(_cfg.prev_text).bind({
						click: function () {
							_inst.prev();
						},
						mouseenter: function () {
							_inst.pause();
						},
						mouseleave: function () {
							_inst.resume();
						},
						"mousedown selectstart": false // unselectable
					}).appendTo(_outerWrapper);
				}

				if (!rightArrow.length) {
					rightArrow = $('<div class="wpv-nav-next" />').html(_cfg.next_text).bind({
						click: function () {
							_inst.next();
						},
						mouseenter: function () {
							_inst.pause();
						},
						mouseleave: function () {
							_inst.resume();
						},
						"mousedown selectstart": false // unselectable
					}).appendTo(_outerWrapper);
				}
			}

			// hide them if needed
			else {
				leftArrow.hide();
				rightArrow.hide();
			}
		};

		this.setShowBullets = function (bShow) {
			var _outerWrapper = $(elem).parent();
			var pager = $(".wpv-nav-pager", _outerWrapper);

			// create it if needed
			if ( !! bShow) {
				if (!pager.length) {
					pager = $('<ul class="wpv-nav-pager" />').appendTo(_outerWrapper);
					var curIndex = _inst.getIindex();

					$(".wpv-slide-wrapper", elem).each(function (i, slide) {
						var li = $('<li/>').click(function () {
							_inst.goTo(i);
						}).bind("mousedown selectstart", false).hover(function () {
							_inst.pause();
							$(this).addClass("hover");
						}, function () {
							_inst.resume();
							$(this).removeClass("hover");
						}).appendTo(pager);

						if (curIndex === i) {
							li.addClass("active");
						}
					});

					$elem.bind({
						"beforeChange": function (e, slider, toShow, toHide) {
							pager.find("li.active").removeClass("active");
							pager.find("li").eq(toShow.index()).addClass("active");
						}
					});
				}
			}

			// hide it if needed
			else {
				pager.hide();
			}
		};

		this.setShowCaption = function (bShow) {
			if ( !! bShow) {
				$elem.unbind("beforeChange.changeCaption").bind({
					"beforeChange.changeCaption": function (e, slider, newSlide, oldSlide) {
						if (_isAnimatingCaptions || !newSlide || !slider.options.show_caption) {
							return;
						}

						var newCaption = $(newSlide ? newSlide.data("Slide").getCaption() : "<div />");
						var oldCaption = $(oldSlide ? oldSlide.data("Slide").getCaption() : "<div />");

						var worker = WPVSlider.fx[_fxId] && WPVSlider.fx[_fxId].changeCaptions ? WPVSlider.fx[_fxId].changeCaptions : WPVSlider.captionFx.fadeToggle;

						var speed = slider.options.effect_settings.caption_animation_time;
						if (!speed && speed !== 0) {
							speed = slider.options.animation_time;
						}

						var delay = slider.options.effect_settings.caption_delay || 0;

						_isAnimatingCaptions = true;

						$(slider.view.parentNode).addClass("animated");

						worker({
							oldCaption: oldCaption,
							newCaption: newCaption,
							slider: slider,
							slideToShow: newSlide,
							slideToHide: oldSlide,
							speed: speed,
							delay: delay
						}, function () {
							$(slider.view.parentNode).removeClass("animated");
							_isAnimatingCaptions = false;
						});
					}
				});
			} else {
				$elem.unbind("beforeChange.changeCaption");
			}
		};
    
    
        function calcWidth(width) {
            var _width = String(width || _cfg.width);
            if (_width != "auto") {
                var m = _width.match(/([\+-]?(\d*\.)?\d+)([^\d]*)/); //console.dir(m);
                _width = "auto";
                if (m && m[1]) {
                    var _width2 = parseFloat(m[1]);
                    if (!isNaN(_width2)) { // NaN remains auto
                        if (_width2 !== 0) { // 0 remains auto

                            // Get the parent's width
                            var prtWidth = $(elem).closest(".wpv-wrapper").parent().width();
                            
                            // Number without units
                            if (!m[3]) {
                                if (_width2 < 0) {
                                    _width = Math.max(prtWidth + _width2, 100);
                                }
                                else if (_width2 < 1) {
                                    _width = Math.max(prtWidth * _width2, 100);
                                }
                                else {
                                    _width = _width2;
                                }
                            }
                            else {
                                if (m[3] == "%") {
                                    _width = Math.max(prtWidth * (_width2/100), 100);
                                    //console.log(prtWidth, _width);
                                }
                                else {
                                    _width = m[0]; // as is
                                }
                            }
                        }
                    }
                }
                else {
                    _width = "auto";
                }
            }
            
            return _width;
        }
    
		////////////////////////////////////////////////////////////////////////////
		//                                                                        //
		//                             INITIALIZE                                 //
		//                                                                        //
		////////////////////////////////////////////////////////////////////////////
		var $elem = $(elem);

		// Mark it as our's
		$elem.addClass("wpv-view");

		// Wrap it with a fixed-size wrapper
		$elem.wrap('<div class="wpv-wrapper">');
		var _outerWrapper = $elem.parent();

		$elem.wrapInner('<div class="wpv-htmlslide-wrap"/>');
		var _innerWrapper = $elem.find("> .wpv-htmlslide-wrap");

		// Resize it and make it invisible while initializing
		$elem.css({
			visibility: "hidden",
			width : calcWidth(),
			height: _cfg.height
		});

		// Attach the pause_on_hover listeners
		if ( !! _cfg.pause_on_hover) {
			_outerWrapper.hover(function () {
				_inst.pause();
			}, function () {
				_inst.resume();
			});
		}

		// Collect all slides now ==================================================
		var slides = $elem.find(".wpv-slide").wrap('<div class="wpv-slide-wrapper"/>'),
			len = slides.length,
			initialSlide, loadCallback = function (el, type, initial) {
				var slide = new Slide(el, type, _inst);
				_inst.slides.push(slide);

				if (initial) {
					initialSlide = slide;
				}

				// When ALL the slides are ready fire the load event
				if (_inst.slides.length === len) {
					$elem.css("visibility", "visible");
					_inst.setExpanded(_cfg.expand);
					_outerWrapper.addClass("wpv-loaded");
					_inst.hideLoadingMask(function () {


						$elem.trigger("sliderload", [_inst]);
						initialSlide.getCaption();

						// Do I need these ?
						$elem.trigger("beforeChange", [_inst, $(initialSlide.wrapper)]);
						//elem.trigger("afterChange", [_inst, $(initialSlide.wrapper)]);
						if (len > 1 && (_cfg.auto_direction == "left" || _cfg.auto_direction == "right")) {
							_inst.start(_cfg.pause_time);
						}

						initialSlide = null;
					});

				}


				slide = null;
			};

		// Add some classNames to the outer wrapper to help the CSS styling
		if ( !! _cfg.show_arrows && len > 1) {
			_outerWrapper.addClass("wpv-show-arrows");
		}
		if ( !! _cfg.show_bullets && len > 1) {
			_outerWrapper.addClass("wpv-show-bullets");
		}
		if ( !! _cfg.show_caption) {
			_outerWrapper.addClass("wpv-show-caption");
		}

		slides.each(function (i, o) {

			var $o = $(o),
				type = "html";

			switch (o.nodeName.toLowerCase()) {
			case "img":
				type = "image";
				break;
			case "iframe":
				type = "frame";
				break;
			case "object":
				type = "object";
				break;
			case "embed":
				type = "embed";
				$o.attr("wmode", "transparent").removeAttr("bgcolor");
				o.wmode = "transparent";
				break;
			}

			if (type == "image" || type == "frame") {
				if ( !! o.complete || o.readyState == "complete" || o.readyState == "loaded") {
					loadCallback(o, type, i === (_cfg.start_slide || 0));
				} else {
					$o.bind("load readystatechange", function (e) {
						if (e.type == "load") {
							$o.unbind("load").unbind("readystatechange");
							loadCallback(o, type, i === (_cfg.start_slide || 0));
						} else {
							if (o.readyState == "complete" || o.readyState == "loaded") {
								$o.unbind("load").unbind("readystatechange");
								loadCallback(o, type, i === (_cfg.start_slide || 0));
							}
						}
					});
				}
			} else {
				loadCallback(o, type, i === (_cfg.start_slide || 0));
			}
		});

		// Find and show the initial slide
		var startSlide = $(".wpv-slide-wrapper.active", elem);
		if (!startSlide.length) {
			startSlide = $(".wpv-slide-wrapper", elem).eq(_cfg.start_slide || 0);
		}
		startSlide.addClass("active").show(); //.closest(".wpv-view").css("visibility", "visible");
		_inst.setExpanded(_cfg.expand);

		_inst.setFX(_cfg.effect);

		// Show the arrows if needed
		_inst.setShowArrows(_cfg.show_arrows && len > 1);

		// Show the pager if needed
		_inst.setShowBullets(_cfg.show_bullets && len > 1);

		// Show the captions?
		_inst.setShowCaption(_cfg.show_caption);

		// Autorun the slideshow if needed
		//if (_cfg.auto_direction == "left" || _cfg.auto_direction == "right") {
		//  _inst.start(_cfg.pause_time);
		//}
		//
		startSlide.closest(".wpv-view").css("visibility", "visible");

		_outerWrapper.addClass("wpv-ready");

		// Trigger the "sliderready" event
		$elem.trigger("sliderready", [_inst]);
	}

	WPVSlider.getInstance = function (elem, options) {
		var inst = $.data(elem, "WPVSlider");
		if (!inst) {
			inst = new WPVSlider(elem, options);
			$.data(elem, "WPVSlider", inst);
		}
		return inst;
	};

	// Expose the constructor
	$.WPVSlider = WPVSlider;

	$.WPVSlider.Util = {
		getDirection: function (from, to, all) {
			var fromIndex = all.index(from);
			var toIndex = all.index(to);
			if (fromIndex === 0 && toIndex == all.length - 1) {
				return "prev";
			}
			if (fromIndex == all.length - 1 && toIndex === 0) {
				return "next";
			}
			if (fromIndex < toIndex) {
				return "next";
			}
			if (fromIndex > toIndex) {
				return "prev";
			}
		}
	};

	/**
	 * Public container for transition effects (available as jQuery.WPVSlider.fx)
	 */
	WPVSlider.fx = {};

	// Built-in Effects ----------------------------------------------------------
	WPVSlider.fx.fade = {
		run: function (cfg) {
			cfg = $.extend({
				duration: 1000,
				easing: "linear"
			}, cfg);
			cfg.toShow.css({
				opacity: 0,
				zIndex: 3
			}).show();

			//var w1 = cfg.toHide ? $("> .wpv-slide", cfg.toHide).width() : 0;
			//var h1 = cfg.toHide ? $("> .wpv-slide", cfg.toHide).height() : 0;
			//var w2 = $("> .wpv-slide", cfg.toShow).width();
			//var h2 = $("> .wpv-slide", cfg.toShow).height();
			//if (cfg.toHide && (w1 > w2 || h1 > h2)) {
			cfg.toHide.fadeTo(cfg.duration, 0, "linear", function () {
				cfg.toHide.css({
					display: "none",
					opacity: 1
				});
			});
			//}
			cfg.toShow.animate({
				opacity: 1
			}, cfg.duration, cfg.easing, function () {
				cfg.toHide.hide();
				cfg.callback();
			});

			cfg.toHide.css({
				zIndex: 2
			});
		}
	};

	WPVSlider.fx.slide = {
		run: function (cfg) {
			cfg = $.extend({
				duration: 800,
				easing: "easeOutExpo"
			}, cfg);
			//console.log(cfg.toShow.data("Slide").width)
			cfg.toShow.css({
				//left: cfg.toShow.width() * (cfg.dir == "next" ? 1 : -1),
				left: cfg.toShow.data("Slide").width * (cfg.dir == "next" ? 1 : -1),
				zIndex: 3
			}).show();



			//var w1 = cfg.toHide ? $("> .wpv-slide", cfg.toHide).width() : 0;
			//var h1 = cfg.toHide ? $("> .wpv-slide", cfg.toHide).height() : 0;
			//var w2 = $("> .wpv-slide", cfg.toShow).width();
			//var h2 = $("> .wpv-slide", cfg.toShow).height();
			//if (cfg.toHide && (w1 > w2 || h1 > h2)) {
			cfg.toHide.fadeTo(cfg.duration, 0, "linear", function () {
				cfg.toHide.css({
					display: "none",
					opacity: 1
				});
			});
			//}
			cfg.toShow.animate({
				left: 0
			}, cfg.duration, cfg.easing, function () {
				cfg.toHide.stop(1, 0).hide();
				cfg.callback();
			});

			if (cfg.toHide) {
				cfg.toHide.css({
					zIndex: 2
				});
			}

		}
	};

	WPVSlider.fx.random = {
		run: function () {
			var fx = [];
			for (var name in WPVSlider.fx) {
				if (name != "random") {
					fx.push(name);
				}
			}
			return WPVSlider.fx[fx[Math.floor(Math.random() * fx.length)]].run.apply(this, arguments);
		}
	};
	// ---------------------------------------------------------------------------
	/**
	 * And some public static caption effects that the effects may refer to
	 */
	WPVSlider.captionFx = {};

	/**
	 * Caption effects factory
	 */
	WPVSlider.createCaptionFx = function (cfg, hideFn, showFn, onComplete) {

		var queue = (function () {

			var q = [];

			function next() {
				if (q.length) {
					q.shift()(next);
				} else {
					onComplete();
				}
			}

			function add(fn) {
				q.push(fn);
			}

			return {
				next: next,
				add: add
			};

		})();

		if (!$.isArray(hideFn)) {
			hideFn = hideFn ? [hideFn] : [];
		}

		if (!$.isArray(showFn)) {
			showFn = showFn ? [showFn] : [];
		}

		return function () {

			$.each(hideFn, function (i, fn) {
				queue.add(function (next) {
					setTimeout(function () {
						fn(next);
					}, cfg.delay || 0);
				});
			});

			$.each(showFn, function (i, fn) {
				queue.add(function (next) {
					setTimeout(function () {
						fn(next);
					}, cfg.delay || 0);
				});
			});

			queue.next();
		};
	};

	/**
	 * Just show/hide captions without animation (but thay still can have delays)
	 */
	WPVSlider.captionFx.toggle = function (cfg, callback) {
		if (cfg.newCaption.length) {
			$(cfg.newCaption).hide();
		}
		WPVSlider.createCaptionFx(
		cfg, function (next) { // hideFn
			if (cfg.oldCaption.length) {
				$(cfg.oldCaption).hide();
			}
			next();
		}, function (next) { // showFn
			if (cfg.newCaption.length) {
				$(cfg.newCaption).show();
			}
			next();
		}, callback || $.noop)();
	};

	/**
	 * Fade-in/out both captions at the same time
	 */
	WPVSlider.captionFx.fadeToggle = function (cfg, callback) { //console.log(arguments)
		if (cfg.newCaption.length) {
			$(cfg.newCaption).fadeOut(0);
		}
		WPVSlider.createCaptionFx(
		cfg, function (next) { // hideFn
			if (cfg.oldCaption.length) {
				$(cfg.oldCaption).fadeIn(0).fadeOut(cfg.speed, "linear");
			}
			next();
		}, function (next) { // showFn
			if (cfg.newCaption.length) {
				$(cfg.newCaption || []).fadeTo(cfg.speed, cfg.slider.options.caption_opacity, "linear", next);
			} else {
				next();
			}
		}, callback || $.noop)();
	};


	// The jQuery Plugin ---------------------------------------------------------
	$.fn.wpvSlider = function (opt) {

		var _args = arguments,
			result;

		var isMethodCall = typeof opt == "string";

		this.each(function (i, o) {

			// Method call
			if (isMethodCall) {
				if (opt.charAt(0) != "_") {
					var _inst = WPVSlider.getInstance(o);
					if (_inst && $.isFunction(_inst[opt])) {
						result = _inst[opt].apply(_inst, Array.prototype.slice.call(_args, 1));
						if (result !== undefined) {
							return false; // break each
						}
					}
					_inst = null; // free object refs
				}
			}

			// Create instance
			else {
				WPVSlider.getInstance(o, opt);
			}
		});

		_args = null; // free object refs
		return isMethodCall ? result : this;
	};
	
	$(window).bind("keydown", function(e) {
		if (e.shiftKey) {
			//console.log(e.keyCode);
			switch (e.keyCode) {
				case 67: // Shift + C
					jQuery('.wpv-view').wpvSlider("setResizing", "crop");
					break;
				case 70: // Shift + F
					jQuery('.wpv-view').wpvSlider("setResizing", "fit");
					break;
				case 83: // Shift + S
					jQuery('.wpv-view').wpvSlider("setResizing", "stretch");
					break;
			}
		}
	})
	
})(jQuery);