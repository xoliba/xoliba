import { Game } from './Game.js';
import { InfoConsole } from './InfoConsole.js';

let infoConsole;

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

    showStartRoundAndSurrenderButtons() {
        document.getElementById("undo").style.display = "none";
        document.getElementById("GiveUp").style.display = "none";
        document.getElementById("StartRound").style.display = "block";
        document.getElementById("Surrender").style.display = "block";
    }


    updatePoints(draw, color, score, end) {
        if (draw) {
            this.showNotification("It's a draw, no points given");
        } else if (color === 1) {
            this.showNotification("Red wins the round! " + score + " points awarded!");
            let element = document.getElementById("redpoints");
            let current = parseInt(element.innerHTML, 10);
            current += score;
            element.innerHTML = current;
            if (end) {
                element.innerHTML += " WINNER";
                this.showNotification("Red Wins! final score: " + current + " - " + document.getElementById("bluepoints").innerHTML);
                element.innerHTML = 0;
                document.getElementById("bluepoints").innerHTML = 0;
            }

        } else {
            this.showNotification("Blue wins the round! " + score + " points awarded!");
            let element = document.getElementById("bluepoints");
            let current = parseInt(element.innerHTML, 10);
            current += score;
            element.innerHTML = current;
            if (end) {
                element.innerHTML += " WINNER";
                this.showNotification("Blue Wins! final score: " + current + " - " + document.getElementById("redpoints").innerHTML);
                element.innerHTML = 0;
                document.getElementById("redpoints").innerHTML = 0;
            }
        }
    }

    updateSurrenderPoints(color, score, end) {
        if (color === 1) {
            let element = document.getElementById("bluepoints");
            let current = parseInt(element.innerHTML, 10);
            current += score;
            element.innerHTML = current;
            this.showNotification("Red surrenders!  " + score + " points awarded to Blue!");
            if (end){
                element.innerHTML += " WINNER";
                this.showNotification("Blue Wins! final score: " + current + " - " + document.getElementById("redpoints").innerHTML);
                element.innerHTML = 0;
                document.getElementById("redpoints").innerHTML = 0;
            }
        } else {
            let element = document.getElementById("redpoints");
            let current = parseInt(element.innerHTML, 10);
            current += score;
            element.innerHTML = current;
            this.showNotification("Blue surrenders! " + score + " points awarded to Red!");
            if (end){
                element.innerHTML += " WINNER";
                this.showNotification("Red Wins! final score: " + current + " - " + document.getElementById("bluepoints").innerHTML);
                element.innerHTML = 0;
                document.getElementById("bluepoints").innerHTML = 0;
                }

        }
    }

    tooManyRoundsWithoutHits() {
        this.showNotification("30 rounds without hits, round ended!");
    }

    noMovesAvailable(turn) {
        this.showNotification("No moves available, skipping turn of " + (turn === 1 ? "red" : "blue") + "!");
    }

    twoConsecutiveRoundsSkipped() {
        this.showNotification("Two consecutive turns skipped, round ended!");
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

    showNotification(message){
        document.getElementById('message').innerHTML = message;
        var element = document.getElementById('notificationpopup');
        element.style.transition = '0.5s';
        element.style.left = '75%';
        setTimeout(() => {
            element.style.transition = '0s';
        }, 500);
    }
}

export { UIUpdater };