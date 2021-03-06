import { Board } from './logic/Board.js';
import { AiSocket } from './Websocket.js';
import { TurnHandler } from './logic/TurnHandler';
import { Validations } from './logic/Validations.js';
import { UIUpdater } from './ui/UIUpdater.js';

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
let aiDifficulty1;
let aiDifficulty2;
let playerPlays;
let msgId;

//todo after one game completely new one is about to begin, not just another round
//todo this class also handles valdating the messages (old messages are rejected). But we are running out of time and cant implement it in a clever way.
class Game {

    //todo refactor more sense to these constructor parameters
    constructor(app, playerColor, scoreLimit, aiDifficulty, secondAIdifficulty) {
        this.socket = new AiSocket(this);
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
        this.uiUpdater = new UIUpdater(this);
        this.firstTurn = true;
        this.parseAIdifficulty(aiDifficulty, secondAIdifficulty);

        if (secondAIdifficulty != null) { //is this ai vs ai? MUST BE != NOT !==
            return this.AIvsAIconstructor(scoreLimit);
        }

        this.playerPlays = true;
        this.playerColor = playerColor;
        this.aiColor = this.playerColor * -1;
        console.log("playerColor " + playerColor + ", scoreLimit " + scoreLimit);
        this.msgId = Date.now();
        this.socket.sendStartRound(this.board.gameboardTo2dArray(), this.aiColor, this.aiDifficulty1, this.scoreLimit, this.msgId);
        return this;
    }

    AIvsAIconstructor(scoreLimit) {
        this.playerPlays = false;
        console.log("New Game: blue AI (lvl " + this.aiDifficulty1 + ") vs red AI (lvl " + this.aiDifficulty2 + "), with score limit " + scoreLimit);
        this.sendStartRoundToTwoAIs();
        return this;
    }

    sendStartRoundToTwoAIs() {
        let table = this.board.gameboardTo2dArray();
        this.socket.sendStartRound(table, -1, this.aiDifficulty1, this.scoreLimit);
        this.socket.sendStartRound(table, 1, this.aiDifficulty2, this.scoreLimit);
    }

    parseAIdifficulty(aiDifficulty, secondAIdifficulty) {
        if (aiDifficulty === null) {
            this.aiDifficulty1 = 2;
        } else {
            this.aiDifficulty1 = aiDifficulty;
        }
        if (secondAIdifficulty === null) {
            this.aiDifficulty2 = 2;
        } else {
            this.aiDifficulty2 = secondAIdifficulty;
        }
        //console.log("ai difficulty1 " + this.aiDifficulty1 + " ai difficulty2 " + this.aiDifficulty2);
    }

    printStartMessage() {
        this.uiUpdater.startMessage(this.aiDifficulty1);
    }

