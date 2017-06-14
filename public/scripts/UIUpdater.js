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

    updatePoints(redsBiggest, bluesBiggest, reds, blues) {
        if (this.redsBiggest === this.bluesBiggest) {
            alert("It's a draw, no points given");
        } else if (this.redsBiggest > this.bluesBiggest) {
            let element = document.getElementById("redpoints");
            let points = (17 - this.blues) * this.redsBiggest;
            let current = parseInt(element.innerHTML, 10);
            current += points;
            element.innerHTML = current;
            alert("Red wins the round! " + points + " points awarded!");
            if (current >= this.scoreLimit){
                element.innerHTML += " WINNER";
                alert("Red Wins! final score: " + current + " - " + document.getElementById("bluepoints").innerHTML);
                element.innerHTML = 0;
                document.getElementById("bluepoints").innerHTML = 0;
            }
        } else {
            let element = document.getElementById("bluepoints");
            let points = (17 - this.reds) * this.bluesBiggest;
            let current = parseInt(element.innerHTML, 10);
            current += points;
            element.innerHTML = current;
            alert("Blue Wins! " + points + " points awarded!");
            if (current > this.scoreLimit){
                element.innerHTML += " WINNER";
                alert("Blue Wins! final score: " + current + " - " + document.getElementById("redpoints").innerHTML);
                element.innerHTML = 0;
                document.getElementById("redpoints").innerHTML = 0;
            }
        }
    }

    updateSurrenderPoints(color, scoreLimit) {
        if (color === 1) {
            let element = document.getElementById("bluepoints");
            let points = 0.4 * scoreLimit;
            let current = parseInt(element.innerHTML, 10);
            current += points;
            element.innerHTML = current;
            alert("Red surrenders!  " + points + " points awarded to Blue!");
            if (current > scoreLimit){
                element.innerHTML += " WINNER";
                alert("Blue Wins! final score: " + current + " - " + document.getElementById("redpoints").innerHTML);
                element.innerHTML = 0;
                document.getElementById("redpoints").innerHTML = 0;
            }
        } else {
            let element = document.getElementById("redpoints");
            let points = 0.4 * scoreLimit;
            let current = parseInt(element.innerHTML, 10);
            current += points;
            element.innerHTML = current;
            alert("Blue surrenders! " + points + " points awarded to Red!");
        if (current >= scoreLimit){
            element.innerHTML += " WINNER";
            alert("Red Wins! final score: " + current + " - " + document.getElementById("bluepoints").innerHTML);
            element.innerHTML = 0;
            document.getElementById("bluepoints").innerHTML = 0;
            }

        }
    }


}

export { UIUpdater };