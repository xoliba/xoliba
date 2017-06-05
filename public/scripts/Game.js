import { Board } from './Board.js';

var board;
var turn;
var redPoints;
var bluePoints;

class Game {
    constructor() {
        this.board = new Board();
        this.redPoints = 0;
        this.bluePoints = 0;
    }

    changeTurn() {
        if (this.turn === 1) {
            this.turn = -1;
        } else if (this.turn === -1) {
            this.turn = 1;
        }
    }
}