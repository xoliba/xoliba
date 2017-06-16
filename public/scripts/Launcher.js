import { scale, drawTable } from './Draw.js';
import * as PIXI from 'pixi.js';

import { Game } from './Game';
import { printLine } from './InfoConsole';
import { addButtonFunctions, addNewGameButtonFunctions } from './ButtonFunctions.js';

var app = new PIXI.Application(scale(), scale(), {view: document.getElementById("gameboard"), transparent: true});
var game;

drawTable(app.stage);

/*PIXI.loader.add([
    "images/whiteCircle64.png",
    "images/blueCircle64.png",
    "images/redCircle64.png"
]).load();*/

// a bit less buggy version
app.renderer.render(app.stage);
addNewGameButtonFunctions(game, app);
