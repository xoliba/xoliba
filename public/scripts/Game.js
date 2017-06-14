import { Board } from './Board.js';
import { AiSocket } from './Websocket.js';
import { TurnHandler } from './TurnHandler';
import { Validations } from './logic/Validations.js';
import { UIUpdater } from './UIUpdater.js';

let board;
let turn;
let socket;
let turnCounter;
let roundskipped;
let validate;
let playerColor;
let scoreLimit;
let whoSkipped;
let aiColor;
let playerHasAnsweredStartRound;
let aiHasAnsweredStartRound;
let playerWantsToSurrender;
let uiUpdater;


class Game {

    constructor(app, playerColor, scoreLimit) {
        console.log(playerColor, scoreLimit);
        this.socket = new AiSocket(this);
        this.playerColor = playerColor;
        this.aiColor = this.playerColor * -1;
        this.scoreLimit = scoreLimit;
        this.turnHandler = new TurnHandler(false, this);
        this.board = new Board(app, this.turnHandler);
        this.turnHandler.board = this.board;
        this.turn = 0
        this.turnCounter = 0;
        this.roundskipped = 0;
        this.validate = new Validations();
        this.whoSkipped = 0;
        this.playerHasAnsweredStartRound = false;
        this.aiHasAnsweredStartRound = false;
        this.playerWantsToSurrender = false;
        this.uiUpdater = new UIUpdater();
        this.socket.sendStartRound(this.board.gameboardTo2dArray(), this.aiColor);
    }

    startFirstTurn() {
        this.playerHasAnsweredStartRound = false;
        this.aiHasAnsweredStartRound = false;
        this.turn = this.board.startingTurn();
        if (this.turn === this.aiColor) {
            this.socket.sendTable(this.board.gameboardTo2dArray(), this.aiColor);
        }
        this.uiUpdater.turnIndicator(this.turn);
    }

    playerSurrender(surrender) {
        if (surrender) {
            this.uiUpdater.updateSurrenderPoints(this.playerColor, this.scoreLimit);
            this.startNewRound();
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
            this.uiUpdater.updateSurrenderPoints(this.aiColor, this.scoreLimit);
            this.startNewRound();
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
        } else {
        this.turnHandler.aiTurn(didMove, start, target, corners);
        }
    }

    checkIfRoundEnds() {

        let availableMoves = this.validate.isMovesAvailable(this.turn, this.board.gameboardTo2dArray()); //check if the next player has any moves left
        if (this.turnCounter === 30) {
            this.uiUpdater.tooManyRoundsWithoutHits();
            this.calculatePoints();
            return;
        }
        if(!availableMoves && this.roundskipped === 0){
            this.roundskipped++;
            this.whoSkipped = this.turn;
            this.uiUpdater.noMovesAvailable(this.turn);
            this.turn *= -1;
        } else if(!availableMoves && this.roundskipped === 1) {
            this.uiUpdater.twoConsecutiveRoundsSkipped();
            this.whoSkipped = 0;
            this.calculatePoints();
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
        this.uiUpdater.updatePoints(redsBiggest, bluesBiggest, reds, blues, this.scoreLimit);
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
        this.playerWantsToSurrender = false;
        this.uiUpdater.showStartRoundAndSurrenderButtons();
        this.uiUpdater.newRoundToConsole();
    }

    undo() {
        this.turnHandler.undo();
    }

}


export { Game };
