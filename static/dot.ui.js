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
		this.handler = options.handler;
		this.render();
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
	}
});



dot.UI.ColorPicker = function(container, cellSize){
	
	var ROW_COUNT = 7;
	var canvas = document.createElement("canvas");
	container.appendChild(canvas)

	var	graphic = canvas.getContext("2d");
	var colorTable = [

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

	this.init = function(container, cellSize) {

		for(var i = 0; i < colorTable.length; i++){

			var colPosition = parseInt( i / ROW_COUNT );
			var rowPosition = parseInt( i % ROW_COUNT );
			graphic.beginPath();
			graphic.rect( colPosition * ( cellSize+1 ), rowPosition * (cellSize+1), cellSize, cellSize );
			graphic.fillStyle = colorTable[i];
			graphic.fill();

		}
		
		$(canvas).on("click", function(e){
		
			var localX = e.offsetX;
			var localY = e.offsetY;

			for(var i = 0; i < colorTable.length; i++){

				var colPosition = parseInt( i / ROW_COUNT );
				var rowPosition = parseInt( i % ROW_COUNT );

				var posX = colPosition * ( cellSize+1 );
				var posY = rowPosition * ( cellSize+1 );
			}
		});
	}

	this.init(container, cellSize);
}

