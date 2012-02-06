if (typeof dot === "undefined") dot = {};

/* static const */
dot.CANVAS_MODE = {
	"DRAW": "draw",
	"HAND": "hand"
};


/* 캔버스 데이터 관리 모델 */
dot.Canvas = Backbone.Model.extend({
	defaults: {
		pixel: [],
		color: "#000000",
		width: 16,
		height: 16,
		actualWidth: 320,
		actualHeight: 320,
		psize: {},
		offset: {
			x: 0,
			y: 0
		},
		grid: true,
		gridColor: "#eaeaea",
		stepSize: 10,
		mode: dot.CANVAS_MODE.DRAW
	},

	initialize: function(options) {
		if (options) {
			this.set("actualWidth", options.width);
			this.set("actualHeight", options.height);
		}
		this._initPixel();
	},

	_initPixel: function() {
		var w = this.get("width"),
			h = this.get("height"),
			p = new Array(w);

		for (var i=0; i<w; i++) {
			p[i] = new Array(h);
		}

		this.set({ 
			pixel: p,
			psize: this._calcPixelSize()
		});
	},

	_calcPixelSize: function() {
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
		if (!c) c = this.defaults.color;
		this.set({ color: c.toLowerCase() });
	},

	clearPixel: function(force) {
		if (!force && !confirm(dot.Text.get("C_CLEAR"))) return;
		this.unset("pixel");
		this._initPixel(this.get("width"), this.get("height"));
		this.trigger("canvas:update");
	},

	setGridMode: function(b) {
		if (typeof b === "undefined") b = true;
		this.set("grid", b);
		this.trigger("canvas:update");
	},

	setHandMode: function(b) {
		var mode = (b || typeof b === "undefined") ? dot.CANVAS_MODE.HAND : dot.CANVAS_MODE.DRAW;
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
		this.set("psize", this._calcPixelSize());
		this.move((ssize * pm) / -2, (ssize * pm) / -2);
	},

	move: function(x, y) {
		var o = this.get("offset");
		this.set("offset", {
			x: o.x + x,
			y: o.y + y
		});
		this.trigger("canvas:update");
	},

	fit: function() {
		this.set({
			actualWidth: this.defaults.actualWidth,
			actualHeight: this.defaults.actualHeight,
			offset: { x: 0, y: 0 }
		});
		this.set("psize", this._calcPixelSize());
		this.trigger("canvas:update");
	}
});

/* 캔버스를 보여주고 컨트롤하는 뷰 */
dot.CanvasView = Backbone.View.extend({
	tagName: "div",
	className: "canvas-wrap",
	events: {
		"touchstart canvas": 		"handle",
		"touchmove canvas": 		"handle",
		"touchend canvas": 			"handle",
		"gesturechange canvas": 	"gesture" 
	},
	hasTouchEvent: ("ontouchstart" in window),
	hasHold: false,
	hasMove: false,

	initialize: function() {
		this.model = new dot.Canvas;
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
			this.events["mousedown canvas"] = "handle";
			this.events["mousemove canvas"] = "handle";
			this.events["mouseup canvas"] = "handle";
		}
		this.delegateEvents(this.events);
	},

	render: function() {
		var p = this.model.get("pixel"),
			psize = this.model.get("psize"),
			grid = this.model.get("grid"),
			gridColor = this.model.get("gridColor"),
			offset = this.model.get("offset"),
			cx, cy, cw, ch;
		
		this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
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

	handle: function(ev) {
		var e = (ev.originalEvent.touches && ev.originalEvent.touches[0]) ? 
					ev.originalEvent.touches[0] : ev,
			o = this.model.get("offset"),
			x = (e.pageX || this.lastX) - this.$canvas.offset().left,
			y = (e.pageY || this.lastY) - this.$canvas.offset().top;

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
				if (this.hasHold) {
					if (this.model.get("mode") == dot.CANVAS_MODE.DRAW) {
						this.model.point(x - o.x, y - o.y, true);
					} else if (this.model.get("mode") == dot.CANVAS_MODE.HAND) {
						this.model.move(x - this.lastX, y - this.lastY);
					}
					this.hasMove = true;
				}
				this.lastX = x;
				this.lastY = y;
				break;

			case "touchend":
			case "mouseup":
				if (!this.hasMove && this.model.get("mode") == dot.CANVAS_MODE.DRAW) {
					this.model.point(x - o.x, y - o.y);
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
		var cs = mode == dot.CANVAS_MODE.HAND ? (dot.Util.cssPrefix()+"grab") : "crosshair";
		this.$canvas.css({ cursor: cs });
	}

});


