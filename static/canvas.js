var Canvas = Backbone.Model.extend({
	defaults: {
		
	}
});

var CanvasView = Backbone.View.extend({
	tagName: "div",
	className: "canvas-wrap",
	events: {
		"touchstart canvas": 		"draw"
	},
	initialize: function() {
		console.log("CanvasView.initialize()");
		this.canvas = document.createElement('canvas');
		this.ctx = this.canvas.getContext('2d');

		$(this.canvas).attr({ width: 200, height: 200 }).css({ border: "1px solid #900" });
		$(this.el).append(this.canvas);
		$("#app").html(this.el);
		$(this.canvas).bind('gesturechange', this.gesture);
	},
	render: function() {
		console.log("CanvasView.render()");
	},
	draw: function() {
		console.log("CanvasView.draw()");

	},
	gesture: function(ev) {
		console.log("CanvasView.gesture() : " + ev.scale + " / " + ev.rotation);
	}
});