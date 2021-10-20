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
let points = 0;
let guideFrame = 1;

let timonPosX = 0;
let timonPosY = 420;

let pumbaPosX = 0;
let pumbaPosY = 420;

let rightDown = false;
let leftDown = false;
let upDown = false;
let downDown = false;
let spaceDown = false;

let timonWidth = 40;
let timonHeight = 40;
let legsWidth = 35;
let timonSizeMultiplier = 4;
let timonFrame = 1;
let timonDirection = "right";
let timonSpeed = 6;
let timonHidden = false;
let needHit = -1;
let interactedWith = 0;
let inJump = false;
let jumpTime = 0;
let jumpDuration = 50;
let preJumptimonPosY = 0;

let pumbaWidth = 40;
let pumbaHeight = 40;
let pumbaSizeMultiplier = 4;

let blockWidth = 100;
let blockHeight = 100;

let hyenaWidth = 72;
let hyenaHeight = 50;
let hyenaSizeMultiplier = 3;
let hyenaFrame = 1;

let caterpillarWidth = 50;
let caterpillarHeight = 50;

let levelWidth = 500;
let finish = 0;
let structuresNumber = 15;
let levelHeight = 7;
let levelScroll = 0;

let tiles = [];
let level = generateLevel();

let timon = new Image();
timon.src = "assets/timon.png";
let pumba = new Image();
pumba.src = "assets/pumba.png";
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
let guide = new Image();
guide.src = "assets/guide.png";
let audio = new Audio("assets/music.mp3");

function rand(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

function generateLevel() {
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
            [8, 3, 1],
            [8, 2, 3]
        ],
        [
            [0, 4, 1],
            [1, 4, 1],
            [3, 3, 1],
            [4, 3, 1],
            [4, 2, 3]
        ],
        [
            [0, 5, 1],
            [2, 5, 2],
            [2, 3, 3],
            [2, 4, 1],
            [4, 5, 1]
        ],
        [
            [2, 5, 1],
            [3, 5, 1],
            [3, 4, 3],
            [0, 6, 4],
            [1, 6, 4],
            [2, 6, 4],
            [3, 6, 4]
        ],
        [
            [0, 6, 4],
            [1, 6, 4]
        ],
        [
            [0, 4, 1],
            [1, 4, 1],
            [2, 4, 1],
            [1, 3, 3],
            [1, 5, 2]
        ],
        [
            [0, 5, 1],
            [1, 5, 1],
            [0, 6, 4],
            [1, 6, 4]
        ],
        [
            [0, 5, 1],
            [2, 4, 1],
            [3, 4, 1],
            [4, 4, 1],
            [4, 3, 3],
            [3, 5, 2]
        ],
        [
            [0, 4, 1],
            [0, 3, 3]
        ],
        [
            [0, 6, 4],
            [1, 6, 4],
            [2, 5, 3],
            [3, 6, 4],
            [4, 6, 4]
        ]
    ];

    let step = 100;
    let x;
    let y;
    for (let i = 1; i < structuresNumber; i++) {
        let structure = structures[rand(0, structures.length - 1)];
        for (let n = 0; n < structure.length; n++) {
            x = i * 100 + step + structure[n][0] * 100;
            y = structure[n][1] * 100;
            switch (structure[n][2]) {
                case 4:
                case 1:
                    levelBlocks[getIndex(x, y)] = structure[n][2];
                    break;
                case 2:
                    //x, y, type, direction, blocksFromSpawnPoint
                    tiles.push([x, y, 2, "right", 0]);
                    break;
                case 3:
                    tiles.push([x, y, 3, "right", 0]);
                    break;
            }
        }
        step += structure[structure.length - 1][0] * 100 + 200;
    }

    finish = step + 2000;

    for (let i = 0; i < levelWidth * levelHeight; i++) {
        if (i >= levelWidth * (levelHeight - 1) && levelBlocks[i] !== 4) {
            levelBlocks[i] = 1;
        }
    }
	
	tiles.push([timonPosX, timonPosY, 6, "right", 0]);
	tiles.push([timonPosX, timonPosY, 7, "right", 0]);
	
    return levelBlocks;
}

function getIndex(x, y) {
    let xHeight = Math.floor(x / 100);
    let xWidth = 0;

    if (x % 100 !== 0) {
        xWidth += (x / 100) % levelHeight;
    }

    return xHeight + xWidth + (y / 100) * levelWidth;
}

