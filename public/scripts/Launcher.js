import { scale, drawTable } from './Draw.js';
import * as PIXI from 'pixi.js';

var app = new PIXI.Application(scale(), scale(), {view: document.getElementById("gameboard")});

drawTable(app.stage);

PIXI.loader.add([
    "images/whiteCircle64.png",
    "images/blueCircle64.png",
    "images/redCircle64.png"
]).load(setupSprites);

app.renderer.render(app.stage);

var game = new Game(app);
//game.start(); ?