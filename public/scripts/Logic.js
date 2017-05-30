import { Actions } from './logic/Actions.js';
import { Validations } from './logic/Validations.js';

var gameboard;
var turn;

var actions;
var validations;

class Logic {

    constructor(gameBoard, starting) {
        this.gameboard = gameBoard;
        this.validations = new Validations(gameBoard);
        this.actions = new Actions(gameBoard);
        this.turn = starting;
        if (this.turn === 0) {
            if (Math.random() > 0.5) {
                this.turn = 1;
                //this.turnIndicator("blue", "BLUES");
            } else {
                this.turn = -1;
                //this.turnIndicator("red", "REDS");
            }
        }
        if (this.turn > 0) {
            this.turn = -1;
            //this.turnIndicator("blue", "BLUES");
        } else {
            this.turn = 1;
            //this.turnIndicator("red", "REDS");
        }
        //TODO add turn counter to indicate amount of turns without stones being hit
    }

    setSprites(s) {
        //Deprecated.
    }

    changeTurn() {
        if(this.turn < 0) {
            this.turn = 1;
        } else {
            this.turn = -1;
        }
        console.log("HALOO!");
    }

    isMovesAvailable() {
        return this.validations.isMovesAvailable(this.turn);
    }

    getTurn() {
        return this.turn;
    }

    trianglesFound(positionX, positionY, getBiggest) {
        return this.validations.trianglesFound(positionX, positionY, getBiggest);
    }

    validateMove(firstX, firstY, secondX, secondY, movesAvailableCheck) {
        return this.validations.validateMove(firstX, firstY, secondX, secondY, movesAvailableCheck);
    }

    hitStones(firstX, firstY, secondX, secondY, thirdX, thirdY) {
        if(!this.actions.hitStones(firstX, firstY, secondX, secondY, thirdX, thirdY)) {
            return false;
        }
        this.changeTurn();
    }

}

module.exports.Logic = Logic;

export { Logic };
