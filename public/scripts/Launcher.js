import { scale, drawTable } from './Draw.js';
//import { setGameboard, setSprites, hitStones, validateMove, getTurn, isMovesAvailable, changeTurn, trianglesFound } from './Logic.js';
import { Board } from './Board.js';
import { Logic } from './Logic.js';
import { AiSocket } from './Websocket.js';
//import { getStonesArrayPosition, checkTurn, addCorner, swapPositions, swap2DArrayPositions, enlarge, minimize } from './Launcherhelpers.js';
import { Helpers } from './Helpers.js';
import * as PIXI from 'pixi.js';

var size = scale();
var app = new PIXI.Application(size, size, {view: document.getElementById("gameboard")});
var board; //Board -object that creates an array that contains the positions of stones. Also gives the starting turn.
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
var helpers;

//kinda shady workaround try for the bug...
var movedStoneX;
var movedStoneY;
var movedStoneX2;
var movedStoneY2;

app.renderer.backgroundColor = 0xE5E3DF;

board = new Board();
//logic = new Logic(board.table, board.startingTurn);
logic = new Logic();
helpers = new Helpers();
drawTable(app.stage);

sprites = [];
for (let i = 0; i < 7; i++) {
    sprites[i] = [];
}

corners = [];

padding = size / 10;
px = size / 7.5;
radius = px / 4;
highlightScaling = radius / 100;

