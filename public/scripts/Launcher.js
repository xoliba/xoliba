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

let result = confirm("Choose your color\nThis is ugly. Needs to be changed\nOK = red, cancel = blue");

var game = new Game(app, result);
//game.start(); ?