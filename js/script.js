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

let posX = 0;
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

let hyenaWidth = 50;
let hyenaHeight = 50;
let hyenaSizeMultiplier = 3;

let caterpillarWidth = 50;
let caterpillarRealWidth = 30;
let caterpillarRealHeight = 30;
let caterpillarHeight = 50;

let levelWidth = 500;
let levelHeight = 7;
let levelScroll = 0;

let level = generateLevel();

let timon = new Image();
timon.src = "assets/timon.png";
let background = new Image();
background.src = "assets/bg.png";
let gameBack = new Image();
gameBack.src = "assets/bg2.png";
let block = new Image();
block.src = "assets/block.png";
let caterpillar = new Image();
caterpillar.src = "assets/caterpillar.png";
let hyena = new Image();
hyena.src = "assets/hyena.png";

function rand(min, max){
	return Math.floor(Math.random() * (max - min + 1)) + min;
}

function generateLevel(){
	let levelBlocks = [];
	let structures = [
		[
			[0, 5, 1],
			[1, 4, 1],
			[2, 3, 1],
			[2, 5, 2],
			[3, 3, 1],
			[6, 3, 1],
			[7, 3, 1],
			[7, 5, 3],
			[8, 3, 1]
		],
		[
			[0, 4, 1],
			[1, 4, 1],
			[3, 3, 1],
			[4, 3, 1]
		]
	];

	for(let i = 0; i < levelWidth * levelHeight; i++){
		if(i >= levelWidth * (levelHeight - 1)){
			levelBlocks[i] = 1;
			continue;
		}
	}
	
	let step = 100;
	for(let i = 1; i < 10; i++){
		let structure = structures[rand(0, structures.length - 1)];
		for(let n = 0; n < structure.length; n++){
			levelBlocks[getIndex(i*100 + step + structure[n][0]*100, structure[n][1]*100)] = structure[n][2];
		}
		step += structure[structure.length - 1][0]*100 + 200;
	}
	
	return levelBlocks;
}

function getIndex(x, y){
	let xHeight = Math.floor(x / 100);
	let xWidth = 0;
	
	if(x % 100 != 0){
		xWidth += (x / 100) % levelHeight;
	}
	
	index = xHeight + xWidth + (y / 100) * levelWidth;
	
	return index;
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
	if(!started){
		time = 0;
		score = 0;
		hp = 100;
		posX = 0;
		posY = 420;
		levelScroll = 0;
		level = generateLevel();
		timonDirection = "right";
		started = true;
	}
	win.imageSmoothingEnabled = false;
	document.getElementById("startButton").style.display = "none";

	win.drawImage(gameBack, -levelScroll/2, 0);
	win.drawImage(gameBack, -levelScroll/2 + gameBack.width, 0);
	loadLevel();
	drawCharacter();
	drawTiles();
}

function loadLevel(){
	let index;
	for (let x = 0; x < canvas.width * (levelWidth/10); x += blockWidth) {
		for (let y = 0; y < canvas.height; y += blockHeight) {
			index = (y / blockHeight) * levelWidth + (x / blockWidth);
			switch(level[index]){
				case 1:
					win.drawImage(block, x - levelScroll, y - 20, blockWidth, blockHeight);
					break;
			}
		}
	}
}

