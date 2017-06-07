const ROWS = 7;
import { BoardActions } from './logic/BoardActions.js';
import { Stone } from './Stone.js';

let stonesList;
let turnHandler;
let actions;
class Board {

    constructor(app, PIXI, turnHandler) {
        this.actions = new BoardActions();
        this.turnHandler = turnHandler;
        return this.generateStartingBoard(app, PIXI);
    }

    gameboardTo2dArray() {
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
            table[this.stonesList[i].x][this.stonesList[i].y] = this.stonesList[i].value;
        }
        //corners
        table[0][0] = -2;
        table[6][0] = -2;
        table[0][6] = -2;
        table[6][6] = -2;
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
        let result = this.actions.hitStones(firstX, firstY, secondX, secondY, thirdX, thirdY, array);
        if(result === false) return false;
        for(let i=0; i<this.stonesList.length; i++) {
            if(this.stonesList[i].value !== array[this.stonesList[i].x][this.stonesList[i].y]) {
                this.stonesList[i].value = array[this.stonesList[i].x][this.stonesList[i].y];
            }
        }
        return result;
    }

    swap(firstStone, secondStone) {
        firstStone.swap(secondStone);
    }


    generateStartingBoard(app, PIXI) {
        let reds = 17;
        let blues = 17;
        let whites = 11;
        this.stonesList = new Array(reds + blues + whites);
        let n = 0;

        for (let i=0; i < 7; i++) {
            for (let j=0; j < 7; j++) {
                if(!((i === 0 || i === 6) && (j === 0 || j === 6))) {
                    let value = Math.floor(Math.random() * (reds + blues + whites) + 1);
                    if(value <= reds){
                        if(this.stonesList[n] == null) this.stonesList[n++] = new Stone(1, i, j, app, PIXI, this.turnHandler);
                        else this.stonesList[n++].value = 1;
                        reds--;
                    } else if (value <= reds + blues){
                        if(this.stonesList[n] == null) this.stonesList[n++] = new Stone(-1, i, j, app, PIXI, this.turnHandler);
                        else this.stonesList[n++].value = -1;
                        blues--;
                    } else {
                        if(this.stonesList[n] == null) this.stonesList[n++] = new Stone(0, i, j, app, PIXI, this.turnHandler);
                        else this.stonesList[n++].value = 0;
                        whites--;
                    }
                }
            }
        }
        return this.startingTurn;
    }

    get startingTurn() {
        let table = this.gameboardTo2dArray();
        let sTurn = table[0][1] + table[0][5] + table[1][0] + table[1][6]
            + table[5][0] + table[5][6] + table[6][1] + table[6][5];

        if(sTurn === 0) {
            for(let i = 1; i < 6; i++) {
                sTurn += table[i][0];
                sTurn += table[i][6];
                sTurn += table[0][i];
                sTurn += table[6][i];
            }
        }
        if(sTurn = 0) {
            if(Math.floor(Math.random()*2)) return -1;
            return 1;
        }
        if(sTurn < 0) return -1;
        return 1;
    }

    findStone(x, y) {
        for(let i=0; i<this.stonesList.length; i++) {
            if(this.stonesList[i].x === x && this.stonesList[i].y === y) {
                return this.stonesList[i];
            }
        }
    }

}

//Tests wont run without export (cannot be accessed outside)
module.exports.Board = Board;

export { Board };
