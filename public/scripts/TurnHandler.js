/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
import { Board }from './Board.js';
import { Validations } from './logic/Validations.js';
import { Stone } from './Stone.js';
import { BoardActions } from './logic/BoardActions.js';

var firstClicked
var corners;
var board;
var validate;
var actions;
var stoneX;
var stoneY;
var stone;




class TurnHandler {

    constructor(board, game) {
        this.board = board;
        this.game = game;
        this.validate = new Validations();
        this.actions = new BoardActions();
        this.corners = [];
        this.firstClicked = undefined;
        stoneX = 0;
        stoneY = 0;
    }

    set(board) {
        this.board = board;
    }

    spriteClicked(stone) {
        if (this.firstClicked === undefined) {
            console.log("ekaa painettu");
            this.parseFirstClick(stone);
        }  else if (this.corners.length === 1) {
            this.parseClickOnSecondCorner(stone);
        } else if (this.corners.length === 2) {
            this.parseClickOnThirdCorner(stone);
        } else if (stone.value === 0) {
            this.parseClickOnWhiteStone(stone);
        } else if (this.firstClicked === stone) {
            stone.unchoose();
            this.firstClicked = undefined;      
        }
    }

    parseFirstClick(stone) {
        if (this.game.turn === stone.value) {
            this.firstClicked = stone;
            stone.choose();
        } else {
            return false;
        }
    }

    parseClickOnWhiteStone(stone) {
         if(this.validate.moveIsValid(this.firstClicked.x, this.firstClicked.y, stone.x, stone.y, this.board.gameboardTo2dArray())) {
             console.log(this.firstClicked.sprite.x, this.firstClicked.sprite.y, stone.sprite.x, stone.sprite.y);
             this.board.swap(this.firstClicked, stone);
             console.log(this.firstClicked.sprite.x, this.firstClicked.sprite.y, stone.sprite.x, stone.sprite.y);
             this.corners.push(this.firstClicked);
         } else {
             return false; 
         }
    }

    parseClickOnSecondCorner(stone) {
        if (this.game.turn === stone.value && (this.corners[0].x != stone.x || this.corners[0].y != stone.y)) {
            this.corners.push(stone);
            stone.choose();
        } else {
            return false;
        }
    }
    parseClickOnThirdCorner(stone) {
        this.corners.push(stone);
        console.log(this.corners[0].x, this.corners[0].y, this.corners[1].x, this.corners[1].y, this.corners[2].x, this.corners[2].y);
        if (this.game.turn === stone.value && this.validate.checkIfTriangle(this.corners[0].x, this.corners[0].y, this.corners[1].x, this.corners[1].y, this.corners[2].x, this.corners[2].y)) {   
            console.log("validate läpi");
            this.board.hitStones(this.corners[0].x, this.corners[0].y, this.corners[1].x, this.corners[1].y, this.corners[2].x, this.corners[2].y);
            for (var i = 2; i >= 0; i--) {
                this.corners[i].unchoose();
                this.corners.pop();
            }
            this.firstClicked = undefined;
            this.game.changeTurn();
        } else {
            console.log("validate ei läpi");
            this.corners[2].unchoose();
            this.corners.pop();
            this.corners[1].unchoose();
            this.corners.pop();
            return false;
        }
    }

    aiTurn(from, target, corners) {
        this.board.swap(from[0], from[1], target[0], target[1]);
        this.board.hitStones(target[0], target[1], this.corners[0][0], this.corners[0][1], this.corners[1][0], this.corners[1][1]);
        this.game.changeTurn();
    }

    
    
    
}

export { TurnHandler };

