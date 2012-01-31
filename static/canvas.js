var Canvas = Backbone.Model.extend({
	defaults: {
		pixel: [],
		color: "#000000",
		width: 16,
		height: 16,
		actualWidth: 295,
		actualHeight: 295,
		psize: {},
		grid: true,
		gridColor: "#eaeaea"
	},

	initialize: function() {
		this.initPixel(this.get("width"), this.get("height"));
	},

	initPixel: function(w, h) {
		var p = new Array(w),
			psize = this.get('psize');

		for (var i=0; i<w; i++) {
			p[i] = new Array(h);
		}
		psize.width = this.get('actualWidth') / w;
		psize.height = this.get('actualHeight') / h;

		this.set({ 
			pixel: p,
			psize: psize
		});
	},

	point: function(x, y, drag) {
		var p = this.get('pixel'),
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
		this.set({ grid: b });
		this.trigger("canvas:update");
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

		this.canvas = document.createElement('canvas');
		this.ctx = this.canvas.getContext('2d');

		$(this.canvas).attr({ 
			width: this.model.get("actualWidth"), 
			height: this.model.get("actualHeight")
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
		$(this.canvas).css({ border: "1px solid #900" });
	},

	render: function() {
		var p = this.model.get("pixel"),
			psize = this.model.get("psize"),
			grid = this.model.get("grid"),
			gridColor = this.model.get("gridColor"),
			cx, cy, cw, ch;
		
		for (var x=0; x<p.length; x++) {
			for (var y=0; y<p[x].length; y++) {
				cx = x * psize.width, 
				cy = y * psize.height, 
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
			offset = $(this.canvas).offset(),
			x = (e.pageX || this.lastX) - offset.left,
			y = (e.pageY || this.lastY) - offset.top;

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
	}

});