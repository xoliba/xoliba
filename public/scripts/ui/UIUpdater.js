import { Game } from '../Game.js';
import { InfoConsole } from './InfoConsole.js';
import { resetButtons } from '../ButtonFunctions.js';

let infoConsole;
let aiThinkingInterval;
let dcError = false;
let notificationButton;
let game;
let notificationFunction;
let aiTurn;

class UIUpdater {

    constructor(game) {
        this.game = game;
        this.infoConsole = new InfoConsole();
        this.notificationButton = document.getElementById('closeNotification');
        this.hasEventListener = false;
        this.notificationFunction = function() {};
    }


    turnIndicator(turn) {
        var red = document.getElementById('redturn');
        var blue = document.getElementById('blueturn');
        if (turn === 1) {
            red.style.display = 'block';
            blue.style.display = 'none';
            this.infoConsole.printLine("Its red's turn!");
        } else if (turn === -1) {
            blue.style.display = 'block';
            red.style.display = 'none';
            this.infoConsole.printLine("Its blue's turn!");
        }

        if(turn === this.aiTurn){
            document.getElementById('undo').disabled = true;
            document.getElementById('undoimg').src = '/images/disabledUndoImage.png';
            document.getElementById('GiveUp').disabled = true;
        } else {
            document.getElementById('undo').disabled = false;
            document.getElementById('undoimg').src = '/images/undoImage.png';
            document.getElementById('GiveUp').disabled = false;
        }
    }

    newRoundToConsole() {
        this.infoConsole.printLine("\nNew Round! Do you want to surrender or start the round?\n");
    }

    startMessage() {
        this.infoConsole.printLine("\nWelcome to Xoliba! Do you want to surrender or start the round?\n");
    }

    disconnectionError() {
        if (dcError === false) {
            this.infoConsole.printLine("\nDisconnected from AI. Check your network connection.\n");
            dcError = true;
        }
    }

    reconnectTry() {
        this.infoConsole.printLine("Trying to reconnect...");
    }

    connectedToAi() {
        this.infoConsole.printLine("Connected to AI!");
        dcError = false;
    }

    showUndoAndResignButtons() {
        document.getElementById("undo").style.display = "block";
        document.getElementById("GiveUp").style.display = "block";
        document.getElementById("NewGame").style.display = "none";
        document.getElementById("StartRound").style.display = "none";
        document.getElementById("Surrender").style.display = "none";
    }

    showStartRoundAndSurrenderButtons() {
        document.getElementById("undo").style.display = "none";
        document.getElementById("GiveUp").style.display = "none";
        document.getElementById("NewGame").style.display = "none";
        document.getElementById("StartRound").style.display = "block";
        document.getElementById("Surrender").style.display = "block";
        document.getElementById("StartRound").disabled = false;
        document.getElementById("Surrender").disabled = false;
    }

    showNewGameButton() {
        document.getElementById("undo").style.display = "none";
        document.getElementById("GiveUp").style.display = "none";
        document.getElementById("StartRound").style.display = "none";
        document.getElementById("Surrender").style.display = "none";
        document.getElementById("NewGame").style.display = "block"
    }


    updatePoints(draw, color, score, end) {
        document.getElementById('redturn').style.display = 'none';
        document.getElementById('blueturn').style.display = 'none';
        if (draw) {
            this.showNotification("It's a draw, no points given");
            this.setNewFunctionToNotification(() => {
                this.game.startNewRound();
                this.enableButtons();
            });
            return;
        } else if (color === 1) {
            this.showNotification("Red wins the round! Red earns " + score + " points!");
            let element = document.getElementById("redpoints");
            let current = parseInt(element.innerHTML, 10);
            current += score;
            element.innerHTML = current;
        } else {
            this.showNotification("Blue wins the round! Blue earns " + score + " points!");
            let element = document.getElementById("bluepoints");
            let current = parseInt(element.innerHTML, 10);
            current += score;
            element.innerHTML = current;
        }
        if (end) {
            this.setNewFunctionToNotification(() => {
                this.game.winningMessage();
                this.enableButtons();
            });
        } else {
            this.setNewFunctionToNotification(() => {
                this.game.startNewRound();
                this.enableButtons();
            });
        }
    }

    updateSurrenderPoints(color, score, end) {
        document.getElementById('redturn').style.display = 'none';
        document.getElementById('blueturn').style.display = 'none';
        if (color === 1) {
            let element = document.getElementById("bluepoints");
            let current = parseInt(element.innerHTML, 10);
            current += score;
            element.innerHTML = current;
            this.showNotification("Red surrenders!  Blue earns " + score + " points!");
        } else {
            let element = document.getElementById("redpoints");
            let current = parseInt(element.innerHTML, 10);
            current += score;
            element.innerHTML = current;
            this.showNotification("Blue surrenders! Red earns " + score + " points!");
        }
        if (end) {
            this.setNewFunctionToNotification(() => {
                this.game.winningMessage();
                this.enableButtons();
            });
        } else {
            this.setNewFunctionToNotification(() => {
                this.game.startNewRound();
                this.enableButtons();
            });
        }
    }

    winningMessage(color, score) {
        document.getElementById('redAIthinking').style.visibility = 'hidden';
        document.getElementById('blueAIthinking').style.visibility = 'hidden';
        if (color === -1) {
            let element = document.getElementById("bluepoints");
            this.showNotification("Blue Wins! final score: " + score + " - " + document.getElementById("redpoints").innerHTML);
        } else {
            let element = document.getElementById("redpoints");
            this.showNotification("Red Wins! final score: " + score + " - " + document.getElementById("bluepoints").innerHTML);
        }
        resetButtons();
        this.setNewFunctionToNotification(() => {
            this.showNewGameButton();
            this.enableButtons();
        });
        
    }

