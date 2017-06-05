const ROWS = 7;
//let startingTurn;
let stonesList;
import { BoardActions } from './logic/BoardActions.js';

class Board {


    constructor() {
        actions = new BoardActions();
        //this.generateStartingBoard();
    }

    get gameboardTo2dArray() {
        //generate empty table
        let table = new Array(ROWS);
        for (let i = 0; i < ROWS; i++) {
            table[i] = [];
            for (let j = 0; j < ROWS; j++) {
                table[i][j] = 0;
            }
        }
        //load the sprites
        for(let i=0; i<this.stonesList.length; i++) {
            table[stonesList[i].x()][stonesList[i].y()] = stonesList[i].color();
        }
        return table;
    }

    /*
      Will return false (0) if the move is not for some reason legit(!) This
      shouldnt ever happen. Really. But since the validation in BoardActions is
      so short amount of code, its left there and works just fine.

      If no stones are being hit, it will return 1.
      If stones are hit, will return 2.
    */
    hitStones(firstX, firstY, secondX, secondY, thirdX, thirdY) {
        let array = this.gameboardTo2dArray();
        let result = actions.hitStones(firstX, firstY, secondX, secondY, thirdX, thirdY, array);
        if(result === false) return false;
        for(let i=0; i<stonesList.length; i++) {
            if(stonesList[i].value !== array[stonesList[i].x][stonesList[i].y]) {
                stonesList[i].value = array[stonesList[i].x][stonesList[i].y];
            }
        }
        return table;
    }

    swap(firstX, firstY, secondX, secondY) {
        this.findStone(firstX, firstY).swap(this.findStone(secondX, secondY));
    }


    generateStartingBoard() {
        let reds = 17;
        let blues = 17;
        let whites = 11;
        stonesList = new Array(reds + blues + whites + 4);
        for(int i=0; )

        for (i=0; reds + blues + whites > 0; i++) {
            let value = Math.floor(Math.random() * reds + blues + whites + 1);
            if((i === 0 || i === 6) && (j === 0 || j === 6)){
                //dont do anything
                continue;
            } else if(value <= reds){
                this.stonesList[i] = 1;
                reds--;
            } else if (value <= reds + blues){
                this.stonesList[i] = -1;
                blues--;
            } else {
                this.stonesList[i] = 0;
                whites--;
            }
        }

        /*  //Deprecated?
        startingTurn = this.table[0][1] + this.table[0][5] + this.table[1][0] + this.table[1][6]
            + this.table[5][0] + this.table[5][6] +this.table[6][1] + this.table[6][5];

        if(startingTurn === 0) {
            for(let i = 1; i < 6; i++) {
                startingTurn += this.table[i][0];
                startingTurn += this.table[i][6];
                startingTurn += this.table[0][i];
                startingTurn += this.table[6][i];
            }
        }*/
    }

    findStone(x, y) {
        for(let i=0; i<stonesList.length; i++) {
            if(stonesList[i].x() === x && stonesList[i].y() === y) {
                return stonesList[i];
            }
        }
    }

    save2dArray() {
        for(let i=0; i<)
    }

}

//Tests wont run without export (cannot be accessed outside)
module.exports.Board = Board;

export { Board };
