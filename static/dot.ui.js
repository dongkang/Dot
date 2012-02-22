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

/* colorPicker 컴포넌트 */
dot.UI.ColorPicker = function(container, cellSize){
	
	/* 

	sample code

	var colorPicker = new dot.UI.ColorPicker(document.body, 15);
	$(colorPicker).on("selected", function(e, color){

		console.log(color);
	})

	*/

	var ROW_COUNT = 7;
	var that = this;
	var _canvas = document.createElement("canvas");
	container.appendChild(_canvas)

	var	_graphic = _canvas.getContext("2d");
	var _cellSize = cellSize;
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

	init();

	function init() {

		for(var i = 0; i < _colorTable.length; i++){

			var colPosition = parseInt( i / ROW_COUNT );
			var rowPosition = parseInt( i % ROW_COUNT );

			_graphic.beginPath();
			_graphic.rect( colPosition * ( _cellSize+1 ), rowPosition * (_cellSize+1), _cellSize, _cellSize );
			_graphic.fillStyle = _colorTable[i];
			_graphic.fill();

		}

		$(_canvas).bind("click", cellClickHandler);
	
	};

	function cellClickHandler(e){
		
		var localX = e.offsetX;
		var localY = e.offsetY;

		for(var i = 0; i < _colorTable.length; i++){

			var colPosition = parseInt( i / ROW_COUNT );
			var rowPosition = parseInt( i % ROW_COUNT );

			var posX = colPosition * ( _cellSize+1 );
			var posY = rowPosition * ( _cellSize+1 );

			if(localX > posX && localX < posX + _cellSize) {

				if(localY > posY && localY < posY + _cellSize) {

					var color = _colorTable[i];
					$(that).trigger("selected", color);
					return;
				}
			}
		}
	}
	
}

