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
		dot.Util.fullscreen();
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
			"click .mode-toggle": "toggleMode",
			"click .btn-color": "toggleColor",
			"click .btn-undo": "undo",
			"click .btn-redo": "redo",
			"click .btn-clear": "clear"
		},

		$canvas: null,
		canvas: null,
		slider: null,
		colorPicker: null,

		initialize: function() {
			this.$canvas = $(".canvas");
			dot.App.canvas = this.canvas = new dot.CanvasView({ 
				target: this.$canvas,
				width: 48,
				height: 48
			}).model;

			this.initInterface();
			this.initUndoEvent();
			this.scrollTop();
			setTimeout($.proxy(function() {
				this.verticalAlign();
			}, this), 500);
			$(window).bind("orientationchange", this.scrollTop);
		},

		initInterface: function() {
			this.slider = new dot.UI.Slider({ 
				target: $(".item-slider"),
				max: 128,
				value: 64
			}).on("change", $.proxy(this.scale, this));

			this.colorPicker = new dot.UI.ColorPicker($(".stage")[0], 15);
			this.colorPicker.$canvas
				.attr({ 
					width:this.$canvas.width(), 
					height:this.$canvas.width() * 0.5 
				})
				.addClass("color-picker hide");
			this.colorPicker.render(this.$canvas.width(), this.$canvas.width() * 0.5);
			$(this.colorPicker).on("selected", $.proxy(this.selectColor, this));
		},

		verticalAlign: function() {
			var menuHeight = 0,
				margin;

			$(".menu").each(function(i, el) {
				menuHeight += $(el).height();
			});
			margin = Math.round((window.innerHeight - menuHeight - this.$canvas.height()) * 0.5) - 2;
			this.$canvas.css({
				"margin-top": margin,
				"margin-bottom": margin
			});
		},

		scrollTop: function() {
			setTimeout(window.scrollTo, 0, 0, 1);
		},

		toggleMode: function(ev) {
			var $el = $(ev.target);
			if ($el.hasClass("btn-move")) {
				$el.removeClass("btn-move").removeClass("ico-move")
					.addClass("btn-draw").addClass("ico-pen");
				this.canvas.setHandMode(true);
			} else {
				$el.removeClass("btn-draw").removeClass("ico-pen")
					.addClass("btn-move").addClass("ico-move");
				this.canvas.setHandMode(false);
			}
		},

		toggleColor: function(ev) {
			this.colorPicker.$canvas.toggleClass("hide");
		},

		initUndoEvent: function() {
			this.canvas.on("canvas:undo", function(isDisable) {
				$(".btn-undo").toggleClass("disabled", isDisable);
			});
			this.canvas.on("canvas:redo", function(isDisable) {
				$(".btn-redo").toggleClass("disabled", isDisable);
			});
		},

		undo: function(ev) {
			if ($(ev.target).hasClass("disabled")) return;
			this.canvas.undo();
		},

		redo: function(ev) {
			if ($(ev.target).hasClass("disabled")) return;
			this.canvas.redo();
		},

		clear: function() {
			this.canvas.clearPixel();
		},

		scale: function(val, diff) {
			this.canvas.scale(diff);
		},

		selectColor: function(ev, color) {
			this.colorPicker.$canvas.toggleClass("hide");
			this.canvas.setColor(color);
			$(".current-color", this.$el).css({
				backgroundColor: color
			});
		}
	})
};


dot.Util = {
	cssPrefix: function() {
		var b = $.browser;
		return (b["mozilla"] ? "moz" : b["webkit"] ? "webkit" : b["opera"] ? "opera" : "").replace(/(.*)/, "-$1-");
	},

	fullscreen: function() {
		setTimeout(window.scrollTo, 100, 0, 1);
		setTimeout(function() {
			if ($("body").height() > window.innerHeight) {
				$("body").css("min-height", window.innerHeight);
			}
		}, 300);
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