function updateBoard(newArray, isFromAI) {
    board.table = newArray;
    //logic.gameboard = newArray;

    for (var i = 0; i < 7; i++) {
        for (var j = 0; j < 7; j++) {
            if(!((i === 0 || i === 6) && (j === 0 || j === 6))) {
                if (board.table[i][j] === 0) {
                    sprites[i][j].texture = PIXI.loader.resources["images/whiteCircle64.png"].texture;
                } else if (board.table[i][j] === 1) {
                    sprites[i][j].texture = PIXI.loader.resources["images/redCircle64.png"].texture;
                } else if (board.table[i][j] === -1) {
                    sprites[i][j].texture = PIXI.loader.resources["images/blueCircle64.png"].texture;
                }
            }
        }
    }
    if (isFromAI) {
        //logic.changeTurn();
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
                if(board.table[i][j] === 1) {
                    reds++;
                    let found = logic.trianglesFound(i, j, true);
                    if(found > redsBiggest) {
                        redsBiggest = found;
                    }
                } else if (board.table[i][j] === -1){
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
    var latestX = helpers.getStonesArrayPosition(this.x, padding, px);
    var latestY = helpers.getStonesArrayPosition(this.y, padding, px);

    if (corners.length === 4) { //two corners of the triangle chosen already
        checkIfLegalTriangle(latestX, latestY);
    } else if (corners.length === 2) { //one corner of the triangle chosen already
        parseSecondCorner(latestX, latestY, this);
    } else if (firstClicked === undefined) { //no stone is clicked, it's the first click of this move!
        parseFirstClick(latestX, latestY, this);
    } else if (image === "whiteCircle64.png") { //it is not the first click, and no corners are choosed: it is time to motor!
        parseClickOnWhiteStone(latestX, latestY, this);
    } else if (firstClicked.x === this.x && firstClicked.y === this.y) {
        abortMove();
    }
}

function parseFirstClick(latestX, latestY, sprite) {
    /*if (!helpers.checkTurn(latestX, latestY, board.table, logic)) {
        return;
    }*/

    firstClicked = sprite;
    helpers.enlarge(sprite, highlightScaling);
}

function abortMove() {
    helpers.minimize(firstClicked, highlightScaling);
    firstClicked = undefined;
    return;
}

function parseSecondCorner(latestX, latestY, sprite) {
    if (!helpers.checkTurn(latestX, latestY, board.table, logic) || (latestX === corners[0] && latestY === corners[1]) || (latestX === corners[2] && latestY === corners[3])) {
        return;
    }

    helpers.addCorner(latestX, latestY, corners);
    helpers.enlarge(sprite, highlightScaling);
}

function parseClickOnWhiteStone(latestX, latestY, sprite) {

    let firstX = helpers.getStonesArrayPosition(firstClicked.x, padding, px);
    let firstY = helpers.getStonesArrayPosition(firstClicked.y, padding, px);

    if (!logic.validateMove(firstX, firstY, latestX, latestY, board.table)) {
        return;
    }

    helpers.addCorner(latestX, latestY, corners);
    helpers.swapPositions(sprite, firstClicked);
    helpers.swap2DArrayPositions(board.table, firstX, firstY, latestX, latestY);

    //console.log(board.table[firstX][firstY]);
    //console.log(board.table[latestX][latestY]);
    //helpers.swap2DArrayPositions(board.table, firstX, firstY, latestX, latestY);
    /*var help = board.table[firstX][firstY];
    board.table[firstX][firstY] = board.table[latestX][latestY];
    board.table[latestX][latestY] = help;*/
    //console.log(board.table[firstX][firstY]);
    //console.log(board.table[latestX][latestY]);
    firstClicked = undefined;


    helpers.swap2DArrayPositions(sprites, firstX, firstY, latestX, latestY);
    movedStoneX = firstX;
    movedStoneY = firstY;
    movedStoneX2 = latestX;
    movedStoneY2 = latestY;
    console.log("JUST MOVED SOME SHIT! " + "("+movedStoneX+","+movedStoneY+") + ("+movedStoneX2+","+movedStoneY2+")");
}

function checkIfLegalTriangle(latestX, latestY) {
    if (!helpers.checkTurn(latestX, latestY, board.table, logic)) {
        return;
    }

    helpers.addCorner(latestX, latestY, corners);

    let moveIsLegal = logic.hitStones(corners[0], corners[1], corners[2], corners[3], corners[4], corners[5], board.table);

    /*if (moveIsLegal === false) {
        //DO SOMETHING?
        return false;
    }*7

    //console.log(board.table);
    //workaround for the bug:
    /*helpers.swap2DArrayPositions(sprites, movedStoneX, movedStoneY, movedStoneX2, movedStoneY2);
    console.log("("+movedStoneX+","+movedStoneY+") + ("+movedStoneX2+","+movedStoneY2+")");*/

    checkIfLegalMove(moveIsLegal);
    return true;
}

function checkIfLegalMove(moveIsLegal) { // function name questionable
    helpers.minimize(sprites[corners[2]][corners[3]], highlightScaling);

    if(!moveIsLegal){
        for (let i = 0; i < 4; i++) {
            corners.pop();
        }
    } else {
        helpers.minimize(sprites[corners[0]][corners[1]], highlightScaling);
        corners = [];
        let availableMoves = logic.isMovesAvailable(board.table);
        if (logic.turnCounter === 3) {
            alert("30 rounds without hits, round ended!");
             updatePoints();
             return;
        }
        if(!availableMoves && roundskipped === 0){
            roundskipped++;
            alert("No moves available, skipping turn!");
            //logic.changeTurn();
        } else if(!availableMoves) {
            alert("Two consecutive turns skipped, round ended!");
            updatePoints();
        } else if(roundskipped !== 0) {
            roundskipped = 0;
        }
    }

    //aisocket.sendTable(board.table);
    //console.log(board.table);
    updateBoard(board.table, false);
    //console.log(board.table);
}

function setupSprites() {
    for (let i = 0; i < 7; i++) {
        for (let j = 0; j < 7; j++) {
            if (!((i === 0 || i === 6) && (j === 0 || j === 6))) {

                let sprite;

                let stoneVal = board.table[i][j];
                let path = "";
                if (stoneVal === -1) {
                    path = "images/blueCircle64.png";
                } else if (stoneVal === 0) {
                    path = "images/whiteCircle64.png";
                } else if (stoneVal === 1) {
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
}

function startNewGame(){
    board = new Board();
    //board.table = board.table;
    setGameboard(board.table, board.startingTurn);
    setupSprites();
}

PIXI.loader.
        add([
            "images/whiteCircle64.png",
            "images/blueCircle64.png",
            "images/redCircle64.png"
        ]).
        load(setupSprites);

app.renderer.render(app.stage);

export { updateBoard, sprites };
