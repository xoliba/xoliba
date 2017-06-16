import { Game } from './Game.js';
import { InfoConsole } from './InfoConsole.js';

let infoConsole;
let aiThinkingInterval;

class UIUpdater {

    constructor() {
        this.infoConsole = new InfoConsole();
    }


    turnIndicator(turn) {
        if (turn === 1) this.infoConsole.printLine("Its reds turn!");
        else if (turn === -1) this.infoConsole.printLine("Its blues turn!");
    }

    newRoundToConsole() {
        this.infoConsole.newRoundToConsole();
    }

    startMessage(aiDifficulty) {
        this.infoConsole.startMessage(aiDifficulty);
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
        this.infoConsole.printMove(start, target, corner2, corner3, ateEnemies, ateOwns);
    }


    noMovesAvailable(turn) {
        this.showNotification("No moves available, skipping turn of " + (turn === 1 ? "red" : "blue") + "!");
    }

    twoConsecutiveRoundsSkipped() {
        this.showNotification("Two consecutive turns skipped, round ended!");
    }

    pressStartRound() {
        this.showNotification("Press Start round!")
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
