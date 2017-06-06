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

class TurnHandler {

    constructor(board) {
        this.board = board;
        validate = new Validations();
        actions = new BoardActions();
        corners = [];
        firstClicked = undefined;
    }

    spriteClicked(stone) {
        if (firstClicked === undefined) {
            parseFirstClick(stone);
        }  else if (corners.length === 1) {
            parseClickOnSecondCorner(stone);
        } else if (corners.length === 2) {
            parseClickOnThirdCorner(stone);
        } else if (stone.value === 0) {
            parseClickOnWhiteStone(stone);
        } else if (firstClicked === stone) {
            stone.unchoose();
            firstClicked = undefined;      
        }
    }

    parseFirstClick(stone) {
        if (game.turn === stone.value) {
            firstClicked = stone;
            stone.choose();
        } else {
            return false;
        }
    }

    parseClickOnWhiteStone(stone) {
         if(validate.moveIsValid(firstClicked.x, firstClicked.y, stone.x, stone.y, this.board.gameboardTo2dArray())) {
             this.board.swap(firstClicked.x, firstClicked.y, stone.x, stone.y);
             corners.push(firstClicked);
         } else {
             return false; 
         }
    }

    parseClickOnSecondCorner(stone) {
        if (game.turn === stone.value && (corners[0].x != stone.x || corners[0].y != stone.y)) {
            corners.push(stone);
            stone.choose();
        } else {
            return false;
        }
    }
    parseClickOnThirdCorner(stone) {
        corners.push(stone);
        if (game.turn === stone.value && validate.checkIfTriangle(corners[0].x, corners[0].y, corners[1].x, corners[1].y, corners[2].x, corners[2].y, this.board)) {
            this.board.hitStones(corners[0].x, corners[0].y, corners[1].x, corners[1].y, corners[2].x, corners[2].y, this.board);
            for (var i = 2; i >= 0; i--) {
                corners[i].unchoose();
                corners.pop();
            }
            firstClicked = undefined;
            game.changeTurn();
        } else {
            corners[2].unchoose();
            corners.pop();
            corners[1].unchoose();
            corners.pop();
            return false;
        }
    }

    aiTurn(from, target, corners) {
        this.board.swap(from[0], from[1], target[0], target[1]);
        this.board.hitStones(target[0], target[1], corners[0][0], corners[0][1], corners[1][0], corners[1][1]);
        this.game.changeTurn();
    }
    
    
}