    tooManyRoundsWithoutHits() {
        this.showNotification("30 rounds without hits, round ended!");
        this.setNewFunctionToNotification(() => {
            this.game.calculatePoints();
            this.enableButtons();
        });
    }

    startAiIsThinkingInterval() {
        console.log("start 'ai is thinking' interval");
        let howLong = 0;
        this.aiThinkingInterval = setInterval(() => {
            this.infoConsole.printAiIsThinking(howLong === 0, howLong);
            howLong += 1;
        }, 1000);
    }

    stopAiIsThinkingInterval() {
        console.log("stop 'ai is thinking' interval");
        clearInterval(this.aiThinkingInterval);
    }

    printMove(start, target, corner2, corner3, ateEnemies, ateOwns) {
        let eatedStonesString = '';
        if (ateEnemies.length > 0 || ateOwns.length > 0) {
            eatedStonesString += " (";
            for (let i=0; i<ateEnemies.length; i++) {
                eatedStonesString += this.turnIntoCoordinates(ateEnemies[i]);
                if (i<ateEnemies.length-1) eatedStonesString += " ";
            }
            if (ateOwns.length > 0) {
                eatedStonesString += "; ";
                for (let i=0; i<ateOwns.length; i++) {
                    eatedStonesString += this.turnIntoCoordinates(ateOwns[i]);
                    if (i<ateOwns.length-1) eatedStonesString += " ";
                }
            }
            eatedStonesString += ")";
        }
        this.infoConsole.printLine(" " + this.turnIntoCoordinates(start)+ "-" + this.turnIntoCoordinates(target)+ eatedStonesString);
    }

    turnIntoCoordinates(coordinates) {
        return String.fromCharCode(65 + coordinates[0]) + (Math.abs(coordinates[1] - 7));
    }

    noMovesAvailable(turn) {
        this.showNotification("No moves available, skipping turn of " + (turn === 1 ? "red" : "blue") + "!");
        this.setNewFunctionToNotification(() => {
            this.game.changeTurn();
            this.enableButtons();
            this.showUndoAndResignButtons();
        });
        this.infoConsole.printLine(" no moves, turn skipped\n");
    }

    twoConsecutiveRoundsSkipped() {
        this.showNotification("Two consecutive turns skipped, round ended!");
        this.setNewFunctionToNotification(() => {
            this.game.calculatePoints();
            this.enableButtons();
        });
    }

    notEnoughStonesLeft() {
        this.showNotification("Two or less stones left, round ended!");
        this.setNewFunctionToNotification(() => {
            this.game.calculatePoints();
            this.enableButtons();
        });
    }

    pressStartRound() {
        this.showNotification("Press Start round!");
        this.setNewFunctionToNotification(() => {
            this.showStartRoundAndSurrenderButtons();
            this.enableButtons();
        });
    }

    pressNewGame() {
        this.showNotification("Press New Game!");
        this.setNewFunctionToNotification(() => {
            this.enableButtons();
        });
    }

    itIsAIsTurn() {
        this.showNotification("It is AI's turn!");
        this.setNewFunctionToNotification(() => {
            this.enableButtons();
            document.getElementById('GiveUp').disabled = true;
            this.showUndoAndResignButtons();
        });
    }

    declineResignation() {
        this.showNotification("AI doesn't agree to end the round!");
        this.setNewFunctionToNotification(() => {
            this.enableButtons();
            this.showUndoAndResignButtons();

        });
    }

    setNewFunctionToNotification(newFunction) {
        if (this.notificationButton.removeEventListener) {
            this.notificationButton.removeEventListener('click', this.notificationFunction);
        } else {
            if (this.notificationButton.detachEvent) {
                this.notificationButton.detachEvent('onclick', this.notificationFunction);
            }
        }

        this.notificationFunction = newFunction;
        if (this.notificationButton.addEventListener) {
            this.notificationButton.addEventListener("click", this.notificationFunction, false);
        } else if (this.notificationButton.attachEvent) {
            this.notificationButton.attachEvent("onClick", this.notificationFunction, false);
        }
    }

    showNotification(message){
        this.disableButtons();
        document.getElementById('message').innerHTML = message;
        var element = document.getElementById('notificationpopup');
        var ratio = $(window).width() / $(window).height();
        element.style.transition = '0.5s';
        if(ratio > 3/2){
            element.style.left = '75%';
        } else {
            element.style.left = '70%';
        }
        setTimeout(() => {
            element.style.transition = '0s';
        }, 500);
    }

    disableButtons() {
        document.getElementById('undo').disabled = true;
        document.getElementById('GiveUp').disabled = true;
        document.getElementById('StartRound').disabled = true;
        document.getElementById('Surrender').disabled = true;
        document.getElementById('NewGame').disabled = true;
    }

    enableButtons() {
        document.getElementById('undo').disabled = false;
        document.getElementById('GiveUp').disabled = false;
        document.getElementById('StartRound').disabled = false;
        document.getElementById('Surrender').disabled = false;
        document.getElementById('NewGame').disabled = false;
    }

    setAIthinkingMessage(turn){
        var redmsg = document.getElementById('redAIthinking');
        var bluemsg = document.getElementById('blueAIthinking');
        if(turn === 1) {
            bluemsg.style.visibility = 'hidden';
            redmsg.style.visibility = 'visible';
        } else {
            redmsg.style.visibility = 'hidden'
            bluemsg.style.visibility = 'visible';
        }
        this.aiTurn = turn;
    }
}

export { UIUpdater };
