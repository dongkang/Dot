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
		this.max = options.max || 100;
		this.value = options.value || 0;
		this.$target = options.target;
		this.render();

		this.$point = $(".slider-point", this.$el);
		this.$bar = $(".slider-bar", this.$el);
		this.goByValue(this.value);

		/* for PC Browser */
		if (!this.hasTouchEvent) {
			this.events["mousedown .slider-bar"] = "handle";
			this.events["mousemove .slider-bar"] = "handle";
			this.events["mouseup .slider-bar"] = "handle";
		}
		this.delegateEvents(this.events);
	},
	render: function() {
		this.setElement(this.template);
		this.$target.html(this.$el);
		return this;
	},
	minusHandler: function() {
		var v = Math.max(0, this.value - Math.floor(this.max/10));
		this.goByValue(v);
		this.value = v;
	},
	plusHandler: function() {
		var v = Math.min(this.value + Math.floor(this.max/10), this.max);
		this.goByValue(v);
		this.value = v;
	},
	handle: function(ev) {
		var e = (ev.originalEvent.touches && ev.originalEvent.touches[0]) ? 
					ev.originalEvent.touches[0] : ev,
			offset = this.$bar.offset(),
			x = (e.pageX || this.lastX) - offset.left,
			y = (e.pageY || this.lastY) - offset.left;

		ev.preventDefault();

		switch (ev.type) {
			case "touchstart":
			case "mousedown":
				this.go(x);
				this.hasHold = true;
				this.hasMove = false;
				this.lastX = x;
				this.lastY = y;
				break;

			case "touchmove":
			case "mousemove":
				if (this.hasHold) {
					this.hasMove = true;
					this.go(x);
				}
				this.lastX = x;
				this.lastY = y;
				break;

			case "touchend":
			case "mouseup":
				this.hasMove = this.hasHold = false;
				break;

			default: return;
		}
	},

	go: function(x) {
		var px = Math.round(x - this.$point.width()/2),
			diff = 0;
		px = Math.max(0, px);
		px = Math.min(px, this.$bar.width() - this.$point.width());

		this.$point.css({
			left: px
		});

		diff = this.xToValue(px) - this.value;
		this.value = this.xToValue(px);
		this.trigger("change", this.value, diff);
	},

	goByValue: function(val) {
		this.go(this.valueToX(val) + (this.$point.width()/2));
	},

	xToValue: function(px) {
		var ratio = this.max / (this.$bar.width() - this.$point.width());
		return Math.floor(px * ratio);
	},

	valueToX: function(val) {
		var ratio = (this.$bar.width() - this.$point.width()) / this.max;
		return Math.floor(val * ratio);
	}
});

/* colorPicker 컴포넌트 */
dot.UI.ColorPicker = function(container, width, height){
	
	/* 

	// sample code init

	var colorPicker = new dot.UI.ColorPicker(document.body, 15);
	$(colorPicker).on("selected", function(e, color){

		console.log(color);
	})

	// sample code render

	colorPicker.render(width, height);

	*/

	var ROW_COUNT = 7;
	var COL_COUNT = 14;
	
	var that = this;
	var _canvas = document.createElement("canvas");
	container.appendChild(_canvas);

	var	_graphic = _canvas.getContext("2d");
	var _colorTable = [

		// col 1
		'#ff0000', '#ffd8d8', '#ffa7a7', '#f15f5f', '#cc3d3d', '#980000', '#670000',
		// col 2
		'#ff5e00', '#fae0d4', '#ffc19e', '#f29661', '#cc723d', '#993800', '#662500', 
		'#ffbb00', '#faecc5', '#ffe08c', '#f2cb61', '#cca63d', '#997000', '#664b00', 
		'#ffe400', '#faf4c0', '#faed7d', '#e5d85c', '#c4b73b', '#998a00', '#665c00', 
		'#abf200', '#e4f7ba', '#cef279', '#bce55c', '#9fc93c', '#6b9900', '#476600', 
		'#1ddb16', '#cefbc9', '#b7f0b1', '#86e57f', '#47c83e', '#2f9d27', '#22741c', 
		'#d8ff', '#d4f4fa', '#b2ebf4', '#5cd1e5', '#3db7cc', '#8299', '#5766', 
		'#54ff', '#d9e5ff', '#b2ccff', '#6799ff', '#4374d9', '#3399', '#2266', 
		'#100ff', '#dad9ff', '#b5b2ff', '#6b66ff', '#4641d9', '#50099', '#30066', 
		'#5f00ff', '#e8d9ff', '#d1b2ff', '#a566ff', '#8041d9', '#3f0099', '#2a0066', 
		'#ff00dd', '#ffd9fa', '#ffb2f5', '#f361dc', '#d941c5', '#990085', '#660058', 
		'#ff007f', '#ffd9ec', '#ffb2d9', '#f361a6', '#d9418c', '#99004c', '#660033', 
		'#000000', '#f6f6f6', '#d5d5d5', '#a6a6a6', '#747474', '#4c4c4c', '#212121', 
		'#ffffff', '#eaeaea', '#bdbdbd', '#8c8c8c', '#5d5d5d', '#353535', '#000000'

	];

	this.init = function(width, height) {

		this.render(width, height);
		this.$canvas = $(_canvas);

		this.$canvas.bind("click", function(e){

			var localX = e.offsetX;
			var localY = e.offsetY;

			var imageData = _graphic.getImageData(localX, localY, 1, 1);
			var cr = imageData.data[0].toString(16).replace(/^(.)$/, "0$1"),
				cg = imageData.data[1].toString(16).replace(/^(.)$/, "0$1"),
				cb = imageData.data[2].toString(16).replace(/^(.)$/, "0$1");
			var color = "#" + cr + cg + cb;
			$(that).trigger("selected", color);

		});
	}

	this.render = function(width, height) {

		var _wcellSize = width/COL_COUNT;
		var _hcellSize = height/ROW_COUNT;
	
		for(var i = 0; i < _colorTable.length; i++){

			var colPosition = parseInt(i / ROW_COUNT);
			var rowPosition = i % ROW_COUNT;

			_graphic.beginPath();
			_graphic.rect(colPosition * _wcellSize, rowPosition * _hcellSize, _wcellSize, _hcellSize);
			_graphic.fillStyle = _colorTable[i];
			_graphic.fill();

		}
	}
	
	this.init(width, height);
}

