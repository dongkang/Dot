<!DOCTYPE html>
<html>
<head>
	<meta charset="utf-8" />
	<meta name="viewport" content="user-scalable=no, initial-scale=1.0, maximum-scale=1.0, minimum-scale=1.0, width=device-width" />
	<title>Dot.</title>
	<link href="./static/style.css" rel="stylesheet" type="text/css" />
</head>

<body>
	<div id="stage" style="background-color:#ccc;">Hey chorr, I need canvas module!</div>
	<div id="toolbar">
		<a id="colorPicker" href="javascript:;"></a>
		<input type="radio" id="radioPencil" name="mode" value="pencil" checked="checked" />
		<label for="radioPencil">PENCIL</label>
		<input type="radio" id="radioHand" name="mode" value="hand" />
		<label for="radioHand">HAND</label>
		<button type="button" id="btnUndo">UNDO</button>
		<button type="button" id="btnRedo">REDO</button>
		<button type="button" id="btnMenu">MENU</button>
	</div>

	<script src="./static/jquery.min.js" type="text/javascript"></script>
	<script src="./static/script.js" type="text/javascript"></script>
</body>
</html>
