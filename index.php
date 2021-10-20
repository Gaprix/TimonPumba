<?php

require_once("login/auth.php");

use Auth;

$auth = new Auth(true);

if(($name = $auth->checkCookie()) === false){
	header('Location: login/');
	exit;
}

?>

<!DOCTYPE html>
<html lang="ru">
<head>
	<meta charset="UTF-8">
	<title>Тимон и Пумба</title>
	<link rel="stylesheet" href="css/style.css" />
</head>

<body onload="load();">
	<div id="playGround">
		<canvas id="game"></canvas>

		<input type="text" id="playerName" placeholder="Ваше имя" maxlength="15" value="<?php echo $name; ?>">

		<button id="startButton" onclick="start();">
			<img src="assets/button.png"  alt="" />
		</button>

		<script type="text/javascript" src="js/jquery-3.6.0.min.js"></script>
		<script type="text/javascript" src="js/script.js"></script>
	</div>
</body>
</html>