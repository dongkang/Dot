if (typeof dot === "undefined") dot = {};

dot.UI = {};

/* slider 컴포넌트 */
dot.UI.Slider = Backbone.View.extend({
	template: '<div class="ui-slider"><div class="ico-minus item"></div><div class="slider-bar"><div class="slider-point"></div></div><div class="ico-plus item"></div></div>',
	events: {
		"touchstart .slider-bar": 	"handle",
		"touchmove .slider-bar": 	"handle",
		"touchend .slider-bar": 	"handle",
		"click .ico-minus": 		"minusHandler",
		"click .ico-plus": 			"plusHandler"
	},
	hasTouchEvent: ("ontouchstart" in window),
	hasHold: false,
	hasMove: false,

	initialize: function(options) {
		this.$target = options.target;
		this.handler = options.handler;
		this.render();

		this.$point = $(".slider-point", this.$el);

		/* for PC Browser */
		if (!this.hasTouchEvent) {
			this.events["mousedown .slider-bar"] = "handle";
			this.events["mousemove .slider-bar"] = "handle";
			this.events["mouseup .slider-bar"] = "handle";
			this.events["mouseout .slider-bar"] = "handle";
		}
		this.delegateEvents(this.events);

	},
	render: function() {
		this.setElement(this.template);
		this.$target.html(this.$el);
		return this;
	},
	minusHandler: function() {
		this.handler.minus();
	},
	plusHandler: function() {
		this.handler.plus();
	},
	handle: function(ev) {
		var e = (ev.originalEvent.touches && ev.originalEvent.touches[0]) ? 
					ev.originalEvent.touches[0] : ev,
			offset = $(".slider-bar").offset(),
			x = (e.pageX || this.lastX) - offset.left,
			y = (e.pageY || this.lastY) - offset.left;

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
					this.hasMove = true;
					console.log(this.$point)
					this.$point.css({
						left: x
					});
				}
				this.lastX = x;
				this.lastY = y;
				break;

			case "touchend":
			case "mouseup":
			case "mouseout":
				this.hasHold = false;
				this.hasMove = false;
				break;

			default: return;
		}
	}
});
