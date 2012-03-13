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
		csize: {},
		offset: {
			x: 0,
			y: 0
		},
		grid: true,
		gridColor: "#eaeaea",
		stepSize: 10,
		mode: dot.CANVAS_MODE.DRAW,
		history: [],
		undoSize: 10
	},

	initialize: function(options) {
		this.on("change:pixel", this._stackDo);
		this.on("change:width change:height change:actualWidth change:actualHeight", function() {
			this.set("psize", this._calcPixelSize());
		});
		if (options) {
			this.set("width", options.width);
			this.set("height", options.height);
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

	_clonePixel: function() {
		var p = this.get("pixel"),
			bf = [];
		for (var i=0, len=p.length; i<len; i++) {
			bf[i] = _.clone(p[i]);
		}
		return bf;
	},

	_stackDo: function(model, val) {
		var h = this.get("history");
		if (this.previous("pixel").length <= 0 || this._ignoreStack) {
			this._ignoreStack = false;
			return;
		}

		if (h.index < h.length - 1) {
			h.splice(h.index);
		}
		
		h.push(this.previous("pixel"));
		if (h.length > this.get("undoSize")) {
			delete h[0];
			h.shift();
		}
		h.index = h.length - 1;
		this.set("history", h);
		this.trigger("canvas:undo", false);
		this.trigger("canvas:redo", true);
	},

	_saveLocal: function() {
		
	},

	_clearHistory: function() {
		this.set("history", new Array);
		this.trigger("canvas:undo", true);
	},

	_getImageData: function() {
		if (typeof this.canvas === "undefined" || !("toDataURL" in this.canvas))
			return false;
		return this.canvas.toDataURL();
	},

	point: function(x, y, options) {
		var drag = !!(options && options.drag),
			ignore = options && options.ignore,
			p = this._clonePixel(),
			ratio = this.get("width") / this.get("actualWidth"),
			aX = Math.floor(x * ratio),
			aY = Math.floor(y * ratio);

		if (p.length <= aX || p[0].length <= aY) return;
		
		if (!ignore) {
			p[aX][aY] = this.get("color");
		}
		this.set("pixel", p, { silent: drag });
		this.trigger("canvas:update");
	},

	setColor: function(c) {
		if (!c) c = this.defaults.color;
		this.set({ color: c.toLowerCase() });
	},

	clearPixel: function(force) {
		if (!force && !confirm(dot.Text.get("C_CLEAR"))) return;
		this.unset("pixel", { silent: true });
		this._initPixel(this.get("width"), this.get("height"));
		this._clearHistory();
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
			// pm = s > 0 ? 1 : -1;
			pm = s;

		this.set({
			actualWidth: aw + (ssize * pm),
			actualHeight: ah + (ssize * pm)
		});
		this.set("psize", this._calcPixelSize());
		this.move((ssize * pm) / -2, (ssize * pm) / -2);
	},

	move: function(x, y) {
		var o = this.get("offset"),
			csize = this.get("csize");

		this.set("offset", {
			x: Math.max(Math.min(o.x + x, 0), csize.width - this.get("actualWidth")),
			y: Math.max(Math.min(o.y + y, 0), csize.height - this.get("actualHeight"))
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
	},

	origin: function() {
		var ratio = this.get("width") / this.defaults.width,
			aw = this.get("csize").width * ratio,
			ah = this.get("csize").height * ratio,
			ox = (aw - this.get("csize").width) / -2,
			oy = (ah - this.get("csize").height) / -2;

		this.set({
			actualWidth: aw,
			actualHeight: ah,
			offset: { x: ox , y: oy }
		});
		this.set("psize", this._calcPixelSize());
		this.trigger("canvas:update");
	},

	undo: function() {
		var h = this.get("history"),
			p = this.get("pixel");

		if (!h || typeof h.index === "undefined" || h.index <= 0) return;

		this._ignoreStack = true;
		if (h.index == h.length - 1) {
			h.push(p);
		} else {
			h.index--;
		}
		this.set("pixel", h[h.index]);

		if (h.index == 0) this.trigger("canvas:undo", true);
		this.trigger("canvas:redo", false);
		this.trigger("canvas:update");
	},

	redo: function() {
		var h = this.get("history");
		if (typeof h.index === "undefined") return;

		this._ignoreStack = true;
		if (h.index < h.length - 1) {
			h.index++;
			this.set("pixel", h[h.index]);
		} else {
			return false;
		}

		if (h.index == h.length - 1) {
			h.pop();
			h.index--;
			this.set("history", h);
			this.trigger("canvas:redo", true);
		}
		this.trigger("canvas:undo", false);
		this.trigger("canvas:update");
	},

	exports: function() {
		var data,
			currentGrid = this.get("grid");
		
		this.setGridMode(false);
		this.fit();
		data = this._getImageData();
		this.setGridMode(currentGrid);

		if (data) {
			return data;
		} else {
			alert(dot.Text.get("CANT_SAVE"));
			return false;
		}
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

	initialize: function(options) {
		options = options || {};
		this.model = new dot.Canvas({
			width: options.width,
			height: options.height
		});
		this.model.bind("canvas:update", this.render, this);
		this.model.bind("canvas:modechange", this.cursorChange, this);

		this.$canvas = $("<canvas></canvas>");
		this.canvas = this.model.canvas = this.$canvas[0];
		this.ctx = this.canvas.getContext('2d');

		if (options.target) {
			this.$target = $(options.target);
			this.model.set({
				actualWidth: this.$target.width(),
				actualHeight: this.$target.height(),
				csize: {
					width: this.$target.width(),
					height: this.$target.height()
				}
			});
		}

		this.$canvas.attr({ 
			width: this.model.get("actualWidth"), 
			height: this.model.get("actualHeight"),
			style: "cursor:crosshair"
		});
		$(this.el).append(this.canvas);

		this.$target.html(this.el);
		this.model.origin();

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
						this.model.point(x - o.x, y - o.y, { drag:true });
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
				if (this.model.get("mode") == dot.CANVAS_MODE.DRAW) {
					this.model.point(x - o.x, y - o.y, { ignore:this.hasMove });
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


