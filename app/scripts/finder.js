$(function(){
	var finder = (function(){
		return {
			"key" : {}
		};
	});
	// initialize function
	$.fn.extend( {
		'finder': finder
	});

});