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
	$("#colorPicker").click(function() {
		console.log("open colorPicker!")
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