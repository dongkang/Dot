var CanvasMode = {
	"DRAW": "draw",
	"HAND": "hand"
};

var Canvas = Backbone.Model.extend({
	defaults: {
		pixel: [],
		color: "#000000",
		width: 16,
		height: 16,
		actualWidth: 280,
		actualHeight: 280,
		psize: {},
		offset: {
			x: 0,
			y: 0
		},
		grid: true,
		gridColor: "#eaeaea",
		stepSize: 10,
		mode: CanvasMode.DRAW
	},

	initialize: function(options) {
		if (options) {
			this.set("actualWidth", options.width);
			this.set("actualHeight", options.height);
		}
		this.initPixel();
	},

	initPixel: function() {
		var w = this.get("width"),
			h = this.get("height"),
			p = new Array(w);

		for (var i=0; i<w; i++) {
			p[i] = new Array(h);
		}

		this.set({ 
			pixel: p,
			psize: this.calcPixelSize()
		});
	},

	calcPixelSize: function() {
		var psize = {};
		psize.width = this.get("actualWidth") / this.get("width");
		psize.height = this.get("actualHeight") / this.get("height");
		return psize;
	},

	point: function(x, y, drag) {
		var p = this.get("pixel"),
			ratio = this.get("width") / this.get("actualWidth"),
			aX = Math.floor(x * ratio),
			aY = Math.floor(y * ratio);
		
		if (p.length <= aX || p[0].length <= aY) return;
		
		p[aX][aY] = (p[aX][aY] && !drag) ? null : this.get("color");
		this.trigger("canvas:update");
	},

	setColor: function(c) {
		this.set({ color: c });
	},

	clearPixel: function() {
		this.unset("pixel");
		this.initPixel(this.get("width"), this.get("height"));
		this.trigger("canvas:update");
	},

	setGridMode: function(b) {
		this.set("grid", b);
		this.trigger("canvas:update");
	},

	setHandMode: function(b) {
		var mode = b ? CanvasMode.HAND : CanvasMode.DRAW;
		this.set("mode", mode);
		this.trigger("canvas:modechange", mode);
	},

	scale: function(s) {
		var aw = this.get("actualWidth"),
			ah = this.get("actualHeight"),
			ssize = this.get("stepSize"),
			pm = s > 0 ? 1 : -1;

		this.set({
			actualWidth: aw + (ssize * pm),
			actualHeight: ah + (ssize * pm)
		});
		this.set("psize", this.calcPixelSize());
		this.move((ssize * pm) / -2, (ssize * pm) / -2);
		this.trigger("canvas:update");
	},

	move: function(x, y) {
		var o = this.get("offset");
		this.set("offset", {
			x: o.x + x,
			y: o.y + y
		});
	}
});

var CanvasView = Backbone.View.extend({
	tagName: "div",
	className: "canvas-wrap",
	events: {
		"touchstart canvas": 		"draw",
		"touchmove canvas": 		"draw",
		"touchend canvas": 			"draw",
		"gesturechange canvas": 	"gesture" 
	},
	hasTouchEvent: ("ontouchstart" in window),
	hasHold: false,
	hasMove: false,

	initialize: function() {
		this.model = new Canvas;
		this.model.bind("canvas:update", this.render, this);
		this.model.bind("canvas:modechange", this.cursorChange, this);

		this.$canvas = $("<canvas></canvas>");
		this.canvas = this.$canvas[0];
		this.ctx = this.canvas.getContext('2d');

		this.$canvas.attr({ 
			width: this.model.get("actualWidth"), 
			height: this.model.get("actualHeight"),
			style: "cursor:crosshair"
		});
		$(this.el).append(this.canvas);
		$("#app").html(this.el);
		this.render();

		/* for PC Browser */
		if (!this.hasTouchEvent) {
			this.events["mousedown canvas"] = "draw";
			this.events["mousemove canvas"] = "draw";
			this.events["mouseup canvas"] = "draw";
		}
		this.delegateEvents(this.events);

		/* debug */
		this.$canvas.css({ border: "1px solid #900" });
	},

	render: function() {
		var p = this.model.get("pixel"),
			psize = this.model.get("psize"),
			grid = this.model.get("grid"),
			gridColor = this.model.get("gridColor"),
			offset = this.model.get("offset"),
			cx, cy, cw, ch;
		
		for (var x=0; x<p.length; x++) {
			for (var y=0; y<p[x].length; y++) {
				cx = x * psize.width + offset.x, 
				cy = y * psize.height + offset.y, 
				cw = psize.width, 
				ch = psize.height;

				if (grid) {
					this.ctx.strokeStyle = gridColor;
					this.ctx.strokeRect(cx, cy, cw, ch);
				}
				this.ctx.fillStyle = p[x][y] || "#ffffff";
				this.ctx.fillRect(cx, cy, cw, ch);
			}
		}

		return this;
	},

	draw: function(ev) {
		var e = (ev.originalEvent.touches && ev.originalEvent.touches[0]) ? 
					ev.originalEvent.touches[0] : ev,
			offset = this.$canvas.offset(),
			x = (e.pageX || this.lastX) - offset.left - this.model.get("offset").x,
			y = (e.pageY || this.lastY) - offset.top - this.model.get("offset").y;

		ev.preventDefault();
		ev.stopPropagation();
		switch (ev.type) {
			case "touchstart":
			case "mousedown":
				this.hasHold = true;
				this.hasMove = false;
				this.lastX = x;
				this.lastY = y;

				break;
			case "touchmove":
			case "mousemove":
				this.lastX = x;
				this.lastY = y;
				if (this.hasHold) {
					this.model.point(x, y, true);
					this.hasMove = true;
				}

				break;
			case "touchend":
			case "mouseup":
				if (!this.hasMove) {
					this.model.point(x, y);
				}
				this.hasHold = false;
				this.hasMove = false;

				break;
			default: return;
		}

		
	},

	gesture: function(ev) {
		var e = ev.originalEvent;
		console.log("CanvasView.gesture() : " + e.scale + " / " + e.rotation);
	},

	cursorChange: function(mode) {
		var cs = mode == CanvasMode.HAND ? "-webkit-grab" : "crosshair";
		this.$canvas.css({ cursor: cs });
	}

});


