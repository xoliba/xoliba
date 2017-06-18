/**
 * Created by vili on 18.6.2017.
 */

import { Game } from './Game';
import { addButtonFunctions, showStartRoundOptions } from './ButtonFunctions.js';

var blueButton = document.getElementById("playAsBlue");
var redButton = document.getElementById("playAsRed");
var watchButton = document.getElementById("watchGame");


function addNewGameButtonFunctions(game, app) {  //These functions create a new game
    blueButtonFunction(game, app);
    redButtonFunction(game, app);
    watchGameButtonFunction(game, app);
}

//todo refactor this copypasta awwaaaayyyyy...
function blueButtonFunction(game, app) {
    if (blueButton.addEventListener){
        blueButton.addEventListener("click",
            function(){
                var score = document.getElementById("scorelimit").value;
                document.getElementById("newGamePopUp").style.display = "none";
                hideNewGame();
                clearOldGame(app);
                game = new Game(app, -1, score, getAIdifficulty());
                game.printStartMessage();
                addButtonFunctions(game);

            } , false);
    } else if (blueButton.attachEvent) {
        blueButton.attachEvent("onclick",
            function () {
                var score = document.getElementById("scorelimit").value;
                document.getElementById("newGamePopUp").style.display = "none";
                hideNewGame();
                clearOldGame(app);
                game = new Game(app, -1, score, getAIdifficulty());
                game.printStartMessage();
                addButtonFunctions(game);
            });
    }
    return game;
}

function redButtonFunction(game, app) {
    if (redButton.addEventListener) {
        redButton.addEventListener("click",
            function () {
                var score = document.getElementById("scorelimit").value;
                document.getElementById("newGamePopUp").style.display = "none";
                hideNewGame();
                clearOldGame(app);
                game = new Game(app, 1, score, getAIdifficulty());
                game.printStartMessage();
                addButtonFunctions(game);
            }, false);
    } else if (redButton.attachEvent) {
        redButton.attachEvent("onclick",
            function () {
                var score = document.getElementById("scorelimit").value;
                document.getElementById("newGamePopUp").style.display = "none";
                hideNewGame();
                clearOldGame(app);
                game = new Game(app, 1, score, getAIdifficulty());
                game.printStartMessage();
                addButtonFunctions(game);
            });
    }
    return game;
}

function clearOldGame(app) {
    for (var i = app.stage.children.length - 1; i >= 1; i--)
        app.stage.removeChild(app.stage.children[i]);
    document.getElementById("bluepoints").innerHTML = 0;
    document.getElementById("redpoints").innerHTML = 0;
}

function watchGameButtonFunction(game, app) {
    //todo validate input (AI levels at least)
    if (watchButton.addEventListener){
        watchButton.addEventListener("click",
            function() {clickOnWatchGame(app)}, false);
            //notSupportedYetAlert, false);
    } else if (watchButton.attachEvent) {
        watchButton.attachEvent("onclick",
            function() {clickOnWatchGame(app)}, false);
            //notSupportedYetAlert);
    }
    return game;
}

function clickOnWatchGame(app) {
    let score = document.getElementById("scorelimitW").value;
    let alvl = document.getElementById("Alvl").value;
    let blvl = document.getElementById("Blvl").value;
    console.log("watch game was clicked! score limit " + score + " blue level + " + alvl + " red level " + blvl);
    document.getElementById("newWatchGamePopUp").style.display = "none";
    clearOldGame(app);

}

function notSupportedYetAlert() {
    alert("not supperted yet");
}

function hideNewGame() {
    document.getElementById("NewGame").style.display = "none";
    showStartRoundOptions();
}

export { addNewGameButtonFunctions };