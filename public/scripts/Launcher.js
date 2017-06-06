import { scale, drawTable } from './Draw.js';
import * as PIXI from 'pixi.js';
import { Game } from './Game';

var app = new PIXI.Application(scale(), scale(), {view: document.getElementById("gameboard")});

drawTable(app.stage);

PIXI.loader.add([
    "images/whiteCircle64.png",
    "images/blueCircle64.png",
    "images/redCircle64.png"
]).load();

app.renderer.render(app.stage);
app.renderer.backgroundColor = 0xE5E3DF;

var game = new Game(app, PIXI);
//game.start(); ?