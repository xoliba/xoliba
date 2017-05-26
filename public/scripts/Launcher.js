import { scale, drawTable } from './Draw.js';
import { setGameboard, setSprites, hitStones } from './Logic.js';
import { Board } from './Board.js';
import * as PIXI from 'pixi.js';

var size = scale()
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

app.renderer.backgroundColor = 0xE5E3DF;

gameBoard = new Board();
drawTable(app.stage);

stonesArray = gameBoard.boardTable;
setGameboard(stonesArray, gameBoard.startingTurn);

sprites = [];
for (var i = 0; i < 7; i++) {
    sprites[i] = [];
}

corners = [];

padding = size / 10;
px = size / 7.5;
radius = px / 4;
highlightScaling = radius / 100;

PIXI.loader.
        add([
            "images/whiteCircle64.png",
            "images/blueCircle64.png",
            "images/redCircle64.png"
        ]).
        load(setup);

function setup() {
    for (var i = 0; i < 7; i++) {
        for (var j = 0; j < 7; j++) {
            if (!((i === 0 || i === 6) && (j === 0 || j === 6))) {

                var sprite;

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


                sprite.on('pointerdown', onPointerDown)

                function onPointerDown() {
                    var image = this.texture.baseTexture.source.src.split("/").pop();

                    if (corners.length === 4) { //two corners of the triangle chosen already
                        corners.push(getStonesArrayPosition(this.x));
                        corners.push(getStonesArrayPosition(this.y));
                        sprites[corners[0]][corners[1]].scale.x -= highlightScaling;
                        sprites[corners[0]][corners[1]].scale.y -= highlightScaling;
                        sprites[corners[2]][corners[3]].scale.x -= highlightScaling;
                        sprites[corners[2]][corners[3]].scale.y -= highlightScaling;
                        console.log(corners)
                        hitStones(corners[0], corners[1], corners[2], corners[3], corners[4], corners[5]);
                        corners = [];
                    } else if (corners.length === 2) { //one corner of the triangle chosen already
                        corners.push(getStonesArrayPosition(this.x));
                        corners.push(getStonesArrayPosition(this.y));
                        this.scale.x += highlightScaling;
                        this.scale.y += highlightScaling;
                        console.log(corners)
                    } else if (firstClicked === undefined) { //no stone is clicked, it's the first click of this move!
                        if (image == "whiteCircle64.png") {
                            return;
                        }
                        firstClicked = this;
                        this.scale.x += highlightScaling;
                        this.scale.y += highlightScaling;
                    } else if (image === "whiteCircle64.png") { //it is not the first click, and no corners are choosed: it is time to motor!

                        var firstX = getStonesArrayPosition(firstClicked.x);
                        var firstY = getStonesArrayPosition(firstClicked.y);
                        var secondX = getStonesArrayPosition(this.x);
                        var secondY = getStonesArrayPosition(this.y);

                        console.log("Launcher: change the place of stones (" + firstX + ", " + firstY + "), (" + secondX + ", " + secondY + ")");

                        if (!validateMove(firstX, firstY, secondX, secondY)) {
                            return;
                        }

                        corners.push(getStonesArrayPosition(this.x));
                        corners.push(getStonesArrayPosition(this.y));
                        console.log(corners);

                        var helpx = firstClicked.x;
                        var helpy = firstClicked.y;
                        firstClicked.x = this.x;
                        firstClicked.y = this.y;
                        this.x = helpx;
                        this.y = helpy;
                        firstClicked = undefined;

                        swap2DArrayPositions(sprites, firstX, firstY, secondX, secondY);

                        console.log(trianglesFound(secondX, secondY));

                        //aisocket.send(JSON.stringify(stonesArray));

                    } else if (firstClicked.x === this.x && firstClicked.y === this.y) {
                        firstClicked.scale.x -= highlightScaling;
                        firstClicked.scale.y -= highlightScaling;
                        firstClicked = undefined;
                        return;
                    }
                }

                sprites[i][j] = sprite;

                app.stage.addChild(sprite);

            }
        }
    }
    setSprites(sprites);
}

function getStonesArrayPosition(coordinate) {
    return Math.round((coordinate - padding) / px);
}

function swap2DArrayPositions(array, firstX, firstY, secondX, secondY) {
    var help = array[firstX][firstY];
    array[firstX][firstY] = array[secondX][secondY];
    array[secondX][secondY] = help;
}

app.renderer.render(app.stage);
