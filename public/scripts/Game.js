import { Board } from './Board.js';
import { AiSocket } from './Websocket.js';
import { TurnHandler } from './TurnHandler';
import { Validations } from './logic/Validations.js';
import { UIUpdater } from './UIUpdater.js';

let board;
let turn;
let redPoints;
let bluePoints;
let socket;
let turnCounter
let roundskipped;
let validate;
let playerColor;
let scoreLimit;
let whoSkipped;
let aiColor;
let playerHasAnsweredStartRound;
let aiHasAnsweredStartRound;
let isFirstTurn;
let playerWantsToSurrender;
let uiUpdater;
let redsBiggest;
let bluesBiggest;
let blues;
let reds;

class Game {

    constructor(app, playerColor, scoreLimit) {
        console.log(playerColor, scoreLimit);
        this.socket = new AiSocket(this);
        this.playerColor = playerColor;
        this.aiColor = this.playerColor * -1;
        this.scoreLimit = scoreLimit;
        this.turnHandler = new TurnHandler(false, this);
        this.board = new Board(app, this.turnHandler);
        this.redPoints = 0;
        this.bluePoints = 0;
        this.turnHandler.board = this.board;
        this.turn = 0
        this.turnCounter = 0;
        this.roundskipped = 0;
        this.bluesBiggest = 0;
        this.redsBiggest = 0;
        this.blues = 0;
        this.reds = 0;
        this.validate = new Validations();
        this.whoSkipped = 0;
        this.playerHasAnsweredStartRound = false;
        this.aiHasAnsweredStartRound = false;
        this.isFirstTurn = true;
        this.playerWantsToSurrender = false;
        this.uiUpdater = new UIUpdater();
        this.socket.sendStartRound(this.board.gameboardTo2dArray(), this.aiColor);
    }

    startFirstTurn() {
        this.isFirstTurn = false;
        this.playerHasAnsweredStartRound = false;
        this.aiHasAnsweredStartRound = false;
        this.turn = this.board.startingTurn();
        if (this.turn === this.aiColor) {
            this.socket.sendTable(this.board.gameboardTo2dArray(), this.aiColor);
        }
        this.uiUpdater.turnIndicator(this.turn);
    }

    playerSurrender(surrender) {
        if(!this.isFirstTurn) {
            return false;
        }
        if (surrender) {
            this.updateSurrenderPoints(this.playerColor);
        } else {
            if (this.aiHasAnsweredStartRound === true) {
                this.playerHasAnsweredStartRound = true;
                this.startFirstTurn();
            } else {
                this.playerHasAnsweredStartRound = true;
            }
        }


    }

    aiSurrender(surrender) {
        if (surrender) {
            this.updateSurrenderPoints(this.aiColor);
        } else {
            if (this.playerHasAnsweredStartRound === true) {
                this.aiHasAnsweredStartRound = true;
                this.startFirstTurn();
            } else {
                this.aiHasAnsweredStartRound = true;
            }
        }
    }

    giveUp() {
        this.playerWantsToSurrender = true;
        this.socket.sendTable(this.board.gameboardTo2dArray, this.aiColor, true);
    }


    changeTurn() {
        this.turn *= -1;
        this.checkIfRoundEnds();
        this.uiUpdater.turnIndicator(this.turn);
        //if it is AIs turn now
        if (this.turn === this.aiColor) {
            this.socket.sendTable(this.board.gameboardTo2dArray(), this.aiColor);
        }
    }

    aiTurn(didMove, start, target, corners, surrender) {
        if (surrender && this.playerWantsToSurrender) {
            this.calculatePoints();
            this.updatePoints();
        } else {
        this.turnHandler.aiTurn(didMove, start, target, corners);
        }
    }

