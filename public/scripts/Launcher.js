import { scale, drawTable } from './Draw.js';
//import { setGameboard, setSprites, hitStones, validateMove, getTurn, isMovesAvailable, changeTurn, trianglesFound } from './Logic.js';
import { Board } from './Board.js';
import { Logic } from './Logic.js';
import { AiSocket } from './Websocket.js';
//import { getStonesArrayPosition } from './Launcherhelpers.js';
import * as PIXI from 'pixi.js';

var size = scale();
var app = new PIXI.Application(size, size, {view: document.getElementById("gameboard")});
var gameBoard; //Board -object that creates an array that contains the positions of stones. Also gives the starting turn.
var stonesArray; //the array created by Board.object
var firstClicked; //first clicked stone
var sprites; //array that contains references to stones
var corners; //array that contains the coordinates for selected stones that will form a triangle
var padding; //the gameboards scaled distance from the edge of the window
var px; //the scaled space between stones
var radius; //the scaled radius of stones
var highlightScaling; //scaled value that is added to the size of stone when it's selected.
var roundskipped = 0;
var aisocket = new AiSocket();

var logic;

app.renderer.backgroundColor = 0xE5E3DF;

gameBoard = new Board();
logic = new Logic(gameBoard.boardTable, gameBoard.startingTurn);
drawTable(app.stage);

stonesArray = gameBoard.boardTable;

sprites = [];
for (let i = 0; i < 7; i++) {
    sprites[i] = [];
}

corners = [];

padding = size / 10;
px = size / 7.5;
radius = px / 4;
highlightScaling = radius / 100;

function getStonesArrayPosition(coordinate) {
    return Math.round((coordinate - padding) / px);
}

function swap2DArrayPositions(array, firstX, firstY, secondX, secondY) {
    var help = array[firstX][firstY];
    array[firstX][firstY] = array[secondX][secondY];
    array[secondX][secondY] = help;
}

function checkTurn(x, y){
    return stonesArray[x][y] === logic.getTurn();
}

function updateBoard(stonesArray, sprites) {
    for (var i = 0; i < 7; i++) {
        for (var j = 0; j < 7; j++) {
            if(!((i === 0 || i === 6) && (j === 0 || j === 6))) {
            if (stonesArray[i][j] === 0) {
                sprites[i][j].texture = PIXI.loader.resources["images/whiteCircle64.png"].texture;
            } else if (stonesArray[i][j] === 1) {
                sprites[i][j].texture = PIXI.loader.resources["images/redCircle64.png"].texture;
            } else if (stonesArray[i][j] === -1) {
                console.log("haloo");
                sprites[i][j].texture = PIXI.loader.resources["images/blueCircle64.png"].texture;
            }
        }
    }
    }
}
function updatePoints(){
    let bluesBiggest = 0;
    let redsBiggest = 0;
    let blues = 0;
    let reds = 0;
    for (var i = 0; i < 7; i++) {
        for (var j = 0; j < 7; j++) {
            if(!((i === 0 || i === 6) && (j === 0 || j === 6))) {
                if(stonesArray[i][j] == 1) {
                    reds++;
                    let found = logic.trianglesFound(i, j, true);
                    if(found > redsBiggest) {
                        redsBiggest = found;
                    }
                } else if (stonesArray[i][j] == -1){
                    blues++;
                    let found = logic.trianglesFound(i, j, true);
                    if(found > bluesBiggest) {
                        bluesBiggest = found;
                    }
                }
            }
        }
    }

    if (redsBiggest === bluesBiggest) {
        alert("It's a draw, no points given");
    } else if (redsBiggest > bluesBiggest) {
        let element = document.getElementById("redpoints");
        let points = (17 - blues) * redsBiggest;
        let current = parseInt(element.innerHTML, 10);
        current += points;
        element.innerHTML = current;
        alert("Red wins the round! " + points + " points awarded!");
        if (current > 50){
            element.style.fontSize = "x-large";
            element.style.color = "GoldenRod";
            element.innerHTML += " WINNER";
            alert("Red Wins! final score: " + current + " - " + document.getElementById("bluepoints").innerHTML);
            element.style.fontSize = "medium";
            element.style.color = "black";
            element.innerHTML = 0;
            document.getElementById("bluepoints").innerHTML = 0;
        }
    } else {
        let element = document.getElementById("bluepoints");
        let points = (17 - reds) * bluesBiggest;
        let current = parseInt(element.innerHTML, 10);
        current += points;
        element.innerHTML = current;
        alert("Blue Wins! " + points + " points awarded!");
        if (current > 50){
            element.style.fontSize = "x-large";
            element.style.color = "GoldenRod";
            element.innerHTML += " WINNER";
            alert("Blue Wins! final score: " + current + " - " + document.getElementById("redpoints").innerHTML);
            element.style.fontSize = "medium";
            element.style.color = "black";
            element.innerHTML = 0;
            document.getElementById("redpoints").innerHTML = 0;
        }
    }
    startNewGame();
}

