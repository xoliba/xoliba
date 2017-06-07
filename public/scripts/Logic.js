import { BoardActions } from './logic/BoardActions.js';
import { Validations } from './logic/Validations.js';

//import * as PIXI from 'pixi.js';

//var gameboard;
var sprites;
var turn;
var stonesHit;
var turnCounter;

class Logic {

    constructor() {
        this.turnCounter = 0;
        //this.gameboard = gameBoard;
        this.validations = new Validations();
        this.actions = new BoardActions();
        //this.turn = starting;
        /*if (this.turn === 0) {
            if (Math.random() > 0.5) {
                this.turn = 1;
                //this.turnIndicator("blue", "BLUES");
            } else {
                this.turn = -1;
                //this.turnIndicator("red", "REDS");
            }
        }*/
        this.turn = -1;
        /*if (this.turn > 0) {
            this.turn = -1;
            //this.turnIndicator("blue", "BLUES");
        } else {
            this.turn = 1;
            //this.turnIndicator("red", "REDS");
        }*/
    }

    turnIndicator(color, turn) {
       /* var turnTeller = document.getElementById("turn");
        turnTeller.style.color = color;
        turnTeller.innerHTML = "It's " + turnTeller + " turn!";*/
    }

    /*changeTurn() {
        if(this.turn < 0) {
            this.turn = 1;
        } else {
            this.turn = -1;
        }
        //console.log("HALOO!");
    }*/

    isMovesAvailable(board) {
        //console.log("IS MOVES AVAILABLE");
        return this.validations.isMovesAvailable(this.turn, board);
    }

    getTurn() {
        return this.turn;
    }

    trianglesFound(positionX, positionY, board, getBiggest) {
        //console.log("TRIANGLES FOUND: " + positionX + positionY, getBiggest);
        return this.validations.trianglesFound(positionX, positionY, board, getBiggest);
    }

    validateMove(firstX, firstY, secondX, secondY, board) {
        if(this.turnCounter >= 30) return false;
        return this.validations.moveIsValid(firstX, firstY, secondX, secondY, board);
    }

    hitStones(firstX, firstY, secondX, secondY, thirdX, thirdY, table) {
        let result = this.actions.hitStones(firstX, firstY, secondX, secondY, thirdX, thirdY, table);
        if(result === false) {
            console.log("EI VIDHU");
            return false;
        }
        if(result === 1) this.turnCounter++;
        else this.turnCounter = 0;
        //this.changeTurn();
        return true;
    }

}

module.exports.Logic = Logic;

export { Logic };