function addText(x, y, message, size = 60, color = "#fff", font = "Arial") {
    win.fillStyle = color;
    win.font = size + "px " + font;
    win.fillText(message, x, y);
}

function load() {
    win.drawImage(background, 0, 0);
    addText(300, 50, "Тимон и Пумба");
}

function start() {
    if (!started) {
        time = 0;
        score = 0;
		inJump = false;
		needHit = -1;
        hp = 100;
        timonPosX = 0;
        timonPosY = 420;
        levelScroll = 0;
        tiles = [];
        level = generateLevel();
        timonDirection = "right";
        started = true;
        audio.play();
        audio.loop = true;
    }
    win.imageSmoothingEnabled = false;
    document.getElementById("startButton").style.display = "none";
    document.getElementById("playerName").style.display = "none";

    for (let offset = 0; offset < levelWidth * 100; offset += gameBack.width) {
        win.drawImage(gameBack, -levelScroll / 2 + offset, 0);
    }
    loadLevel();
    drawTiles();
}

function loadLevel() {
    let index;
    for (let x = 0; x < canvas.width * (levelWidth / 10); x += blockWidth) {
        for (let y = 0; y < canvas.height; y += blockHeight) {
            index = (y / blockHeight) * levelWidth + (x / blockWidth);
            switch (level[index]) {
                case 1:
                    win.drawImage(block, x - levelScroll, y - 20, blockWidth, blockHeight);
                    break;
            }
        }
    }
}

function drawTiles() {
    let x;
    let y;
    let type;
	let offsetX;
	let offsetY;
    tiles.forEach(function (tile, i) {
        x = tile[0];
        y = tile[1];
        type = tile[2];
        switch (type) {
            case 2:
                offsetX = 107 - hyenaWidth + hyenaFrame * hyenaWidth;
                offsetY = 663;
                if (debugMode === true) {
                    addText(x - levelScroll, y - 50, i + ": " + x + ", " + y, 40, "blue");
                }
                if (tile[3] === "left") {
                    //reverse
                    win.translate(x - levelScroll + hyenaWidth * hyenaSizeMultiplier, y + 20 + hyenaHeight * hyenaSizeMultiplier);
                    win.scale(-1, 1);
                    win.drawImage(hyena, offsetX, offsetY, hyenaWidth, hyenaHeight, 0, -hyenaHeight * hyenaSizeMultiplier * 1.5 + 20, hyenaWidth * hyenaSizeMultiplier, hyenaHeight * hyenaSizeMultiplier);
                    win.setTransform(1, 0, 0, 1, 0, 0);
                } else {
                    win.drawImage(hyena, offsetX, offsetY, hyenaWidth, hyenaHeight, x - levelScroll, y - 35, hyenaWidth * hyenaSizeMultiplier, hyenaHeight * hyenaSizeMultiplier);
                }
                break;
            case 3:
                win.drawImage(caterpillar, x - levelScroll + 20, y + 60, caterpillarWidth, caterpillarHeight);
                break;
			case 5:
				win.drawImage(caterpillar, x - levelScroll, y, caterpillarWidth, caterpillarHeight);
				break;
			case 6: //timon
			case 7: //pumba
				drawCharacter(tile);
				break;
        }
    });

    if (currentTick % 9 === 0) {
        hyenaFrame++;
        if (hyenaFrame > 12) {
            hyenaFrame = 1;
        }
    }
}

function drawCharacter(tile){
	switch(tile[2]){
		case 6:
			drawTimon();
			break;
		case 7:
			//drawPumba();
			break;
	}
}

//TODO
function drawPumba(){
	let offsetX = 3;
    let offsetY = 30;
	let offsetTextureY = 0;
	win.drawImage(pumba, offsetX, offsetY, pumbaWidth, pumbaHeight, pumbaPosX, pumbaPosY - offsetTextureY, pumbaWidth * pumbaSizeMultiplier, pumbaHeight * pumbaSizeMultiplier);
}

