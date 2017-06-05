const ROWS = 7;
//let startingTurn;
let spritesList;
import { BoardActions } from './logic/BoardActions.js';

class Board {


    constructor() {
        this.table = new Array(ROWS);
        //this.generateStartingBoard();
    }

    get gameboardArray() {
        //generate empty table
        let table;
        for (let i = 0; i < ROWS; i++) {
            table[i] = [];
            for (let j = 0; j < ROWS; j++) {
                table[i][j] = 0;
            }
        }
        //corners
        table[0][0] = -2;
        table[6][0] = -2;
        table[0][6] = -2;
        table[6][6] = -2;
        //load the sprites
        for(let i=0; i<spritesList.length; i++) {
            table[spritesList[i].x()][spritesList[i].y()] = spritesList[i].color();
        }
        return table;
    }



    //Deprecated.
    /*
    generateStartingBoard() {
        let reds = 17;
        let blues = 17;
        let whites = 11;
        startingTurn = 0;

        for (let i = 0; i < this.table.length; i++) {
            for (let j = 0; j < this.table.length; j++) {
                let sum = reds + blues + whites;
                let value = Math.floor(Math.random() * sum + 1);
                if((i === 0 || i === 6) && (j === 0 || j === 6)){
                    this.table[i][j] = -2;
                } else if(value <= reds){
                    this.table[i][j] = 1;
                    reds--;
                } else if (value <= reds + blues){
                    this.table[i][j] = -1;
                    blues--;
                } else {
                    this.table[i][j] = 0;
                    whites--;
                }
            }
        }
        startingTurn = this.table[0][1] + this.table[0][5] + this.table[1][0] + this.table[1][6]
            + this.table[5][0] + this.table[5][6] +this.table[6][1] + this.table[6][5];

        if(startingTurn === 0) {
            for(let i = 1; i < 6; i++) {
                startingTurn += this.table[i][0];
                startingTurn += this.table[i][6];
                startingTurn += this.table[0][i];
                startingTurn += this.table[6][i];
            }
        }
    }

    get gameBoard() {
        return this.table;
    }

    get startingTurn() {
        return startingTurn;
    }
    */
}

//Tests wont run without export (cannot be accessed outside)
module.exports.Board = Board;

export { Board };
