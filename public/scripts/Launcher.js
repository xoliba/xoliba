import { scale, drawTable } from './Draw.js';
import * as PIXI from 'pixi.js';
import { Game } from './Game';
import { printLine } from './infoConsole';

var app = new PIXI.Application(scale(), scale(), {view: document.getElementById("gameboard")});
var game;

drawTable(app.stage);

/*PIXI.loader.add([
    "images/whiteCircle64.png",
    "images/blueCircle64.png",
    "images/redCircle64.png"
]).load();*/

// a bit less buggy version
app.renderer.render(app.stage);
app.renderer.backgroundColor = 0xF8F8F8;


var blueButton = document.getElementById("playAsBlue");
var redButton = document.getElementById("playAsRed");
var undoButton = document.getElementById("undo");

if(blueButton.addEventListener){
    blueButton.addEventListener("click",
        function(){
            var score = document.getElementById("scorelimit").value;
            document.getElementById("newGamePopUp").style.display = "none";
            for (var i = app.stage.children.length - 1; i >= 1; i--) { app.stage.removeChild(app.stage.children[i]); };
            game = new Game(app, -1, score);
        } , false);
} else if (blueButton.attachEvent){
    blueButton.attachEvent("onclick",
        function(){
            var score = document.getElementById("scorelimit").value;
            document.getElementById("newGamePopUp").style.display = "none";
          for (var i = app.stage.children.length - 1; i >= 1; i--) { app.stage.removeChild(app.stage.children[i]); };
            game = new Game(app, -1, score);
        });
}

if(redButton.addEventListener){
    redButton.addEventListener("click",
        function(){
            var score = document.getElementById("scorelimit").value;
            document.getElementById("newGamePopUp").style.display = "none";
            for (var i = app.stage.children.length - 1; i >= 1; i--) { app.stage.removeChild(app.stage.children[i]); };
            game = new Game(app, 1, score);
        } , false);
} else if (redButton.attachEvent){
    redButton.attachEvent("onclick",
        function(){
            var score = document.getElementById("scorelimit").value;
            document.getElementById("newGamePopUp").style.display = "none";
            for (var i = app.stage.children.length - 1; i >= 1; i--) { app.stage.removeChild(app.stage.children[i]); };
            game = new Game(app, 1, score);
        });
}

if(undoButton.addEventListener){
    undoButton.addEventListener("click",
        function(){
            game.undo();
        } , false);
} else if (undoButton.attachEvent){
    undoButton.attachEvent("onclick",
        function(){
            game.undo();
        });
}