function onPointerDown() {
    let image = this.texture.baseTexture.source.src.split("/").pop();
    var latestX = getStonesArrayPosition(this.x);
    var latestY = getStonesArrayPosition(this.y);

    if (corners.length === 4) { //two corners of the triangle chosen already
        if (!checkTurn(latestX, latestY)) {
            return;
        }
        
        checkIfLegalTriangle(latestX, latestY);
    } else if (corners.length === 2) { //one corner of the triangle chosen already
        if (!checkTurn(latestX, latestY) || (latestX === corners[0] && latestY === corners[1])) {
            return;
        }

        corners.push(latestX);
        corners.push(latestY);
        enlarge(this);
    } else if (firstClicked === undefined) { //no stone is clicked, it's the first click of this move!
        if (!checkTurn(latestX, latestY)) {
            return;
        }

        firstClicked = this;
        enlarge(this);
    } else if (image === "whiteCircle64.png") { //it is not the first click, and no corners are choosed: it is time to motor!
        let firstX = getStonesArrayPosition(firstClicked.x);
        let firstY = getStonesArrayPosition(firstClicked.y);

        if (!logic.validateMove(firstX, firstY, latestX, latestY, false)) {
            return;
        }

        corners.push(latestX);
        corners.push(latestY);

        let helpx = firstClicked.x;
        let helpy = firstClicked.y;
        firstClicked.x = this.x;
        firstClicked.y = this.y;
        this.x = helpx;
        this.y = helpy;
        firstClicked = undefined;

        swap2DArrayPositions(sprites, firstX, firstY, latestX, latestY);

    } else if (firstClicked.x === this.x && firstClicked.y === this.y) {
        minimize(firstClicked);
        firstClicked = undefined;
        return;
    }
}

function checkIfLegalTriangle(latestX, latestY) {
    corners.push(latestX);
    corners.push(latestY);
    let move = logic.hitStones(corners[0], corners[1], corners[2], corners[3], corners[4], corners[5]);
    aisocket.sendTable(stonesArray);
    updateBoard(stonesArray, sprites);
    if(!move){
        minimize(sprites[corners[2]][corners[3]]);
        for (let i = 0; i < 4; i++) {
            corners.pop();
        }
    } else {
        minimize(sprites[corners[0]][corners[1]]);
        minimize(sprites[corners[2]][corners[3]]);
        corners = [];
        let availableMoves = logic.isMovesAvailable();
        if(!availableMoves && roundskipped === 0){
            roundskipped++;
            alert("No moves available, skipping turn!");
            logic.changeTurn();
        } else if(!availableMoves) {
            alert("Two consecutive turns skipped, round ended!");
            logic.updatePoints();
        } else if(roundskipped !== 0) {
            roundskipped = 0;
        }
    }
}

function enlarge(sprite) {
    sprite.scale.x += highlightScaling;
    sprite.scale.y += highlightScaling;
}

function minimize(sprite) {
    sprite.scale.x -= highlightScaling;
    sprite.scale.y -= highlightScaling;
}

function setup() {
    for (let i = 0; i < 7; i++) {
        for (let j = 0; j < 7; j++) {
            if (!((i === 0 || i === 6) && (j === 0 || j === 6))) {

                let sprite;

                let c = stonesArray[i][j];
                let path = "";
                if (c === -1) {
                    path = "images/blueCircle64.png";
                } else if (c === 0) {
                    path = "images/whiteCircle64.png";
                } else if (c === 1) {
                    path = "images/redCircle64.png";
                }

                sprite = new PIXI.Sprite(
                        PIXI.loader.resources[path].texture
                        );

                sprite.interactive = true;
                sprite.buttonMode = true;
                sprite.anchor.x = 0.5;
                sprite.anchor.y = 0.5;
                sprite.x = padding + i * px;
                sprite.y = padding + j * px;
                sprite.width = radius * 2;
                sprite.height = radius * 2;

                sprite.on('pointerdown', onPointerDown);

                sprites[i][j] = sprite;

                app.stage.addChild(sprite);

            }
        }
    }
    logic.setSprites(sprites);
}

function startNewGame(){
    gameBoard = new Board();
    stonesArray = gameBoard.boardTable;
    setGameboard(stonesArray, gameBoard.startingTurn);
    setup();
}

PIXI.loader.
        add([
            "images/whiteCircle64.png",
            "images/blueCircle64.png",
            "images/redCircle64.png"
        ]).
        load(setup);

app.renderer.render(app.stage);

export { updateBoard, sprites };
