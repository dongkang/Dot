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

	// handle colorPicker
	$("#colorPicker").toggle(function() {
		var layer = $("#layer-colorpicker");
		var offset = layer.offset().top - $("#toolbar").offset().top + layer.height();
		layer.css("position", "relative");
		layer.css("top", -offset+"px");
	}, function() {
		var layer = $("#layer-colorpicker");
		layer.css("position", "static");
		layer.css("top", "auto");
	});

	// change mode
	$("input[name=mode]").change(function() {
		console.log("change mode!");
	});

	// undo action
	$("#btnUndo").click(function() {
		console.log("undo!");
	});

	// redo action
	$("#btnRedo").click(function() {
		console.log("redo!");
	});

	// show menu
	$("#btnMenu").click(function() {
		console.log("show menu!");
	});
});