function drawTimon() {
    if (debugMode) {
        addText(timonPosX, timonPosY - timonHeight, (levelScroll + timonSpeed + canvas.width) / 100, 40, "blue");
    }

    if (timonHidden) {
        addText(260, canvas.height / 2, "Вы спрятались", 70, "#000");
        return;
    }
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
    if (leftDown || rightDown) {
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

    if (timonFrame >= framesNumber) {
        timonFrame = 1;
    }

    for (let i = 1; i < timonFrame; i++) {
        offsetX += framesSize[i];
    }

    if (timonDirection === "left") {
        win.translate(timonPosX + timonWidth * timonSizeMultiplier, timonPosY + timonHeight2 * timonSizeMultiplier);
        win.scale(-1, 1);
        win.drawImage(timon, offsetX, offsetY, timonWidth, timonHeight2, 0, -timonHeight2 * timonSizeMultiplier - offsetTextureY, timonWidth * timonSizeMultiplier, timonHeight2 * timonSizeMultiplier);
        win.setTransform(1, 0, 0, 1, 0, 0);
    } else {
        win.drawImage(timon, offsetX, offsetY, timonWidth, timonHeight2, timonPosX, timonPosY - offsetTextureY, timonWidth * timonSizeMultiplier, timonHeight2 * timonSizeMultiplier);
    }
    if (currentTick % 10 === 0) {
        timonFrame++;
    }
}

function draw() {
    if (!started) {
        return;
    }
    win.clearRect(0, 0, canvas.width, canvas.height);
    start();
    drawBar();
    if (testBox()["down"] === false) {
        timonPosY += 5;
    }
}

function drawBar() {
    addText(20, 50, hp + " HP", 40);
    addText(430, 50, score, 40);
    win.drawImage(caterpillar, 470, 5, 50, 50);

    let minutes = Math.floor(time / 60);
    let seconds = time - minutes * 60;

    if (minutes < 10)
        minutes = "0" + minutes;
    if (seconds < 10)
        seconds = "0" + seconds;

    addText(canvas.width - 180, 50, minutes + ":" + seconds, 40);
}

function testBox() {
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

            if (timonPosX === 0) {
                result["left"] = true;
            }

            if (level[index] === 1) {
                if (x - levelScroll < 0)
                    continue;
                x2 = Math.abs(x - levelScroll);

                if (debugMode) {
                    win.fillStyle = "blue";
                    win.fillRect(x2, y, blockWidth, 2);
                    win.fillRect(x2, y, 2, blockHeight);
                    win.fillRect(x2 + blockWidth, y, 2, blockHeight);
                    win.fillRect(x2, y + blockHeight, blockWidth, 2);
                }

                if (Math.abs(y - (timonPosY + timonHeight * timonSizeMultiplier)) < 5) {
                    if ((x2 >= timonPosX && Math.abs(x2 - timonPosX) < blockWidth + legsWidth) || x2 <= timonPosX && Math.abs(x2 - timonPosX) < blockWidth) {
                        result["down"] = true;
                    }
                }

                if (Math.abs(x2 - (timonPosX + legsWidth * timonSizeMultiplier)) < timonSpeed + 1 && y < timonPosY + timonHeight * timonSizeMultiplier && y > timonPosY) {
                    result["right"] = true;
                }

                if (Math.abs((x2 + blockWidth) - timonPosX) < timonSpeed + 1 && y < timonPosY + timonHeight * timonSizeMultiplier && y > timonPosY) {
                    result["left"] = true;
                }

            }
        }
    }

    if (debugMode) {
        win.fillStyle = "red";
        win.fillRect(timonPosX, timonPosY + timonHeight * timonSizeMultiplier, legsWidth * timonSizeMultiplier, 2);
        win.fillRect(timonPosX, timonPosY + timonHeight * timonSizeMultiplier, 2, -timonHeight * timonSizeMultiplier);
        win.fillRect(timonPosX, timonPosY, legsWidth * timonSizeMultiplier, 2);
        win.fillRect(timonPosX + legsWidth * timonSizeMultiplier, timonPosY + timonHeight * timonSizeMultiplier, 2, -timonHeight * timonSizeMultiplier);
    }

    return result;
}

