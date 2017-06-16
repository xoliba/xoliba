
import { Game } from './Game';



var blueButton = document.getElementById("playAsBlue");
var redButton = document.getElementById("playAsRed");
var undoButton = document.getElementById("undo");
var surrenderButton = document.getElementById("Surrender");
var continueButton = document.getElementById("StartRound");
var giveUpButton = document.getElementById("GiveUp");
var notificationButton = document.getElementById('closeNotification');

function addNewGameButtonFunctions(game, app) {  //These functions create a new game
    blueButtonFunction(game, app);
    redButtonFunction(game, app);
}

function addButtonFunctions(game) {     //These functions use the game created in addNewGameButtonFunctions
    undoButtonFunction(game);
    surrenderButtonFunction(game);
    continueButtonFunction(game);
    giveUpButtonFunction(game);
    notificationFunction(game);
}

function blueButtonFunction(game, app) {
    if (blueButton.addEventListener){

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
                hideNewGameAndShowStartRoundOptions();
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
                hideNewGameAndShowStartRoundOptions();
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
                hideNewGameAndShowStartRoundOptions();
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
function undoButtonFunction(game) {
    if (undoButton.addEventListener) {
        undoButton.addEventListener("click",
            () => {
                game.undo();
            }, false);
    } else if (undoButton.attachEvent) {
        undoButton.attachEvent("onclick",
            () => {
                game.undo();
            });
    }
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
function surrenderButtonFunction(game) {
    if (surrenderButton.addEventListener) {
        surrenderButton.addEventListener("click",
            function () {
                game.playerSurrender(true);
            }, false);
    } else if (surrenderButton.attachEvent) {
        surrenderButton.attachEvent("onClick",
            function () {
                game.playerSurrender(true);
            });
    }
}
function continueButtonFunction(game) {
    if (continueButton.addEventListener) {
        continueButton.addEventListener("click",
            function () {
                game.playerSurrender(false);
                hideStartRoundOptionsAndShowInGameOptions();
            }, false);
    } else if (continueButton.attachEvent) {
        continueButton.attachEvent("onClick",
            function () {
                game.playerSurrender(false);
                hideStartRoundOptionsAndShowInGameOptions();
            });
    }
}
function giveUpButtonFunction(game) {
    if (giveUpButton.addEventListener) {
        giveUpButton.addEventListener("click",
            function () {
                game.giveUp();
            }, false);
    } else if (giveUpButton.attachEvent) {
        giveUpButton.attachEvent("onClick",
            function () {
                game.giveUp();
            });
    }
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


function notificationFunction(game) {
    if (notificationButton.addEventListener) {
        notificationButton.addEventListener("click",
            function () {
                var msg = document.getElementById('message').innerHTML;
                notificationHelperFunction(game, msg);
            }, false);
    } else if (notificationButton.attachEvent) {
        notificationButton.attachEvent("onClick",
            function () {
                var msg = document.getElementById('message').innerHTML;
                notificationHelperFunction(game, msg);
            }, false);
    }
    var element = document.getElementById('notificationpopup');
    element.style.transition = '0.5s';
    element.style.left = '105%';
    setTimeout(() => {
        element.style.transition = '0s';
    }, 500);
}

function notificationHelperFunction(game, msg) {
    if (msg.includes("No moves available")) {
        game.skipTurn();
    } else if (msg.includes("Two consecutive turns skipped") || msg.includes("30 rounds without hits")) {
        game.calculatePoints();
    } else if (msg.includes("surrenders!") || msg.includes("wins the round") || msg.includes("draw")) {
        if (game.checkIfGameEnds()) {
            game.winningMessage();
        } else {
            game.startNewRound();
        }
    } else if (msg.includes("Wins! final score")) {
        game.startNewRound();
    }
}

export { addNewGameButtonFunctions, addButtonFunctions };
