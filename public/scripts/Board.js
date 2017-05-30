"use strict";
const ROWS = 7;
let startingTurn;

class Board {

    constructor() {
        this.boardTable = new Array(ROWS);
        this.create2DArray();
        this.generateStartingBoard();
    }

    create2DArray() {
        for (let i = 0; i < ROWS; i++) {
            this.boardTable[i] = [];
            for (let j = 0; j < ROWS; j++) {
                this.boardTable[i][j] = 0;
            }
        }
    }

    generateStartingBoard() {

        let reds = 17;
        let blues = 17;
        let whites = 11;
        startingTurn = 0;

        for (let i = 0; i < this.boardTable.length; i++) {
            for (let j = 0; j < this.boardTable.length; j++) {
                let sum = reds + blues + whites;
                let value = Math.floor(Math.random() * sum + 1);
                if((i === 0 || i === 6) && (j === 0 || j === 6)){
                    this.boardTable[i][j] = -2;
                } else if(value <= reds){
                    this.boardTable[i][j] = 1;
                    reds--;
                } else if (value <= reds + blues){
                    this.boardTable[i][j] = -1;
                    blues--;
                } else {
                    this.boardTable[i][j] = 0;
                    whites--;
                }
            }
        }
        startingTurn = this.boardTable[0][1] + this.boardTable[0][5] + this.boardTable[1][0] + this.boardTable[1][6]
            + this.boardTable[5][0] + this.boardTable[5][6] +this.boardTable[6][1] + this.boardTable[6][5];

        if(startingTurn === 0) {
            for(let i = 1; i < 6; i++) {
                startingTurn += this.boardTable[i][0];
                startingTurn += this.boardTable[i][6];
                startingTurn += this.boardTable[0][i];
                startingTurn += this.boardTable[6][i];
            }
        }
    }

    get gameBoard() {
        return this.boardTable;
    }

    get startingTurn() {
        return startingTurn;
    }

}

//Tests wont run without export (cannot be accessed outside)
module.exports.Board = Board;

export { Board };
