

function start() {
    var size = scale()
    var app = new PIXI.Application(size, size, {view: document.getElementById("gameboard")});
    app.renderer.backgroundColor = 0xE5E3DF;

    var gameBoard = new Board();

    drawTable(app.stage, gameBoard);

    var stonesArray = gameBoard.boardTable;

    setGameboard(stonesArray);

    var firstClicked;

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
            if(!((i == 0 || i == 6) && (j == 0 || j == 6))){

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

              function onPointerDown(){
                var image = this.texture.baseTexture.source.src.split("/").pop();
                  if(firstClicked === undefined){
                    if(image == "whiteCircle64.png"){
                      return;
                    }
                    firstClicked = this;
                    this.scale.x += highlightScaling;
                    this.scale.y += highlightScaling;
                  } else if(image == "whiteCircle64.png"){

                    var firstX = Math.round((firstClicked.x - padding) / px);
                    var firstY = Math.round((firstClicked.y - padding) / px);
                    var secondX = Math.round((this.x - padding) / px);
                    var secondY = Math.round((this.y - padding) / px);


                    if (!validateMove(firstX, firstY, secondX, secondY)){
                      return;
                    }

                    firstClicked.scale.x -= highlightScaling;
                    firstClicked.scale.y -= highlightScaling;
                    var helpx = firstClicked.x;
                    var helpy = firstClicked.y;
                    firstClicked.x = this.x;
                    firstClicked.y = this.y;
                    this.x = helpx;
                    this.y = helpy;
                    firstClicked = undefined;

                    var help = stonesArray[firstX][firstY];
                    stonesArray[firstX][firstY] = stonesArray[secondX][secondY];
                    stonesArray[secondX][secondY] = help;

                    console.log(trianglesFound(secondX, secondY))

                  } else if(firstClicked.x == this.x && firstClicked.y == this.y){
                    firstClicked.scale.x -= highlightScaling;
                    firstClicked.scale.y -= highlightScaling;
                    firstClicked = undefined;
                    return;
                  }
              }

              app.stage.addChild(sprite);

            }
          }
        }
      }



      app.renderer.render(app.stage);
}
