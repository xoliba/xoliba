import { Board } from './Board.js';

let board;
let turn;
let redPoints;
let bluePoints;

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

    get turn() {
        return this.turn;
    }
}