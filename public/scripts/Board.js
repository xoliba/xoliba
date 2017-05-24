"use strict";
const ROWS = 7;
var startingTurn;

class Board {

    constructor() {
        this.boardTable = new Array(ROWS);
        this.create2DArray();
        this.generateStartingBoard();
        this.chosenStone = new Stone(0,0,-2);
        startingTurn = 0;
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

        for (let i = 0; i < this.boardTable.length; i++) {
            for (let j = 0; j < this.boardTable.length; j++) {
                let sum = reds + blues + whites;
                let value = Math.floor(Math.random() * sum + 1);
                if((i == 0 || i == 6) && (j == 0 || j == 6)){
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
        console.log(this.boardTable[0][1] +" + " +this.boardTable[0][5]+" + " +this.boardTable[1][0] +" + " +this.boardTable[1][6]
            +" + " +this.boardTable[5][0] +" + " +this.boardTable[5][6] +" + " +this.boardTable[6][1] +" + " +this.boardTable[6][5] +" = " +startingTurn
    )
        if(startingTurn == 0) {
            for(let i = 1; i < 6; i++) {
                startingTurn += this.boardTable[i][0];
                startingTurn += this.boardTable[i][6];
                startingTurn += this.boardTable[0][i];
                startingTurn += this.boardTable[6][i];
            }
        }
        console.log("starting turn: " + startingTurn.valueOf());
    }

    clickStone (x,y) {
        let clickedStone = new Stone(x,y,this.boardTable[y][x])
        if (this.chosenStone.x == 0 && this.chosenStone.y == 0) { //no stone was chosen
            this.chosenStone = new Stone(x,y,this.boardTable[y][x])
    } else {                                                        //a stone was chosen, lets change places
            this.changeStonePlaces(clickedStone,this.chosenStone)
            this.chosenStone = new Stone(0,0,-2)
        }
        console.log("clickStone, chosenOne " + this.chosenStone.toString())
    }

    changeStonePlaces(st1, st2) {
        let c = this.boardTable[st1.y][st2.x]
        this.boardTable[st1.y][st1.x] = this.boardTable[st2.y][st2.x]
        this.boardTable[st2.y][st2.x] = c;
        console.log("stones moved")
    }

    get gameBoard() {
        return this.boardTable;
    }

    get startingTurn() {
        return this.startingTurn;
    }

}

class Stone {

    constructor(x,y,c){
        this.x = x
        this.y = y
        this.c = c
    }

    toString() {
        return this.x + ", " + this.y + " c=" + this.c
    }

}

//Tests wont run without export (cannot be accessed outside)
module.exports.Board = Board;