function tick() {
    if (!started) {
        return;
    }

    currentTick++;
	
    tickTiles();

    if (timonPosY > canvas.height) {
        hp = 0;
        draw();
        currentTick = 0;
        started = false;
        audio.pause();
        audio.currentTime = 0.0;
        postScore();
        addText(canvas.width / 4, canvas.height / 4, "Игра окончена!", 70, "#000");
    }

    if (rightDown === true && testBox()["right"] === false && !timonHidden) {
        timonDirection = "right";
        if (levelScroll + timonSpeed + canvas.width <= finish) {
            if (timonPosX > canvas.width / 1.5) {
                levelScroll += timonSpeed;
            } else {
                timonPosX += timonSpeed;
            }
        } else {
            if (timonPosX + levelScroll + timonWidth * timonSizeMultiplier + timonSpeed < finish) {
                timonPosX += timonSpeed;
            } else {
                currentTick = 0;
                started = false;
                audio.pause();
                audio.currentTime = 0.0;
                postScore();
                addText(canvas.width / 4, canvas.height / 4, "Победа!", 70, "#000");
            }
        }
    }

    if (leftDown === true && testBox()["left"] === false && !timonHidden) {
        timonDirection = "left";
        if (levelScroll - timonSpeed >= 0) {

            if (timonPosX < (canvas.width / 3) - timonWidth * timonSizeMultiplier) {
                levelScroll -= timonSpeed;
            } else {
                timonPosX -= timonSpeed;
            }

        } else {
            timonPosX -= timonSpeed;
        }
    }

    if (upDown === true && testBox()["down"] === true) {
        preJumptimonPosY = timonPosY;
        inJump = true;
        upDown = false;
        if (timonHidden) {
            timonHidden = false;
        }
    }

    if (inJump === true) {
        if (jumpTime > 0 && testBox()["down"] === true) {
            inJump = false;
            jumpTime = 0;
            timonPosY -= timonPosY % 10;
        } else {
            jumpTime++;
            let jumpY = 4 * jumpDuration * Math.sin(Math.PI * jumpTime / jumpDuration);

            if (jumpTime > jumpDuration) {
                inJump = false;
                jumpTime = 0;
                jumpY = 0;
            }
            timonPosY = preJumptimonPosY - jumpY;
        }
    }

    if (downDown === true) {
        timonHidden = true;
        needHit = -1;
    }
	
	if(spaceDown === true) {
		spaceDown = false;
		if(score > 0) {
			tiles.push([timonPosX + levelScroll + (timonWidth*timonSizeMultiplier)/2, timonPosY, 5, timonDirection, 0]);
			score--;
		}
	}
}

function tickTiles() {
    let x;
    let y;
    let type;
    tiles.forEach(function (tile, i) {
        x = tile[0];
        y = tile[1];
        type = tile[2];

        if (type === 2 && !timonHidden) {
            if (timonPosX + levelScroll + timonWidth * timonSizeMultiplier >= x && timonPosX + levelScroll <= x + hyenaWidth * hyenaSizeMultiplier && timonPosY + 60 <= y && timonPosY + 60 >= y - hyenaHeight * hyenaSizeMultiplier) {
                if (needHit === -1) {
                    hp -= 30;
                    if (hp < 0) {
                        hp = 0;
                    }
                    interactedWith = i;
                    needHit = 0;
                }
            } else {
                if (interactedWith === i) {
                    needHit = -1;
                }
            }
        } else if (type === 3 && !timonHidden) {
            if (timonPosX + levelScroll + timonWidth * timonSizeMultiplier >= x && timonPosX + levelScroll <= x + caterpillarWidth && timonPosY + 60 <= y && timonPosY + 60 >= y - caterpillarHeight) {
                hp += 5;
                if (hp > 100) {
                    hp = 100;
                }
                score++;
                delete tiles[i];
            }
        }

        switch (type) {
            case 2:
                if (x % 100 === 0 && y % 100 === 0) {
                    if (level[getIndex(x + blockWidth * 2, y)] === 1) {
                        tiles[i][3] = "left";
                        tiles[i][4]--;
                        tiles[i][0]--;
                    } else if (level[getIndex(x - blockWidth, y)] === 1) {
                        tiles[i][3] = "right";
                    }
                }

                if (Math.abs(tiles[i][4]) >= 500) {
                    if (tiles[i][3] === "left") {
                        tiles[i][3] = "right";
                    } else {
                        tiles[i][3] = "left";
                    }
                }

                if (level[getIndex(x + x % 100, y + 100)] === 4) {
                    if (tiles[i][3] === "left") {
                        tiles[i][3] = "right";
                    } else {
                        tiles[i][3] = "left";
                    }
                }

                if (tiles[i][3] === "right") {
                    tiles[i][4]++;
                    tiles[i][0]++;
                } else {
                    tiles[i][4]--;
                    tiles[i][0]--;
                }
                break;
            case 3:
                //caterpillar
                break;
			case 5:
				//caterpillar from timon
				if(Math.abs(tiles[i][4]) >= 500) {
					delete tiles[i];
					break;
				}
				
				if(level[getIndex(x - x % 100, y - y % 100)] === 1) {
					delete tiles[i];
					break;
				}
				
				if(tiles[i][3] === "right") {
				    tiles[i][4] += 10;
                    tiles[i][0] += 10;
                } else {
                    tiles[i][4] -= 10;
                    tiles[i][0] -= 10;
                }
				
				tiles.forEach(function (t, id) {
					if(id !== i && tiles[i]) {
						if(t[0] - t[0] % 100 === x - x % 100 && t[1] - tiles[i][1] === 60) {
							delete tiles[i];
							delete tiles[id];
						}
					}
				});
				break;
        }
    });
}

