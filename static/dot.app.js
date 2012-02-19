var dot = {
	router: {},
	view: {},
	canvas: {},
};

dot.App = {
	initialize: function() {
		this.router = new this._router();
		this.view = new this._view({ model: this._model });

		Backbone.history.start();
	},

	// url 컨트롤 라우터
	_router: Backbone.Router.extend({
		routes: {
			"": "defaults"
		},
		defaults: function() {
			
		}
	}),

	// app 전체 model
	_model: Backbone.Model.extend({

	}),

	// app 전체 view
	_view: Backbone.View.extend({
		el: "#app",
		events: {
			"click .btn-draw": "selectDraw",
			"click .btn-move": "selectMove",
			"click .btn-undo": "undo",
			"click .btn-redo": "redo",
			"click .btn-clear": "clear"
		},

		initialize: function() {
			this.$canvas = $(".canvas");
			dot.App.canvas = this.canvas = new dot.CanvasView({ target: this.$canvas }).model;

			new dot.UI.Slider({ 
				target: $(".item-slider"),
				handler: {
					move: _.bind(this.scale, this),
					minus: _.bind(this.zoomOut, this),
					plus: _.bind(this.zoomIn, this)
				}
			});

			this.scrollTop();
			$(window).bind("orientationchange", this.scrollTop);
		},

		scrollTop: function() {
			setTimeout(window.scrollTo, 0, 0, 1);
		},


		selectDraw: function() {
			this.canvas.setHandMode(false);
		},

		selectMove: function() {
			this.canvas.setHandMode(true);
		},

		undo: function() {
			this.canvas.undo();
		},

		redo: function() {
			this.canvas.redo();
		},

		clear: function() {
			this.canvas.clearPixel();
		},

		scale: function(val) {
			this.canvas.scale(val);
		},

		zoomOut: function() {
			this.canvas.scale(-3);
		},

		zoomIn: function() {
			this.canvas.scale(3);
		}

	})

};


dot.Util = {
	cssPrefix: function() {
		var b = $.browser;
		return (b["mozilla"] ? "moz" : b["webkit"] ? "webkit" : b["opera"] ? "opera" : "").replace(/(.*)/, "-$1-");
	}
};


dot.Text = {
	loc: "ko",
	get: function(id) {
		try {
			return this[this.loc][id];
		} catch(ex) {
			return "???";
		}
	},
	change: function(l) {
		this.loc = l;
	},

	"ko": {
		"LANGUAGE": "언어",
		"C_CLEAR": "정말 삭제 하시겠습니까?\n이 작업은 되돌릴 수 없습니다.",
		"CANT_SAVE": "저장을 지원하지 않는 기기 입니다."
	},
	"en": {
		"LANGUAGE": "Language",
		"C_CLEAR": "Do you want clear?\nIt can't be restore!"
	}
};
