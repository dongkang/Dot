var Canvas = Backbone.Model.extend({
	defaults: {
		pixel: [],
		width: 32,
		height: 32,
		actualWidth: 288,
		actualHeight: 288,
		psize: {
			width: 9,
			height: 9
		}
	},

	initialize: function() {
		this.initPixel(this.get("width"), this.get("height"));
	},

	initPixel: function(w, h) {
		var p = new Array(w);
		for (var i=0; i<w; i++) {
			p[i] = new Array(h);
		}
		this.set({ pixel: p });
	},

	point: function(x, y) {
		var p = this.get('pixel'),
			ratio = this.get("width") / this.get("actualWidth"),
			aX = Math.floor(x * ratio),
			aY = Math.floor(y * ratio);

		p[aX][aY] = p[aX][aY] ? null : "#000000";
		this.trigger("canvas:update");
	},

	clearPixel: function() {
		this.unset("pixel");
		this.initPixel(this.get("width"), this.get("height"));
		this.trigger("canvas:update");
	}
});

var CanvasView = Backbone.View.extend({
	tagName: "div",
	className: "canvas-wrap",
	events: {
		"touchstart canvas": 		"draw",
		"gesturechange canvas": 	"gesture" 
	},
	hasTouchEvent: ("ontouchstart" in window),

	initialize: function() {
		this.model = new Canvas;
		this.model.bind("canvas:update", this.render, this);

		this.canvas = document.createElement('canvas');
		this.ctx = this.canvas.getContext('2d');

		$(this.canvas).attr({ 
			width: this.model.get("actualWidth"), 
			height: this.model.get("actualHeight")
		});
		$(this.el).append(this.canvas);
		$("#app").html(this.el);

		/* for PC Browser */
		if (!this.hasTouchEvent) {
			this.events["mousedown canvas"] = "draw";
		}
		this.delegateEvents(this.events);

		/* debug */
		$(this.canvas).css({ border: "1px solid #900" });
	},

	render: function() {
		var p = this.model.get("pixel"),
			psize = this.model.get("psize");
		
		for (var x=0; x<p.length; x++) {
			for (var y=0; y<p[x].length; y++) {
				this.ctx.fillStyle = p[x][y] || "#ffffff";
				this.ctx.fillRect(x * psize.width, y * psize.height, psize.width, psize.height);
			}
		}
	},

	draw: function(ev) {
		console.log('DRAW!');
		var e = ev.originalEvent.touches ? ev.originalEvent.touches[0] : ev,
			offset = $(this.canvas).offset(),
			x = e.pageX - offset.left,
			y = e.pageY - offset.top;

		this.model.point(x, y);
	},

	gesture: function(ev) {
		var e = ev.originalEvent;
		console.log("CanvasView.gesture() : " + e.scale + " / " + e.rotation);
	}
});