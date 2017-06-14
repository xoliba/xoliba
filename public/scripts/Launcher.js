import { scale, drawTable } from './Draw.js';
import * as PIXI from 'pixi.js';

import { Game } from './Game';
import { printLine } from './InfoConsole';

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
var surrenderButton = document.getElementById("Surrender");
var continueButton = document.getElementById("StartRound");
var giveUpButton = document.getElementById("GiveUp");

if(blueButton.addEventListener){

/*
    blueButton.addEventListener("click", () => { doStuff(app, game, -1) }, false);
} else if (blueButton.attachEvent){
    blueButton.attachEvent("onclick", () => { doStuff(app, game, -1) });
}

if(redButton.addEventListener){
    redButton.addEventListener("click", () => { doStuff(app, game, 1) }, false);
} else if (redButton.attachEvent){
    redButton.attachEvent("onclick", () => { doStuff(app, game, 1) });
*/

blueButton.addEventListener("click",
        function(){
            var score = document.getElementById("scorelimit").value;
            document.getElementById("newGamePopUp").style.display = "none";
            hideNewGameAndShowStartRoundOptions();
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
            hideNewGameAndShowStartRoundOptions();
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
            hideNewGameAndShowStartRoundOptions();
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
            hideNewGameAndShowStartRoundOptions();
            for (var i = app.stage.children.length - 1; i >= 1; i--) { app.stage.removeChild(app.stage.children[i]); };
            document.getElementById("bluepoints").innerHTML = 0;
            document.getElementById("redpoints").innerHTML = 0;
            game = new Game(app, 1, score);
        });
}

if(undoButton.addEventListener){
    undoButton.addEventListener("click",
        () => {
            game.undo();
        } , false);
} else if (undoButton.attachEvent){
    undoButton.attachEvent("onclick",
        () => {
            game.undo();
        });
}

/*function doStuff(app, game, color) {
    var score = document.getElementById("scorelimit").value;
    document.getElementById("newGamePopUp").style.display = "none";
    for (var i = app.stage.children.length - 1; i >= 1; i--) {
        app.stage.removeChild(app.stage.children[i]);
    }
    game = new Game(app, color, score);
}
*/

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
        hideStartRoundOptionsAndShowInGameOptions();
    }, false);
} else if (continueButton.attachEvent){
        continueButton.attachEvent("onClick",
        function(){
            game.playerSurrender(false);
            hideStartRoundOptionsAndShowInGameOptions();
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

function hideNewGameAndShowStartRoundOptions(){
    document.getElementById("NewGame").style.display = "none";
    surrenderButton.style.display = "block";
    continueButton.style.display = "block";
}

function hideStartRoundOptionsAndShowInGameOptions(){
    surrenderButton.style.display = "none";
    continueButton.style.display = "none";
    undoButton.style.display = "block";
    giveUpButton.style.display = "block";
}
