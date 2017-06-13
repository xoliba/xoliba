import { scale, drawTable } from './Draw.js';
import * as PIXI from 'pixi.js';
import { Game } from './Game';

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
app.renderer.backgroundColor = 0xE5E3DF;


var blueButton = document.getElementById("playAsBlue");
var redButton = document.getElementById("playAsRed");
var undoButton = document.getElementById("undo");
var surrenderButton = document.getElementById("Surrender");
var continueButton = document.getElementById("Continue");
var giveUpButton = document.getElementById("GiveUp");

if(blueButton.addEventListener){
    blueButton.addEventListener("click",
        function(){
            var score = document.getElementById("scorelimit").value;
            document.getElementById("newGamePopUp").style.display = "none";
            for (var i = app.stage.children.length - 1; i >= 1; i--) { app.stage.removeChild(app.stage.children[i]); };
            document.getElementById("bluepoints").innerHTML = 0;
            document.getElementById("redpoints").innerHTML = 0;
            game = new Game(app, -1, score);
        } , false);
} else if (blueButton.attachEvent){
    blueButton.attachEvent("onclick",
        function(){
            var score = document.getElementById("scorelimit").value;
            document.getElementById("newGamePopUp").style.display = "none";
          for (var i = app.stage.children.length - 1; i >= 1; i--) { app.stage.removeChild(app.stage.children[i]); };
            document.getElementById("bluepoints").innerHTML = 0;
            document.getElementById("redpoints").innerHTML = 0;
            game = new Game(app, -1, score);
        });
}

if(redButton.addEventListener){
    redButton.addEventListener("click",
        function(){
            var score = document.getElementById("scorelimit").value;
            document.getElementById("newGamePopUp").style.display = "none";
            for (var i = app.stage.children.length - 1; i >= 1; i--) { app.stage.removeChild(app.stage.children[i]); };
            document.getElementById("bluepoints").innerHTML = 0;
            document.getElementById("redpoints").innerHTML = 0;
            game = new Game(app, 1, score);
        } , false);
} else if (redButton.attachEvent){
    redButton.attachEvent("onclick",
        function(){
            var score = document.getElementById("scorelimit").value;
            document.getElementById("newGamePopUp").style.display = "none";
            for (var i = app.stage.children.length - 1; i >= 1; i--) { app.stage.removeChild(app.stage.children[i]); };
            document.getElementById("bluepoints").innerHTML = 0;
            document.getElementById("redpoints").innerHTML = 0;
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

if(surrenderButton.addEventListener) {
    surrenderButton.addEventListener("click",
    function(){
        game.playerSurrender(true);
    }, false);
} else if (surrenderButton.attachEvent){
        surrenderButton.attachEvent("onClick",
        function(){
            game.playerSurrender(true);
        });
    }
if(continueButton.addEventListener) {
    continueButton.addEventListener("click",
    function(){
        game.playerSurrender(false);
    }, false);
} else if (continueButton.attachEvent){
        continueButton.attachEvent("onClick",
        function(){
            game.playerSurrender(false);
        });
    }

if(giveUpButton.addEventListener) {
    giveUpButton.addEventListener("click",
    function(){
        game.giveUp();
    }, false);
} else if (giveUpButton.attachEvent){
        giveUpButton.attachEvent("onClick",
        function(){
            game.giveUp();
        });
    }
