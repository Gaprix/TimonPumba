<?php

$mysqli = new mysqli("127.0.0.1", "root", "9999", "timon");

if($mysqli->errno){
	exit;
}

$query = "SELECT * FROM `users` ORDER BY score DESC LIMIT 10";

$result = $mysqli->query($query);

exit(json_encode($result->fetch_all()));