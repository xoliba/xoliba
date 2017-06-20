import { Game } from '../Game.js';
import { InfoConsole } from './InfoConsole.js';

let infoConsole;
let aiThinkingInterval;
let dcError = false;
let notificationButton;
let game;

class UIUpdater {

    constructor(game) {
        this.game = game;
        this.infoConsole = new InfoConsole();
        this.notificationButton = document.getElementById('closeNotification');
    }


    turnIndicator(turn) {
        if (turn === 1) this.infoConsole.printLine("Its reds turn!");
        else if (turn === -1) this.infoConsole.printLine("Its blues turn!");
    }

    newRoundToConsole() {
        this.infoConsole.printLine("\nNew Round! Do you want to surrender or start the round?\n");
    }

    startMessage() {
        this.infoConsole.printLine("\nWelcome to Xoliba! Do you want to surrender or start the round?\n");
    }

    disconnectionError(errorMessage) {
        if (dcError === false) {
            this.infoConsole.printLine("\nDisconnected from AI. Either your network " +
            "went down or we did something horrifying. If you think this was our " +
            "fault, please report the error using feedback: you can find the feedback " +
            "link from the menu. Thank you!\n");
            dcError = true;
        }
        this.infoConsole.printLine("Error message: " + errorMessage);
    }

    showStartRoundAndSurrenderButtons() {
        document.getElementById("undo").style.display = "none";
        document.getElementById("GiveUp").style.display = "none";
        document.getElementById("StartRound").style.display = "block";
        document.getElementById("Surrender").style.display = "block";
    }


    updatePoints(draw, color, score) {
        if (draw) {
            this.showNotification("It's a draw, no points given");
        } else if (color === 1) {
            this.showNotification("Red wins the round! " + score + " points awarded!");
            let element = document.getElementById("redpoints");
            let current = parseInt(element.innerHTML, 10);
            current += score;
            element.innerHTML = current;
        } else {
            this.showNotification("Blue wins the round! " + score + " points awarded!");
            let element = document.getElementById("bluepoints");
            let current = parseInt(element.innerHTML, 10);
            current += score;
            element.innerHTML = current;
        }
    }

    updateSurrenderPoints(color, score) {
        if (color === 1) {
            let element = document.getElementById("bluepoints");
            let current = parseInt(element.innerHTML, 10);
            current += score;
            element.innerHTML = current;
            this.showNotification("Red surrenders!  " + score + " points awarded to Blue!");
        } else {
            let element = document.getElementById("redpoints");
            let current = parseInt(element.innerHTML, 10);
            current += score;
            element.innerHTML = current;
            this.showNotification("Blue surrenders! " + score + " points awarded to Red!");
            this.setNewFunctionToNotification(this.game.startNewRound());
        }
    }

    winningMessage(color, score) {
        if (color === -1) {
            let element = document.getElementById("bluepoints");
            this.showNotification("Blue Wins! final score: " + score + " - " + document.getElementById("redpoints").innerHTML);
            element.innerHTML = 0;
            document.getElementById("redpoints").innerHTML = 0
        } else {
            let element = document.getElementById("redpoints");
            this.showNotification("Red Wins! final score: " + score + " - " + document.getElementById("bluepoints").innerHTML);
            element.innerHTML = 0;
            document.getElementById("bluepoints").innerHTML = 0;
        }
    }

    tooManyRoundsWithoutHits() {
        this.showNotification("30 rounds without hits, round ended!");
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
        return String.fromCharCode(65 + coordinates[0]) + coordinates[1];
    }

    noMovesAvailable(turn) {
        this.showNotification("No moves available, skipping turn of " + (turn === 1 ? "red" : "blue") + "!");
        this.infoConsole.printLine(" no moves, turn skipped\n");
    }

    twoConsecutiveRoundsSkipped() {
        this.showNotification("Two consecutive turns skipped, round ended!");
    }

    notEnoughStonesLeft() {
        this.showNotification("Two or less stones left, round ended!");
    }

    pressStartRound() {
        this.showNotification("Press Start round!");
    }

    setNewFunctionToNotification(newFunction) {
        this.notificationButton.detachEvent('onClick', notificationFunction());
        this.noticicationButton.removeEventListener('click', notificationFunction());
        if (notificationButton.addEventListener) {
            notificationButton.addEventListener("click", newFunction, false);
        } else if (notificationButton.attachEvent) {
            notificationButton.attachEvent("onClick", newFunction, false);
        }
    }

    showNotification(message){
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
}

export { UIUpdater };
