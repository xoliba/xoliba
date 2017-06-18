/**
 * Created by vili on 18.6.2017.
 */

import { Game } from './Game';
import { addButtonFunctions, showStartRoundOptions } from './ButtonFunctions.js';

var blueButton = document.getElementById("playAsBlue");
var redButton = document.getElementById("playAsRed");


function addNewGameButtonFunctions(game, app) {  //These functions create a new game
    blueButtonFunction(game, app);
    redButtonFunction(game, app);
}

function blueButtonFunction(game, app) {
    if (blueButton.addEventListener){
        blueButton.addEventListener("click",
            function(){
                var score = document.getElementById("scorelimit").value;
                document.getElementById("newGamePopUp").style.display = "none";
                hideNewGame();
                for (var i = app.stage.children.length - 1; i >= 1; i--)
                    app.stage.removeChild(app.stage.children[i]);
                document.getElementById("bluepoints").innerHTML = 0;
                document.getElementById("redpoints").innerHTML = 0;
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
                for (var i = app.stage.children.length - 1; i >= 1; i--)
                    app.stage.removeChild(app.stage.children[i]);
                document.getElementById("bluepoints").innerHTML = 0;
                document.getElementById("redpoints").innerHTML = 0;
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
                for (var i = app.stage.children.length - 1; i >= 1; i--)
                    app.stage.removeChild(app.stage.children[i]);
                document.getElementById("bluepoints").innerHTML = 0;
                document.getElementById("redpoints").innerHTML = 0;
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
                for (var i = app.stage.children.length - 1; i >= 1; i--)
                    app.stage.removeChild(app.stage.children[i]);
                document.getElementById("bluepoints").innerHTML = 0;
                document.getElementById("redpoints").innerHTML = 0;
                game = new Game(app, 1, score, getAIdifficulty());
                game.printStartMessage();
                addButtonFunctions(game);
            });
    }
    return game;
}

function hideNewGame() {
    document.getElementById("NewGame").style.display = "none";
    showStartRoundOptions();
}

export { addNewGameButtonFunctions };