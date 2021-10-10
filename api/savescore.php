<?php

if(isset($_POST["name"]) && isset($_POST["score"])){

	$name = $_POST["name"];
	$score = $_POST["score"];

	if(mb_strlen($name) > 15 || (int)$score != $score || $score > 99999999999){
		exit("Invalid request");
	}

	# Защита от XSS атак
	$name = htmlspecialchars($name, ENT_QUOTES, 'UTF-8');
	$score = htmlspecialchars($score, ENT_QUOTES, 'UTF-8');

	$mysqli = new mysqli("127.0.0.1", "root", "9999", "timon");

	if($mysqli->errno){
		exit("mysqli error");
	}

	# Защита от SQL-инъекций
	$name = $mysqli->real_escape_string($name);

	$query = "INSERT INTO `users` (`name`, `score`) VALUES('$name', '$score')";
	$mysqli->query($query);
}else{
	exit("Invalid request");
}