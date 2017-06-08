import { scale, drawTable } from './Draw.js';
import * as PIXI from 'pixi.js';
import { Game } from './Game';

var app = new PIXI.Application(scale(), scale(), {view: document.getElementById("gameboard")});

drawTable(app.stage);

/*PIXI.loader.add([
    "images/whiteCircle64.png",
    "images/blueCircle64.png",
    "images/redCircle64.png"
]).load();*/

// a bit less buggy version
app.renderer.render(app.stage);
app.renderer.backgroundColor = 0xE5E3DF;


var game = new Game(app);

function startNewGame(){
    var game = new Game(app);
}

var button = document.getElementById("Play");
if(button.addEventListener){
    button.addEventListener("click", function(){ var game = new Game(app); }, false);
} else if (button.attachEvent){
    button.attachEvent("onclick", function(){ var game = new Game(app); });
}
//game.start(); ?
