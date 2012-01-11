$(document).ready(function() {
	// layout managing
	var controlLayout = function(){
		var stageHeight = window.innerHeight - $("#toolbar").height();
		$("#stage").height(stageHeight);
	};
	controlLayout();
	$(window).resize(function(){
		controlLayout();
	});
});