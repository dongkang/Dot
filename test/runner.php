<!DOCTYPE html>
<html>
<head>
	<meta charset="utf-8" />
	<title>Dot. Test</title>
	<link type="text/css" rel="stylesheet" href="../lib/jasmine/jasmine.css" />
	<script type="text/javascript" src="../lib/jasmine/jasmine.js"></script>
	<script type="text/javascript" src="../lib/jasmine/jasmine-html.js"></script>
	<script type="text/javascript" src="myTest.js"></script>
</head>

<body>
	<script type="text/javascript">
		jasmine.getEnv().addReporter(new jasmine.TrivialReporter());
		jasmine.getEnv().execute();
	</script>
</body>
</html>