    checkIfRoundEnds() {

        let availableMoves = this.validate.isMovesAvailable(this.turn, this.board.gameboardTo2dArray()); //check if the next player has any moves left
        if (this.turnCounter === 10) {
            alert("10 rounds without hits, round ended!");
            this.calculatePoints();
            this.updatePoints();
            return;
        }
        if(!availableMoves && this.roundskipped === 0){
            this.roundskipped++;
            this.whoSkipped = this.turn;
            alert("No moves available, skipping turn of " + (this.turn === 1 ? "red" : "blue") + "!");
            this.turn *= -1;
        } else if(!availableMoves && this.roundskipped === 1) {
            alert("Two consecutive turns skipped, round ended!");
            this.whoSkipped = 0;
            this.calculatePoints();
            this.updatePoints();
        } else if(availableMoves && this.turn === this.whoSkipped) {
            this.roundskipped = 0;
        }
    }

    updateTurnCounter(areStonesHit) {
        if (areStonesHit === true) {
            console.log("turncounter: " + this.turnCounter);
            this.turnCounter = 0;
        } else {
            console.log("turncounter: " + this.turnCounter);
            this.turnCounter++;
        }
        console.log(this.turnCounter);
    }

    calculatePoints() {
        this.bluesBiggest = 0;
        this.redsBiggest = 0;
        this.blues = 0;
        this.reds = 0;
        for (var i = 0; i < 7; i++) {
            for (var j = 0; j < 7; j++) {
                if(!((i === 0 || i === 6) && (j === 0 || j === 6))) {
                    if(this.board.gameboardTo2dArray()[i][j] === 1) {
                        this.reds++;
                        let found = this.validate.trianglesFound(i, j, this.board.gameboardTo2dArray(), true);
                        if(found > this.redsBiggest) {
                            this.redsBiggest = found;
                        }
                    } else if (this.board.gameboardTo2dArray()[i][j] === -1){
                        this.blues++;
                        let found = this.validate.trianglesFound(i, j, this.board.gameboardTo2dArray(), true);
                        if(found > this.bluesBiggest) {
                            this.bluesBiggest = found;
                        }
                    }
                }
            }
        }
    }

    updatePoints() {
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
        this.startNewRound();
    }

    updateSurrenderPoints(color) {
        if (color === 1) {
            let element = document.getElementById("bluepoints");
            let points = 0.4 * this.scoreLimit;
            let current = parseInt(element.innerHTML, 10);
            current += points;
            element.innerHTML = current;
            alert("Red surrenders!  " + points + " points awarded to Blue!");
            if (current > this.scoreLimit){
                element.innerHTML += " WINNER";
                alert("Blue Wins! final score: " + current + " - " + document.getElementById("redpoints").innerHTML);
                element.innerHTML = 0;
                document.getElementById("redpoints").innerHTML = 0;
            }
        } else {
            let element = document.getElementById("redpoints");
            let points = 0.4 * this.scoreLimit;
            let current = parseInt(element.innerHTML, 10);
            current += points;
            element.innerHTML = current;
            alert("Blue surrenders! " + points + " points awarded to Red!");
        if (current >= this.scoreLimit){
            element.innerHTML += " WINNER";
            alert("Red Wins! final score: " + current + " - " + document.getElementById("bluepoints").innerHTML);
            element.innerHTML = 0;
            document.getElementById("bluepoints").innerHTML = 0;
            }

        }
        this.startNewRound();
    }

    startNewRound(){
        this.turnCounter = 0;
        this.roundskipped = 0;
        this.board.generateStartingBoard();
        this.turn = 0;
        this.playerHasAnsweredStartRound = false;
        this.aiHasAnsweredStartRound = false;
        this.socket.sendStartRound(this.board.gameboardTo2dArray(), this.aiColor);
        this.isFirstTurn = true;
        this.playerWantsToSurrender = false;
        this.uiUpdater.showStartRoundAndSurrenderButtons();
        this.uiUpdater.newRoundToConsole();
    }

    undo() {
        this.turnHandler.undo();
    }

}


export { Game };
