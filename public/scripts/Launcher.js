

function start() {
    var size = scale()
    var app = new PIXI.Application(size, size, {view: document.getElementById("gameboard")});
    app.renderer.backgroundColor = 0xE5E3DF;

    var gameBoard = new Board();

    drawTable(app.stage, gameBoard);

    var stonesArray = gameBoard.boardTable;
    var starts = gameBoard.startingTurn;
    console.log("on launcher starting turn is: " + starts);

    setGameboard(stonesArray, gameBoard.startingTurn);

    var sprites = [];
    for (var i = 0; i < 7; i++) {
        sprites[i] = [];
    }

    var firstClicked;
    var corners = [];

    var padding = size / 10;
    var px = size / 7.5;
    var radius = px / 4;
    var highlightScaling = radius / 100;

    PIXI.loader
            .add([
                "images/whiteCircle64.png",
                "images/blueCircle64.png",
                "images/redCircle64.png"
            ])
            .load(setup);

    function setup() {
        for (var i = 0; i < 7; i++) {
            for (var j = 0; j < 7; j++) {
                if (!((i == 0 || i == 6) && (j == 0 || j == 6))) {

                    var sprite;

                    let c = stonesArray[i][j];
                    let path = "";
                    if (c == -1) {
                        path = "images/blueCircle64.png";
                    } else if (c == 0) {
                        path = "images/whiteCircle64.png";
                    } else if (c == 1) {
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

                        if (corners.length == 4) { //two corners of the triangle chosen already
                            corners.push(getStonesArrayPosition(this.x));
                            corners.push(getStonesArrayPosition(this.y));
                            sprites[corners[0]][corners[1]].scale.x -= highlightScaling;
                            sprites[corners[0]][corners[1]].scale.y -= highlightScaling;
                            sprites[corners[2]][corners[3]].scale.x -= highlightScaling;
                            sprites[corners[2]][corners[3]].scale.y -= highlightScaling;
                            console.log(corners)
                            hitStones(corners[0], corners[1], corners[2], corners[3], corners[4], corners[5]);
                            corners = [];
                        } else if (corners.length == 2) { //one corner of the triangle chosen already
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
                        } else if (image == "whiteCircle64.png") { //it is not the first click, and no corners are choosed: it is time to motor!

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

                        } else if (firstClicked.x == this.x && firstClicked.y == this.y) {
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
}
