(function ($) {

	var regEmpty = /^\s*$/;
	var regEmail = /^([a-zA-Z0-9_\.\-])+\@(([a-zA-Z0-9\-])+\.)+([a-zA-Z0-9]{2,4})+$/;
	var errors = {
		"cant-be-empty": "This field is required",
		"must-be-email": "Please enter a valid email address"
	};

	function validateField($fld, noFocus) {
		var val = $fld.val();
		
		hideErrors($fld);

		if ($fld.is('[required]') && regEmpty.test(val)) {
			setTimeout(function () {
				showError($fld, "cant-be-empty", noFocus);
			}, 0);
			return false;
		}

		if ($fld.is('[type="email"]') && !regEmail.test(val)) {
			showError($fld, "must-be-email", noFocus);
			return false;
		}

		return true;
	}
	
	function hideErrors($fld) {
		$fld.removeClass('invalid');
	}

	function showError($fld, msgClass, noFocus) {
		var form = $fld[0].form;

		var msg = $fld.attr("data-" + msgClass);
		if (!msg) {
			msg = errors[msgClass];
		}

		$fld.addClass('invalid');

		label = $(".error-message", form);
		if (!label.length) {
			label = $('<div class="error-message"/>');
		}

		label = label.stop(1, 1).css({
			left: 0,
			opacity: 0
		}).text(msg).appendTo($fld.closest(".form-field-wrapper"));

		label.animate({
			left: ["100%", "easeOutExpo"],
			opacity: [1, "linear"]
		}, 500);

		if (!noFocus) {
			$fld.trigger("focus");
		}
	}

	// Plugin 
	$.fn.validator = function () {
		return this.filter("form").each(function (i, f) {

			// turn off the native validation if any
			f.noValidate = true;
      
			$(f.elements).not(":button, :checkbox, :radio, :submit, :reset, fieldset, label, form").each(function () {
				$fld = $(this);

				var fld_width = $fld.outerWidth({margin: true});
				$fld.wrap( $('<div class="form-field-wrapper"/>').css({	width: fld_width }) ).css({
					width: $fld.width()
				});

				$fld.unbind("change.validateForm keyup").bind("change.validateForm keyup", function (e) {
					if (e.type == "keyup" && e.keyCode == 9) {
						return true;
					}
					$fld.toggleClass("invalid", !validateField($(this), true));
				});
			});

			f.validate = function (noFocus) {
				$(".error-message", this).css({
					opacity: 0
				});
				for (var j = 0; j < this.elements.length; j++) {
					if (!validateField($(this.elements[j]), noFocus)) {
						return false;
					}
				}
				return true;
			};

			$(f).unbind("submit.validateForm").bind("submit.validateForm", function () {
				return f.validate();
			}).unbind("reset.validateForm").bind("reset.validateForm", function () {
				$(this.elements).removeClass("invalid");
			});
		});
	};

})(jQuery);