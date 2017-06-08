import { scale, drawTable } from './Draw.js';
import * as PIXI from 'pixi.js';
import { Game } from './Game';

var app = new PIXI.Application(scale(), scale(), {view: document.getElementById("gameboard")});

drawTable(app.stage);

/*PIXI.loader.add([
    "images/whiteCircle64.png",
    "images/blueCircle64.png",
    "images/redCircle64.png"
<<<<<<< ecae31792c7ce5006d7c9f386ed2c9dc39c1baeb
]).load();*/

// a bit less buggy version
app.renderer.render(app.stage);
app.renderer.backgroundColor = 0xE5E3DF;

var game = new Game(app);

var blueButton = document.getElementById("playAsBlue");
var redButton = document.getElementById("playAsRed");

if(blueButton.addEventListener){
    blueButton.addEventListener("click",
        function(){
            var score = document.getElementById("scorelimit").value;
            document.getElementById("newGamePopUp").style.visibility = "hidden";
            var game = new Game(app, -1, score);
        } , false);
} else if (blueButton.attachEvent){
    blueButton.attachEvent("onclick",
        function(){
            var score = document.getElementById("scorelimit").value;
            document.getElementById("newGamePopUp").style.visibility = "hidden";
            var game = new Game(app, -1, score);
        });
}

if(redButton.addEventListener){
    redButton.addEventListener("click",
        function(){
            var score = document.getElementById("scorelimit").value;
            document.getElementById("newGamePopUp").style.visibility = "hidden";
            var game = new Game(app, 1, score);
        } , false);
} else if (redButton.attachEvent){
    redButton.attachEvent("onclick",
        function(){
            var score = document.getElementById("scorelimit").value;
            document.getElementById("newGamePopUp").style.visibility = "hidden";
            var game = new Game(app, 1, score);
        });
}
//game.start(); ?
