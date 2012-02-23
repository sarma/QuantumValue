jQuery(function($) {
	$('form.contact_form').validator().submit(function(e) {
		var form = $(this);
		if (!e.isDefaultPrevented()) {
			$.post(this.action,{
				'to': $('input[name="contact_to"]', form).val(),
				'name': $('input[name="contact_name"]', form).val(),
				'email': $('input[name="contact_email"]', form).val(),
				'content': $('textarea[name="contact_content"]', form).val()
			},function(data){
				form.fadeOut('fast', function() {
					form.siblings('p').show();
				});
			});
		}
		e.preventDefault();
	});
});