$(document).on('keydown', function (event) {
    switch (event.key) {
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
		case " ":
			spaceDown = true;
			break;
        case "Escape":
            if (currentTick === 0) {
                break;
            }
            if (started) {
                addText(400, canvas.height / 2, "ПАУЗА", 70, "#000");
                started = false;
                audio.pause();
            } else if (currentTick !== 1) {
                started = true;
                audio.play();
            }
            break;
    }
}).on('keyup', function (event) {
    switch (event.key) {
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

function postScore() {
    let xhr = new XMLHttpRequest();

    let name = document.querySelector('input').value;
    if (name === "") {
        name = "Аноним";
    }
    points = 1000 - time + score * 10;
    let body = 'name=' + encodeURIComponent(name) + '&score=' + encodeURIComponent(points);

    xhr.open("POST", 'api/savescore.php', true);
    xhr.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
    xhr.send(body);

    xhr.onreadystatechange = function () {
        if (xhr.readyState === 4) {
            getScore();
        } 
    }
}

function getScore() {
    let xhr = new XMLHttpRequest();
    xhr.onreadystatechange = function () {
        if (xhr.readyState === 4) {
            showBoard(xhr.responseText);
        }
    }
    xhr.open("GET", "api/getscore.php", true);
    xhr.send(null);
}

function showBoard(text) {
    document.getElementById("startButton").style = "hidden: no; margin-top: 600px;";
    win.fillStyle = "white";
    win.fillRect(canvas.width / 4, canvas.height / 3, canvas.width / 2, canvas.height / 2);
    win.strokeStyle = "black";
    win.strokeRect(canvas.width / 4, canvas.height / 3, canvas.width / 2, canvas.height / 2);

    let name = document.querySelector('input').value;
    if (name === "") {
        name = "Вы";
    }

    let array = jQuery.parseJSON(text);
    for (let i = 0; i < array.length; i++) {
        if (i === 9 && points < array[i][2]) {
            addText(canvas.width / 4 + 15, canvas.height / 3 + 25 + i * 30, i + 1 + ". " + name + " - " + points, 25, "#000");
        } else {
            addText(canvas.width / 4 + 15, canvas.height / 3 + 25 + i * 30, i + 1 + ". " + array[i][0] + " - " + array[i][1], 25, "#000");
        }
    }
}

function timer() {
    if (started) {

        if (needHit !== -1 && needHit++ > 0) {
            hp -= 30;
        }

        if (hp < 0) {
            hp = 0;
            draw();
        }

        time++;
        if (hp <= 0) {
            currentTick = 0;
            started = false;
            audio.pause();
            audio.currentTime = 0.0;
            postScore();
            addText(canvas.width / 4, canvas.height / 4, "Игра окончена!", 70, "#000");
        }
        hp--;
    } else {
        if (currentTick === 1) {
            win.clearRect(0, 0, canvas.width, canvas.height);
            load();
            let offsetX = 6;
            let offsetY = 5 - 98 + guideFrame * 98;
            win.fillRect(canvas.width / 3 - 10, 590, guide.width + 10, 98);
            win.drawImage(guide, offsetX, offsetY, guide.width, 98, canvas.width / 3, 600, guide.width, 98);
            guideFrame++;
            if (guideFrame > 3) {
                guideFrame = 1;
            }
        }
    }
}

setInterval(draw, 16);
setInterval(tick, 16);
setInterval(timer, 1000);
