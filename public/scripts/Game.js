import { Board } from './Board.js';
import { AiSocket } from './Websocket.js';
import { TurnHandler } from './TurnHandler';
import { Validations } from './logic/Validations.js';

let board;
let turn;
let redPoints;
let bluePoints;
let socket;
let turnHandler;
let turnCounter
let roundskipped;
let validate;
let playerColor;

class Game {
    constructor(app) {
        this.socket = new AiSocket(this);
     /*   if(result) {
            this.playerColor = 1            //this.socket.sendColor(result); tms.
        } else {
            this.playerColor = -1;
            //this.socket.sendColor(result);
        }*/
        this.turnHandler = new TurnHandler(false, this);
        this.board = new Board(app, this.turnHandler);
        this.redPoints = 0;
        this.bluePoints = 0;
        this.turnHandler.board = this.board;
        this.turn = this.board.startingTurn();
        this.turnCounter = 0;
        this.roundskipped = 0;
        this.validate = new Validations();
        if (this.turn === -1) {
        this.turnIndicator("blue", "BLUES");
    } else {
            this.turn = -1;
            setTimeout(() => { this.changeTurn(); }, 1000);
        }
    }

    changeTurn() {
        this.checkIfRoundEnds();

        if (this.turn === -1) {
            this.socket.sendTable(this.board.gameboardTo2dArray(), this.turn);
        }

        this.turn *= -1;
    }

    aiTurn(didMove, start, target, corners) {
        this.turnHandler.aiTurn(didMove, start, target, corners);
    }

    checkIfRoundEnds() {
        let availableMoves = this.validate.isMovesAvailable(this.turn, this.board.gameboardTo2dArray());
        if (this.turnCounter === 10) {
             alert("30 rounds without hits, round ended!");
             this.updatePoints();
             return;
        }
        if(!availableMoves && this.roundskipped === 0){
            this.roundskipped++;
            var whoSkipped = this.turn;
            alert("No moves available, skipping turn!");
            this.changeTurn();
        } else if(!availableMoves && this.roundskipped === 1) {
            alert("Two consecutive turns skipped, round ended!");
            this.updatePoints();
        } else if(availableMoves && this.turn === whoSkipped) {
            this.roundskipped = 0;
            
        }
    }

    updateTurnCounter(areStonesHit) {
        if (areStonesHit === true) {
            this.turnCounter = 0;
        } else {
            this.turnCounter++;
        }
        console.log(this.turnCounter);
    }

    updatePoints(){
    let bluesBiggest = 0;
    let redsBiggest = 0;
    let blues = 0;
    let reds = 0;
    for (var i = 0; i < 7; i++) {
        for (var j = 0; j < 7; j++) {
            if(!((i === 0 || i === 6) && (j === 0 || j === 6))) {
                if(this.board.gameboardTo2dArray()[i][j] === 1) {
                    reds++;
                    let found = this.validate.trianglesFound(i, j, this.board.gameboardTo2dArray(), true);
                    if(found > redsBiggest) {
                        redsBiggest = found;
                    }
                } else if (this.board.gameboardTo2dArray()[i][j] === -1){
                    blues++;
                    let found = this.validate.trianglesFound(i, j, this.board.gameboardTo2dArray(), true);
                    if(found > bluesBiggest) {
                        bluesBiggest = found;
                    }
                }
            }
        }
    }

    if (redsBiggest === bluesBiggest) {
        alert("It's a draw, no points given");
    } else if (redsBiggest > bluesBiggest) {
        let element = document.getElementById("redpoints");
        let points = (17 - blues) * redsBiggest;
        let current = parseInt(element.innerHTML, 10);
        current += points;
        element.innerHTML = current;
        alert("Red wins the round! " + points + " points awarded!");
        if (current >= 50){
            element.style.fontSize = "x-large";
            element.style.color = "GoldenRod";
            element.innerHTML += " WINNER";
            alert("Red Wins! final score: " + current + " - " + document.getElementById("bluepoints").innerHTML);
            element.style.fontSize = "medium";
            element.style.color = "black";
            element.innerHTML = 0;
            document.getElementById("bluepoints").innerHTML = 0;
        }
    } else {
        let element = document.getElementById("bluepoints");
        let points = (17 - reds) * bluesBiggest;
        let current = parseInt(element.innerHTML, 10);
        current += points;
        element.innerHTML = current;
        alert("Blue Wins! " + points + " points awarded!");
        if (current > 50){
            element.style.fontSize = "x-large";
            element.style.color = "GoldenRod";
            element.innerHTML += " WINNER";
            alert("Blue Wins! final score: " + current + " - " + document.getElementById("redpoints").innerHTML);
            element.style.fontSize = "medium";
            element.style.color = "black";
            element.innerHTML = 0;
            document.getElementById("redpoints").innerHTML = 0;
        }
    }
    this.turnCounter = 0;
    this.roundskipped = 0;
    this.board.generateStartingBoard();
}

turnIndicator(color, turn) {
        /*var turnTeller = document.getElementById("turn");
        turnTeller.style.color = color;
        turnTeller.innerHTML = "It's " + turn + " turn!";*/
    }

}


export { Game };