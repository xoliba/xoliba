
import { Game } from './Game';

var undoButton = document.getElementById("undo");
var surrenderButton = document.getElementById("Surrender");
var continueButton = document.getElementById("StartRound");
var giveUpButton = document.getElementById("GiveUp");
var notificationButton = document.getElementById('closeNotification');
var surrenderBind;
var undoBind;
var continueBind;
var giveUpBind;

function addButtonFunctions(game) {     //These functions use the game created in addNewGameButtonFunctions
    surrenderBind = surrenderFunction.bind(game);
    undoBind = undo.bind(game);
    continueBind = continueFunction.bind(game);
    giveUpBind = giveUp.bind(game);
    undoButtonFunction(game);
    surrenderButtonFunction(game);
    continueButtonFunction(game);
    giveUpButtonFunction(game);
    notificationButtonFunction(game);
}

function undo() {
    this.undo();
}

function continueFunction() {
    hideStartRoundOptionsAndShowInGameOptions();
    this.playerSurrender(false);
}

function surrenderFunction() {
    this.playerSurrender(true);
}


function giveUp() {
    this.giveUp();
}

function resetButtons(game) {
    if (surrenderButton.removeEventListener) {
        surrenderButton.removeEventListener("click", surrenderBind, false);
        undoButton.removeEventListener("click", undoBind);
        continueButton.removeEventListener("click", continueBind);
        giveUpButton.removeEventListener("click", giveUpBind);
    } else {
        if (surrenderButton.detachEvent) {
            surrenderButton.detachEvent('onClick', surrenderBind);
            undoButton.detachEvent("onclick", undoBind);
            surrenderButton.detachEvent("onclick", surrenderBind);
            continueButton.detachEvent("onclick", continueBind);
            giveUpButton.detachEvent("onclick", giveUpBind);
        }
    }

}

function undoButtonFunction(game) {
    if (undoButton.addEventListener) {
        undoButton.addEventListener("click", undoBind, false);
    } else if (undoButton.attachEvent) {
        undoButton.attachEvent("onclick", undoBind, false);
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
        surrenderButton.addEventListener("click", surrenderBind, false);
    } else if (surrenderButton.attachEvent) {
        surrenderButton.attachEvent("onClick", surrenderBind);
    }
}

function continueButtonFunction(game) {
    if (continueButton.addEventListener) {
        continueButton.addEventListener("click", continueBind, false);
    } else if (continueButton.attachEvent) {
        continueButton.attachEvent("onClick", continueBind);
    }
}

function giveUpButtonFunction(game) {
    if (giveUpButton.addEventListener) {
        giveUpButton.addEventListener("click", giveUpBind, false);
    } else if (giveUpButton.attachEvent) {
        giveUpButton.attachEvent("onClick", giveUpBind);
    }
}

function showStartRoundOptions() {
    undoButton.style.display = "none";
    surrenderButton.style.display = "block";
    continueButton.style.display = "block";
}

function hideStartRoundOptionsAndShowInGameOptions(){
    surrenderButton.style.display = "none";
    continueButton.style.display = "none";
    undoButton.style.display = "block";
    giveUpButton.style.display = "block";
}


function notificationButtonFunction(game) {
    var element = document.getElementById('notificationpopup');
    element.style.transition = '0.5s';
    element.style.left = '105%';
    setTimeout(() => {
        element.style.transition = '0s';
    }, 500);
}
export { addButtonFunctions, showStartRoundOptions, resetButtons };
