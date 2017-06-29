/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
import { Validations } from './Validations.js';
import { BoardActions } from './BoardActions.js';

var firstClicked;
var corners;
var board;
var validate;
var actions;
var stoneX;
var stoneY;
var stone;
var startStone;
var targetStone;
var stonesHit;
var whiteStoneClicked;


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
        this.stonesHit = 0;
    }

    set(board) {
        this.board = board;
    }

    spriteClicked(stone) {
        if (this.game.turn === this.game.aiColor) {
            this.game.itIsAIsTurn();
        } else if (this.game.firstTurn) {
            this.game.pressStartRound();
        }
        if (this.firstClicked === undefined) {
            this.parseFirstClick(stone);
        } else if (this.corners.length === 1) {
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
        if (this.game.playerColor === stone.value && this.game.playerColor === this.game.turn) {
        //  if (this.game.turn === -1 && stone.value === -1) {
            this.firstClicked = stone;
            stone.choose();
        } else {
            return false;
        }
    }

    parseClickOnWhiteStone(stone) {
         if (this.validate.moveIsValid(this.firstClicked.x, this.firstClicked.y, stone.x, stone.y, this.board.gameboardTo2dArray())) {
             this.whiteStoneClicked = stone;
             this.board.swap(this.firstClicked, stone);
             this.corners.push(this.firstClicked);
         } else {
             return false;
         }
    }

    parseClickOnSecondCorner(stone) {
        if (this.game.turn === stone.value && (this.corners[0].x !== stone.x || this.corners[0].y !== stone.y)) {
            this.corners.push(stone);
            stone.choose();
        } else {
            return false;
        }
    }
    
    parseClickOnThirdCorner(stone) {
        if (this.game.turn === stone.value && (this.corners[0].x !== stone.x || this.corners[0].y !== stone.y)) {
            this.corners.push(stone);
            console.log(this.corners[0].x, this.corners[0].y, this.corners[1].x, this.corners[1].y, this.corners[2].x, this.corners[2].y);
            if (this.game.turn === stone.value && this.validate.checkIfTriangle(this.corners[0].x, this.corners[0].y, this.corners[1].x, this.corners[1].y, this.corners[2].x, this.corners[2].y)) {
                this.corners[2].choose();
                setTimeout(() => {
                    this.stonesHit = this.board.hitStones(this.whiteStoneClicked.x, this.whiteStoneClicked.y, this.corners[0].x, this.corners[0].y, this.corners[1].x, this.corners[1].y, this.corners[2].x, this.corners[2].y);
                    if (this.stonesHit === 1) {
                        this.game.updateTurnCounter(false);
                    } else if (this.stonesHit === 2) {
                        this.game.updateTurnCounter(true);
                    }
                    for (var i = 2; i >= 0; i--) {
                        this.corners[i].unchoose();
                        this.corners.pop();
                    }
                    this.firstClicked = undefined;
                    this.game.changeTurn();
                }, 500);
            } else {
                this.corners[2].unchoose();
                this.corners.pop();
                this.corners[1].unchoose();
                this.corners.pop();
                return false;
            }
        }
    }

    aiTurn(didMove, start, target, corners) {
        if (didMove) {
            startStone = this.board.findStone(start[0], start[1]);
            targetStone = this.board.findStone(target[0], target[1]);
            var secondCorner = this.board.findStone(corners[0][0], corners[0][1]);
            var thirdCorner = this.board.findStone(corners[1][0], corners[1][1]);
            this.board.swap(startStone, targetStone);
            setTimeout(() => {
                startStone.choose();
                secondCorner.choose();
                thirdCorner.choose();
                setTimeout(() => {
                    startStone.unchoose();
                    secondCorner.unchoose();
                    thirdCorner.unchoose();
                    this.stonesHit = this.board.hitStones(start[0], start[1], target[0], target[1], corners[0][0], corners[0][1], corners[1][0], corners[1][1]);
                    if (this.stonesHit === 1) {
                        this.game.updateTurnCounter(false);
                    } else {
                        this.game.updateTurnCounter(true);
                    }
                    this.game.changeTurn();
                }, 1000);
            }, 500);
        } else {
            //we shall do nothing, for game.checkIfRoundEnds will send notification to uiHandler, which will result a notification, which will trigger a change turn after clicking it
        }
    }

    undo() {
        if (this.firstClicked === undefined || this.whiteStoneClicked === undefined) {
            return;
        }
        this.board.swap(this.firstClicked, this.whiteStoneClicked);
        this.whiteStoneClicked = undefined;
        for (let i=this.corners.length-1; i>=0; i--) {
            this.corners[i].unchoose();
            this.corners.pop();
        }
        this.firstClicked = undefined;
    }

}

export { TurnHandler };
