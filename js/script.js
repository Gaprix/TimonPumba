const canvas = document.getElementById("game");
const win = canvas.getContext('2d');

canvas.width = 1000;
canvas.height = 700;

let started = false;
let currentTick = 1;

let posX = 100;
let posY = 270;

let rightDown = false;
let leftDown = false;
let upDown = false;
let downDown = false;

let timonWidth = 40;
let timonHeight = 40;
let timonFrame = 1;

let blockWidth = 100;
let blockHeight = 100;

let timon = new Image();
timon.src = "assets/timon.png";
let background = new Image();
background.src = "assets/bg.png";
let gameBack = new Image();
gameBack.src = "assets/bg2.png";
let block = new Image();
block.src = "assets/block.png";

function addText(x, y, message, size = 60, color = "#fff", font = "Arial"){
	win.fillStyle = color;
	win.font = size + "px " + font;
	win.fillText(message, x, y);
}

function load(){
	win.drawImage(background, 0, 0);
	addText(300, 50, "Тимон и Пумба");
}

function start(){
	started = true;
	win.imageSmoothingEnabled = false;
	document.getElementById("startButton").style.display = "none";
	document.getElementById("score").style.display = "inline";

	win.drawImage(gameBack, 0, 0);
	//addText(300, 50, "Тимон и Пумба");
	loadLevel();
	drawCharacter();
}

function loadLevel(){
	const level1 = [
		0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
		0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
		0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
		0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
		0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
		0, 0, 0, 1, 1, 1, 0, 1, 1, 0,
		1, 1, 1, 0, 0, 0, 0, 0, 0, 0
	];

	let index;
	for (let x = 0; x < canvas.width; x += blockWidth) {
		for (let y = 0; y < canvas.height; y += blockHeight) {
			index = (y / blockHeight) * 10 + (x / blockWidth);
			if(level1[index] === 1) {
				win.drawImage(block, x, y, blockWidth, blockHeight);
			}
		}
	}
}

function drawCharacter(){
	if(timonFrame === 4)
		timonFrame = 1;
	let offsetX = 3;
	let offsetY = 510;
	win.drawImage(timon, offsetX+(timonWidth*timonFrame), offsetY, timonWidth, timonHeight, posX, posY, timonWidth*6, timonHeight*6);
	if(currentTick % 10 === 0) {
		timonFrame++;
	}
}

function draw(){
	if(!started){
		return;
	}
	win.clearRect(0, 0, canvas.width, canvas.height);
	start();
}

function tick(){
	currentTick++;
	if(rightDown === true){
		posX += 10;
	}

	if(leftDown === true){
		posX -= 10;
	}
}

$(document).on('keydown', function(event){
	switch(event.key){
		case "ArrowRight":
			rightDown = true;
			break;
		case "ArrowLeft":
			leftDown = true;
			break;
		case "ArrowUp":
			upDown = true;
			break;
		case "ArrowDown":
			downDown = true;
			break;
	}
}).on('keyup', function(event){
	switch(event.key){
		case "ArrowRight":
			rightDown = false;
			break;
		case "ArrowLeft":
			leftDown = false;
			break;
		case "ArrowUp":
			upDown = false;
			break;
		case "ArrowDown":
			downDown = false;
			break;
	}
});

setInterval(draw, 16);
setInterval(tick, 16);
