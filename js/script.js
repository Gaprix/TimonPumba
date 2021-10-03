const canvas = document.getElementById("game");
const win = canvas.getContext('2d');

canvas.width = 1000;
canvas.height = 700;

let started = false;
let debugMode = false;
let currentTick = 1;
let time = 0;
let score = 0;
let hp = 100;

let posX = 100;
let posY = 420;

let rightDown = false;
let leftDown = false;
let upDown = false;
let downDown = false;

let timonWidth = 40;
let timonHeight = 40;
let legsWidth = 35;
let timonSizeMultiplier = 4;
let timonFrame = 1;
let timonDirection = "right";
let timonSpeed = 5;

let blockWidth = 100;
let blockHeight = 100;

const level = generateLevel();
let levelWidth = level.length/7;
let levelScroll = 0;

let timon = new Image();
timon.src = "assets/timon.png";
let background = new Image();
background.src = "assets/bg.png";
let gameBack = new Image();
gameBack.src = "assets/bg2.png";
let block = new Image();
block.src = "assets/block.png";

function rand(min, max){
	return Math.floor(Math.random() * (max - min + 1)) + min;
}

function generateLevel(){
	let width = 20;
	let height = 7;
	let levelBlocks = [];

	for(let i = 0; i < width * height; i++){
		if(i >= width * (height - 1)){
			levelBlocks[i] = 1;
			continue;
		}

		if(rand(1, 5) === 1){
			levelBlocks[i] = 1;
		}else{
			levelBlocks[i] = 0;
		}
	}

	return levelBlocks;
}

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
	document.getElementById("hp").style.display = "inline";
	document.getElementById("time").style.display = "inline";

	win.drawImage(gameBack, -levelScroll/2, 0);
	win.drawImage(gameBack, -levelScroll/2 + gameBack.width, 0);
	//addText(300, 50, "Тимон и Пумба");
	loadLevel();
	drawCharacter();
}

function loadLevel(){
	let index;
	for (let x = 0; x < canvas.width * (levelWidth/10); x += blockWidth) {
		for (let y = 0; y < canvas.height; y += blockHeight) {
			index = (y / blockHeight) * levelWidth + (x / blockWidth);
			if(level[index] === 1) {
				win.drawImage(block, x - levelScroll, y - 20, blockWidth, blockHeight);
			}
		}
	}
}

function drawCharacter(){
	let framesNumber = 4;
	let offsetX = 3;
	let offsetY = 510;
	let timonHeight2 = 40;
	let offsetTextureY = 0;
	let framesSize = {
		1: 39,
		2: 40,
		3: 39,
		4: 40
	};

	//TODO: Implement "Begin Running" and "Stop Running" animations
	if(leftDown || rightDown){
		framesNumber = 9;
		timonHeight2 = 45;
		offsetY = 605;
		offsetX = 365;
		offsetTextureY = 15;
		framesSize = {
			1: 40,
			2: 40,
			3: 40,
			4: 40,
			5: 40,
			6: 40,
			7: 40,
			8: 40,
			9: 40
		};
	}

	if(timonFrame >= framesNumber) {
		timonFrame = 1;
	}

	for(let i = 1; i < timonFrame; i++){
		offsetX += framesSize[i];
	}

	if(timonDirection === "left") {
		win.translate(posX + timonWidth * timonSizeMultiplier, posY + timonHeight2 * timonSizeMultiplier);
		win.scale(-1, 1);
		win.drawImage(timon, offsetX, offsetY, timonWidth, timonHeight2, 0, -timonHeight2*timonSizeMultiplier - offsetTextureY, timonWidth*timonSizeMultiplier, timonHeight2*timonSizeMultiplier);
		win.setTransform(1,0,0,1,0,0);
	}else{
		win.drawImage(timon, offsetX, offsetY, timonWidth, timonHeight2, posX, posY - offsetTextureY, timonWidth*timonSizeMultiplier, timonHeight2*timonSizeMultiplier);
	}
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
	if(testBox()["down"] === false){
		posY += 10;
	}
}

function testBox(){
	let index;
	let result = {
		"down": false,
		"up": false,
		"left": false,
		"right": false
	}
	let x2;
	for (let x = 0; x < canvas.width * (levelWidth/10); x += blockWidth) {
		for (let y = 0; y < canvas.height; y += blockHeight) {
			index = (y / blockHeight) * levelWidth + (x / blockWidth);

			if(posX === 0){
				result["left"] = true;
			}

			if(level[index] === 1){
				if(x - levelScroll < 0)
					continue;
				x2 = Math.abs(x - levelScroll);

				if(debugMode) {
					win.fillStyle = "blue";
					win.fillRect(x2, y, blockWidth, 2);
					win.fillRect(x2, y, 2, blockHeight);
					win.fillRect(x2 + blockWidth, y, 2, blockHeight);
					win.fillRect(x2, y + blockHeight, blockWidth, 2);
				}

				if(y === posY + timonHeight*timonSizeMultiplier) {
					if((x2 >= posX && Math.abs(x2 - posX) < blockWidth + legsWidth) || x2 <= posX && Math.abs(x2 - posX) < blockWidth)
						result["down"] = true;
				}

				if(Math.abs(x2 - (posX + legsWidth*timonSizeMultiplier)) < timonSpeed + 1 && y < posY + timonHeight*timonSizeMultiplier && y > posY) {
					result["right"] = true;
				}

				if(Math.abs((x2 + blockWidth) - posX) < timonSpeed + 1 && y < posY + timonHeight*timonSizeMultiplier && y > posY) {
					result["left"] = true;
				}

			}
		}
	}

	if(debugMode) {
		win.fillStyle = "red";
		win.fillRect(posX, posY + timonHeight * timonSizeMultiplier, legsWidth * timonSizeMultiplier, 2);
		win.fillRect(posX, posY + timonHeight * timonSizeMultiplier, 2, -timonHeight * timonSizeMultiplier);
		win.fillRect(posX, posY, legsWidth * timonSizeMultiplier, 2);
		win.fillRect(posX + legsWidth * timonSizeMultiplier, posY + timonHeight * timonSizeMultiplier, 2, -timonHeight * timonSizeMultiplier);
	}

	return result;
}

function tick(){
	if(!started){
		return;
	}

	currentTick++;

	let minutes = Math.floor(time / 60);
	let seconds = time - minutes * 60;

	if(minutes < 10)
		minutes = "0" + minutes;
	if(seconds < 10)
		seconds = "0" + seconds;

	document.getElementById("time").innerText = minutes + ":" + seconds;

	if(rightDown === true && testBox()["right"] === false){
		posX += timonSpeed/5;
		timonDirection = "right";
		levelScroll += timonSpeed;
	}

	if(leftDown === true && testBox()["left"] === false){
		timonDirection = "left";
		if(levelScroll - timonSpeed >= 0) {
			levelScroll -= timonSpeed;
			posX -= timonSpeed/5;
		}else{
			posX -= timonSpeed;
		}
	}

	if(upDown === true && testBox()["down"] === true){
		upDown = false;
		posY -= blockHeight*2;
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

function timer(){
	if(started){
		time++;
	}
}

setInterval(draw, 16);
setInterval(tick, 16);
setInterval(timer, 1000);
