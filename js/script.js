var canvas = document.getElementById("game");
var win = canvas.getContext('2d');
canvas.width = 1000;
canvas.height = 700;

function addText(x, y, message, size = 60, color = "#fff", font = "Arial"){
	win.fillStyle = color;
	win.font = size + "px Arial";
	win.fillText(message, x, y);
}

function load(){
	background = new Image();
	background.src = "assets/bg.png";
	background.onload = function(e){
		win.drawImage(background, 0, 0);
		addText(300, 50, "Тимон и Пумба");
	}
}

function start(){
	document.getElementById("startButton").style.display = "none";
	document.getElementById("score").style.display = "inline";
	background = new Image();
	background.src = "assets/bg2.png";
	background.onload = function(e){
		win.drawImage(background, 0, 0);
		//addText(300, 50, "Тимон и Пумба");
		loadLevel();
	}
}

function loadLevel(){
	var level1 = [
		0,0,0,0,0,0,0,0,0,0,
		0,0,0,0,0,0,0,0,0,0,
		0,0,0,0,0,0,0,0,0,0,
		0,0,0,0,0,0,0,0,0,0,
		0,0,0,0,0,0,0,0,0,0,
		0,0,0,1,0,1,0,0,0,0,
		0,0,0,0,0,1,0,0,0,1
	];
	
	block = new Image();
	block.src = "assets/block.png";
	block.onload = function(e){
		for(var x = 0; x < 1000; x += 100){
			for(var y = 0; x < 700; x += 100){
				//TODO: определить, нужно ли ставить блок
				win.drawImage(block, x, y, 100, 100);
			}
		}
	}
}
