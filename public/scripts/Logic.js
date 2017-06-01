import { Actions } from './logic/Actions.js';
import { Validations } from './logic/Validations.js';

//import * as PIXI from 'pixi.js';

var gameboard;
var sprites;
var turn;
var stonesHit;
var turnCounter;

class Logic {

    constructor(gameBoard, starting) {
        this.turnCounter = 0;
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
    }

    turnIndicator(color, turn) {
       /* var turnTeller = document.getElementById("turn");
        turnTeller.style.color = color;
        turnTeller.innerHTML = "It's " + turnTeller + " turn!";*/
    }

    changeTurn() {
        if(this.turn < 0) {
            this.turn = 1;
        } else {
            this.turn = -1;
        }
        //console.log("HALOO!");
    }

    isMovesAvailable() {
        //console.log("IS MOVES AVAILABLE");
        return this.validations.isMovesAvailable(this.turn);
    }

    getTurn() {
        return this.turn;
    }

    trianglesFound(positionX, positionY, getBiggest) {
        //console.log("TRIANGLES FOUND: " + positionX + positionY, getBiggest);
        return this.validations.trianglesFound(positionX, positionY, getBiggest);
    }

    validateMove(firstX, firstY, secondX, secondY, movesAvailableCheck) {
        if(this.turnCounter >= 30) return false;
        let result = this.validations.validateMove(firstX, firstY, secondX, secondY, movesAvailableCheck)
        console.log("SIIRTO: " + result);
        return result;
    }

    hitStones(firstX, firstY, secondX, secondY, thirdX, thirdY) {
        let result = this.actions.hitStones(firstX, firstY, secondX, secondY, thirdX, thirdY, this.gameboard);
        if(result === false) {
            console.log("EI VIDHU");
            return false;
        }
        if(result === 1) this.turnCounter++;
        else this.turnCounter = 0;
        this.changeTurn();
        return true;
    }

}

module.exports.Logic = Logic;

export { Logic };