    startFirstTurn() {
        this.firstTurn = false;
        this.playerHasAnsweredStartRound = false;
        this.aiHasAnsweredStartRound = false;
        this.turn = this.board.startingTurn();
        this.uiUpdater.setAIthinkingMessage(this.aiColor);
        if (this.playerPlays) {
            if (this.turn === this.aiColor) {
                this.sendTurnDataToAI();
            }
            this.uiUpdater.turnIndicator(this.turn);
        } else {
            this.sendTurnDataToAI(false, this.turn);
        }
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

    aiSurrender(surrender, color, msgId) {
        if(msgId !== this.msgId) {
            console.log("got message with wrong ID: " + msgId + " =/= " + this.msgId);
            msgId = Date.now();
            this.socket.sendStartRound(this.board.gameboardTo2dArray(), this.aiColor, this.aiDifficulty, this.scoreLimit, this.msgId);
        }
        msgId = Date.now();
        this.uiUpdater.stopAiIsThinkingInterval();
        if (surrender) {
            this.calculateSurrenderPoints(this.aiColor);
        } else if (!this.playerPlays && this.aiHasAnsweredStartRound === true) { //it's an AI vs AI game
            this.startFirstTurn(); //this is needed, because aiHasAnsweredStartRound is set in the next if clause... code smell from a one liner perhaps?
        } else if (this.playerAndAiHaveAnswered(this.playerHasAnsweredStartRound, this.aiHasAnsweredStartRound = true)) { //it's a player vs ai game
            this.startFirstTurn();
        }
    }

    aiTurn(didMove, start, target, corners, surrender, msgId) {
        if(msgId !== this.msgId) {
            console.log("got message with wrong ID: " + msgId + " =/= " + this.msgId);
            msgId = Date.now();
            this.sendTurnDataToAI(this.playerWantsToSurrender, this.turn);
        }
        msgId = Date.now();
        this.uiUpdater.stopAiIsThinkingInterval();
        if (surrender && this.playerWantsToSurrender) {
            this.calculatePoints();
        } else if (!surrender && this.playerWantsToSurrender) {
            this.uiUpdater.declineResignation();
            this.playerWantsToSurrender = false;
        }
        else {
            this.turnHandler.aiTurn(didMove, start, target, corners);
        }
    }

    resendTurnDataToAI() {
        //We will resend it only if there is something to send.
        if(this.playerColor !== this.turn && this.firstTurn === false) {
            this.sendTurnDataToAI(this.playerWantsToSurrender, this.turn);
        }
    }

    /**
     * changes turn, updates UI, checks if round ends, and sends turn data to AI if necessary
     */
    changeTurn() {
        this.turn *= -1;
        this.uiUpdater.turnIndicator(this.turn); //turn changed, lets update the ui
        let roundEnds = this.checkIfRoundEnds();
        if (!roundEnds && this.turn === this.aiColor) { //player vs ai
            this.sendTurnDataToAI(false, this.turn);
        } else if (!this.playerPlays && !roundEnds) { //ai vs ai
            this.sendTurnDataToAI(false, this.turn);
        }
    }

    /**
     * check if the round ends AND HANDLE OPERATING UI oh plz why
     *
     * @returns {boolean} if the round ended or not
     */
    checkIfRoundEnds() {
        let availableMoves = this.validate.isThereMovesAvailable(this.turn, this.board.gameboardTo2dArray()); //check if the next player has any moves left
        if (!availableMoves && (this.board.reds >= 15 || this.board.blues >= 15)) { //check if either player has less than three stones on board
            this.uiUpdater.notEnoughStonesLeft();
            return true;
        } else if (this.turnCounter === 30) {
            this.uiUpdater.tooManyRoundsWithoutHits();
            return true;
        } else if (!availableMoves && this.roundskipped === 0) {
            this.roundskipped++;
            this.whoSkipped = this.turn;
            this.uiUpdater.noMovesAvailable(this.turn);
            return false;
        } else if (!availableMoves && this.roundskipped === 1) {
            this.uiUpdater.twoConsecutiveRoundsSkipped();
            this.whoSkipped = 0;
            return true;
        } else if(availableMoves && this.turn === this.whoSkipped) {
            this.roundskipped = 0;
        }
        return false;
    }

    giveUp() {
        this.playerWantsToSurrender = true;
        this.sendTurnDataToAI(true);
    }

    sendTurnDataToAI(surrender, color) {
        this.uiUpdater.startAiIsThinkingInterval();
        let c = color;
        if (color == null) { //== intended
            c = this.aiColor;
        }
        let dif = this.aiDifficulty1;
        if (!this.playerPlays && c === 1) {
            dif = this.aiDifficulty2;
        }
        this.msgId = Date.now();
        this.socket.sendTurnData(this.board.gameboardTo2dArray(), c, surrender, dif, this.turnCounter, this.redPoints, this.bluePoints, this.scoreLimit, this.msgId);
    }

    //todo rename 'turn counter' to a more informative option
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
        for (let i = 0; i < 7; i++) {
            for (let j = 0; j < 7; j++) {
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
            end = this.checkIfGameEnds();
            this.uiUpdater.updatePoints(draw, 1, points, end);
        } else {
            let points = (17 - reds) * bluesBiggest;
            this.bluePoints += points;
            end = this.checkIfGameEnds();
            this.uiUpdater.updatePoints(draw, -1, points, end);
        }
    }


    calculateSurrenderPoints(color) {
        let end = false;
        let score = 0.4 * this.scoreLimit;
        if (color === 1) {
            this.bluePoints += score;
        } else {
            this.redPoints += score;
        }
        end = this.checkIfGameEnds();
        this.uiUpdater.updateSurrenderPoints(color, score, end);
    }

    winningMessage() {
        if (this.redPoints >= this.scoreLimit) {
            this.uiUpdater.winningMessage(1, this.redPoints);
        } else {
            this.uiUpdater.winningMessage(-1, this.bluePoints);
        }
    }

    checkIfGameEnds() {
        if (this.bluePoints >= this.scoreLimit || this.redPoints >= this.scoreLimit) {
            return true;
        }
        return false;
    }

    pressStartRound() {
        if (this.checkIfGameEnds()) {
            this.uiUpdater.pressNewGame();
        } else {
            this.uiUpdater.pressStartRound();
        }
    }

    itIsAIsTurn() {
        this.uiUpdater.itIsAIsTurn();
    }

    startNewRound(){
        this.turnCounter = 0;
        this.roundskipped = 0;
        this.board.generateStartingBoard();
        this.turn = 0;
        this.firstTurn = true;
        this.playerHasAnsweredStartRound = false;
        this.aiHasAnsweredStartRound = false;
        if (this.playerPlays) {
            this.msgId = Date.now();
            this.socket.sendStartRound(this.board.gameboardTo2dArray(), this.aiColor, this.aiDifficulty, this.scoreLimit, this.msgId);
            this.uiUpdater.showStartRoundAndSurrenderButtons();
        } else {
            this.sendStartRoundToTwoAIs();
        }
        this.playerWantsToSurrender = false;
        this.uiUpdater.newRoundToConsole();
    }

    undo() {
        this.turnHandler.undo();
    }

    reconnectWebSocket() {
        this.socket = new AiSocket(this);
    }

}


export { Game };