function drawTiles(){
	let index;
	for (let x = 0; x < canvas.width * (levelWidth/10); x += blockWidth) {
		for (let y = 0; y < canvas.height; y += blockHeight) {
			index = (y / blockHeight) * levelWidth + (x / blockWidth);
			switch(level[index]){
				case 2:
					let offsetX = 50;
					let offsetY = 60;
					win.drawImage(hyena, offsetX, offsetY, hyenaWidth, hyenaHeight, x - levelScroll, y - 20, hyenaWidth*hyenaSizeMultiplier, hyenaHeight*hyenaSizeMultiplier);
					break;
				case 3:
					win.drawImage(caterpillar, x - levelScroll + 20, y + 60, caterpillarWidth, caterpillarHeight);
					break;
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
	drawBar();
	if(testBox()["down"] === false){
		posY += 10;
	}
}

function drawBar(){
	addText(20, 50, hp + " HP", 40);
	addText(430, 50, score, 40);
	win.drawImage(caterpillar, 470, 5, 50, 50);
	
	let minutes = Math.floor(time / 60);
	let seconds = time - minutes * 60;

	if(minutes < 10)
		minutes = "0" + minutes;
	if(seconds < 10)
		seconds = "0" + seconds;
	
	addText(canvas.width - 180, 50, minutes + ":" + seconds, 40);
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
	for (let x = 0; x < canvas.width + levelScroll; x += blockWidth) {
		for (let y = 0; y < canvas.height; y += blockHeight) {
			index = (y / blockHeight) * levelWidth + (x / blockWidth);

			if(posX === 0){
				result["left"] = true;
			}
			
			if(level[index] === 2){
				if(x - levelScroll < 0)
					continue;
				x2 = Math.abs(x - levelScroll);
				
				if(debugMode) {
					win.fillStyle = "yellow";
					win.fillRect(x2, y - 20, hyenaWidth * hyenaSizeMultiplier, 2);
					win.fillRect(x2, y - 20, 2, hyenaHeight * hyenaSizeMultiplier);
					win.fillRect(x2 + hyenaWidth * hyenaSizeMultiplier, y - 20, 2, hyenaHeight * hyenaSizeMultiplier);
					win.fillRect(x2, y - 20 + hyenaHeight * hyenaSizeMultiplier, hyenaWidth * hyenaSizeMultiplier, 2);
				}
				
				if((x2 === posX || x2 + hyenaWidth * hyenaSizeMultiplier === posX) && y === 60 + posY){
					hp -= 30;
					if(hp < 0){
						hp = 0;
					}
				}
			}
			
			if(level[index] === 3){
				if(x - levelScroll < 0)
					continue;
				x2 = Math.abs(x - levelScroll);
				
				if(debugMode) {
					win.fillStyle = "yellow";
					win.fillRect(x2, y + 20, caterpillarRealWidth * hyenaSizeMultiplier, 2);
					win.fillRect(x2, y + 20, 2, caterpillarRealHeight * hyenaSizeMultiplier);
					win.fillRect(x2 + caterpillarRealWidth * hyenaSizeMultiplier, y + 20, 2, caterpillarRealHeight);
					win.fillRect(x2, y + 20 + caterpillarRealHeight * hyenaSizeMultiplier, caterpillarRealWidth, 2);
				}
				
				if((x2 === posX || x2 + caterpillarRealWidth === posX) && y === 60 + posY){
					score++;
					hp += 5;
					if(hp > 100){
						hp = 100;
					}
					delete level[getIndex(x, y)];
				}
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

	if(rightDown === true && testBox()["right"] === false){
		timonDirection = "right";
		if(posX > canvas.width/1.5){
			levelScroll += timonSpeed;
		}else{
			posX += timonSpeed;
		}
	}

	if(leftDown === true && testBox()["left"] === false){
		timonDirection = "left";
		if(levelScroll - timonSpeed >= 0) {
		
			if(posX < (canvas.width / 3) - timonWidth*timonSizeMultiplier){
				levelScroll -= timonSpeed;
			}else{
				posX -= timonSpeed;
			}
			
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
		case "Escape":
			if(currentTick === 0){
				break;
			}
			if(started){
				addText(400, canvas.height/2, "ПАУЗА", 70, "#000");
				started = false;
			}else if(currentTick !== 1){
				started = true;
			}
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
		if(hp <= 0){
			currentTick = 0;
			started = false;
			addText(canvas.width/4, canvas.height/4, "Игра окончена!", 70, "#000");
			document.getElementById("startButton").style = "hidden: no; margin-top: 600px;";
			win.fillStyle = "white";
			win.fillRect(canvas.width/4, canvas.height/3, canvas.width/2, canvas.height/2);
			win.strokeStyle = "black";
			win.strokeRect(canvas.width/4, canvas.height/3, canvas.width/2, canvas.height/2);
			for(let i = 0; i <= 200; i += 50){
				addText(canvas.width/4 + 20, canvas.height/3 + 50 + i, "Игрок " + i, 40, "#000");
			}
		}
		hp--;
	}
}

setInterval(draw, 16);
setInterval(tick, 16);
setInterval(timer, 1000);
