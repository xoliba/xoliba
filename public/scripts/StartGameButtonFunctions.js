 /**
 * Created by vili on 18.6.2017.
 */

import { Game } from './Game';
import { addButtonFunctions, showStartRoundOptions, resetButtons } from './ButtonFunctions.js';

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
    resetButtons();
    document.getElementById("bluepoints").innerHTML = 0;
    document.getElementById("redpoints").innerHTML = 0;
}

function watchGameButtonFunction(game, app) {
    if (watchButton.addEventListener){
        watchButton.addEventListener("click",
            function() {clickOnWatchGame(game, app)}, false);
            //notSupportedYetAlert, false);
    } else if (watchButton.attachEvent) {
        watchButton.attachEvent("onclick",
            function() {clickOnWatchGame(game, app)}, false);
            //notSupportedYetAlert);
    }
    return game;
}

function clickOnWatchGame(game, app) {
    let score = document.getElementById("scorelimitW").value;
    let alvl = document.getElementById("Alvl").value;
    let blvl = document.getElementById("Blvl").value;
    alvl = alvl < 1 ? 1 : alvl; //todo validate upper bound of ai levels
    blvl = blvl < 1 ? 1 : blvl;
    document.getElementById("newWatchGamePopUp").style.display = "none";
    clearOldGame(app);
    game = new Game(app, 0, score, alvl, blvl);
    addButtonFunctions(game);
}

function notSupportedYetAlert() {
    alert("not supperted yet");
}

function hideNewGame() {
    document.getElementById("NewGame").style.display = "none";
    showStartRoundOptions();
}

export { addNewGameButtonFunctions };