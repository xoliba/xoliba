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
let bluePoints;
let redPoints;
let firstTurn;
let aiDifficulty;

//todo after one game completely new one is about to begin, not just another round
class Game {

    constructor(app, playerColor, scoreLimit, aiDifficulty) {
        console.log("playerColor " + playerColor + ", scoreLimit " +  scoreLimit);
        this.socket = new AiSocket(this);
        this.playerColor = playerColor;
        this.aiColor = this.playerColor * -1;
        this.scoreLimit = scoreLimit;
        this.turnHandler = new TurnHandler(false, this);
        this.board = new Board(app, this.turnHandler);
        this.turnHandler.board = this.board;
        this.turn = 0;
        this.turnCounter = 0;
        this.roundskipped = 0;
        this.validate = new Validations();
        this.whoSkipped = 0;
        this.playerHasAnsweredStartRound = false;
        this.aiHasAnsweredStartRound = false;
        this.playerWantsToSurrender = false;
        this.redPoints = 0;
        this.bluePoints = 0;
        this.uiUpdater = new UIUpdater();
        this.firstTurn = true;
        if (aiDifficulty === undefined)
            this.aiDifficulty = 2;
        else
            this.aiDifficulty = aiDifficulty;
        console.log("ai difficulty " + aiDifficulty);
        this.socket.sendStartRound(this.board.gameboardTo2dArray(), this.aiColor, this.aiDifficulty);
    }

    printStartMessage() {
        this.uiUpdater.startMessage(this.aiDifficulty);
    }

    startFirstTurn() {
        this.firstTurn = false;
        this.playerHasAnsweredStartRound = false;
        this.aiHasAnsweredStartRound = false;
        this.turn = this.board.startingTurn();
        if (this.turn === this.aiColor) {
            this.socket.sendTable(this.board.gameboardTo2dArray(), this.aiColor);
        }
        this.uiUpdater.turnIndicator(this.turn);
    }

    playerAndAiHaveAnswered(player, ai) {
        return player && ai;
    }

    playerSurrender(surrender) {
        if (surrender) {
            this.calculateSurrenderPoints(this.playerColor);
        } else if (this.playerAndAiHaveAnswered(this.playerHasAnsweredStartRound = true, this.aiHasAnsweredStartRound)) {
            this.startFirstTurn();
        }
    }

    aiSurrender(surrender) {
        if (surrender) {
            this.calculateSurrenderPoints(this.aiColor);
        } else if (this.playerAndAiHaveAnswered(this.playerHasAnsweredStartRound, this.aiHasAnsweredStartRound = true)) {
            this.startFirstTurn();
        }
    }

    giveUp() {
        this.playerWantsToSurrender = true;
        this.socket.sendTable(this.board.gameboardTo2dArray, this.aiColor, true);
    }

    changeTurn() {
        this.turn *= -1;
        if(!this.checkIfRoundEnds()) {
            this.uiUpdater.turnIndicator(this.turn);
            return false;
        };   
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
            return true;
        }
        if (!availableMoves && this.roundskipped === 0) {
            this.roundskipped++;
            this.whoSkipped = this.turn;
            this.uiUpdater.noMovesAvailable(this.turn);
            return false;
        } else if (!availableMoves && this.roundskipped === 1) {
            this.uiUpdater.twoConsecutiveRoundsSkipped();
            this.whoSkipped = 0;
        } else if(availableMoves && this.turn === this.whoSkipped) {
            this.roundskipped = 0;
        }
        return true;
    }

    skipTurn() {
        this.turn *= -1;
        this.uiUpdater.turnIndicator(this.turn);
        if (this.turn === this.aiColor) {
            this.socket.sendTable(this.board.gameboardTo2dArray(), this.aiColor);
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
        let end = false;
        let draw = false;
        for (var i = 0; i < 7; i++) {
            for (var j = 0; j < 7; j++) {
                if (!((i === 0 || i === 6) && (j === 0 || j === 6))) {
                    if (this.board.gameboardTo2dArray()[i][j] === 1) {
                        reds++;
                        let found = this.validate.trianglesFound(i, j, this.board.gameboardTo2dArray(), true);
                        if (found > redsBiggest) {
                            redsBiggest = found;
                        }
                    } else if (this.board.gameboardTo2dArray()[i][j] === -1) {
                        blues++;
                        let found = this.validate.trianglesFound(i, j, this.board.gameboardTo2dArray(), true);
                        if (found > bluesBiggest) {
                            bluesBiggest = found;
                        }
                    }
                }
            }
        }
        if (redsBiggest === bluesBiggest) {
            draw = true;
            this.uiUpdater.updatePoints(draw, 0, 0);
        } else if (redsBiggest > bluesBiggest) {
            let points = (17 - blues) * redsBiggest;
            this.redPoints += points;
            this.uiUpdater.updatePoints(draw, 1, points);
        } else {
            let points = (17 - reds) * bluesBiggest;
            this.bluePoints += points;
            this.uiUpdater.updatePoints(draw, -1, points);
        }
    }


    calculateSurrenderPoints(color) {
        var score = 0.4 * this.scoreLimit;
        this.uiUpdater.updateSurrenderPoints(color, score);
        if (color === 1) {
            this.bluePoints += score;
        } else {
            this.redPoints += score;
        }
    }

    winningMessage() {
        if (this.redPoints >= this.scoreLimit) {
            this.uiUpdater.winningMessage(1, this.redPoints);
            this.redPoints = 0;
            this.bluePoints = 0;
        } else {
            this.uiUpdater.winningMessage(-1, this.bluePoints);
            this.redPoints = 0;
            this.bluePoints = 0;
        }
    }

    checkIfGameEnds() {
        if (this.bluePoints >= this.scoreLimit || this.redPoints >= this.scoreLimit) {
            return true;
        }
        return false;
    }

    pressStartRound() {
        this.uiUpdater.pressStartRound();
    }

    startNewRound(){
        this.turnCounter = 0;
        this.roundskipped = 0;
        this.board.generateStartingBoard();
        this.turn = 0;
        this.firstTurn = true;
        this.playerHasAnsweredStartRound = false;
        this.aiHasAnsweredStartRound = false;
        this.socket.sendStartRound(this.board.gameboardTo2dArray(), this.aiColor, this.aiDifficulty);
        this.playerWantsToSurrender = false;
        this.uiUpdater.showStartRoundAndSurrenderButtons();
        this.uiUpdater.newRoundToConsole();
    }

    undo() {
        this.turnHandler.undo();
    }

}


export { Game };
