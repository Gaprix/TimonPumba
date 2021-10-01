var canvas = document.getElementById("game");
var win = canvas.getContext('2d');
canvas.width = 1000;
canvas.height = 700;
background = new Image();
background.src = "assets/bg.png";
background.onload = function(e){
	win.drawImage(background, 0, 0);
}
win.fillStyle = "#fff";
win.font = "20px Arial";
win.fillText("Тимон и пумба", 400, 30);
