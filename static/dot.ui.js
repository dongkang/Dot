if (typeof dot === "undefined") dot = {};

dot.UI = {};

/* slider 컴포넌트 */
dot.UI.Slider = Backbone.View.extend({
	template: '<div class="ui-slider"><button class="slider-less">-</button><div class="slider-bar"><div class="slider-point"></div></div><button class="slider-more">+</button></div>',
	events: {
		"click .slider-less": "minusHandler",
		"click .slider-more": "plusHandler"
	},
	initialize: function(options) {
		this.$target = options.target;
		this.events = options.events;
		this.render();
	},
	render: function() {
		this.setElement(this.template);
		this.$target.html(this.$el);
		return this;
	},
	minusHandler: function() {
		this.events.minus();
	}
});
