var assert = require('assert');
//var BoardClass = require('../public/scripts/Board.js');
import { Board } from '../public/scripts/Board.js';
import { TurnHandler } from '../public/scripts/TurnHandler.js';
import { Game } from '../public/scripts/Game.js';
import { BoardActions } from '../public/scripts/logic/BoardActions.js';
import { Validations } from '../public/scripts/logic/Validations.js';
import * as PIXI from 'pixi.js';

describe('Board', () => {

    var board;
    var actions;
    var validate;
    var turnhandler;
    var table = [[-2, 0, -1, -1, 0, 1, -2],
                [0, -1, -1, 0, 1, 1, 0],
                [-1, 1, 0, 1, 1, 1, -1],
                [0, -1, -1, -1, -1, 0, 1],
                [0, 1, -1, -1, 0, -1, -1],
                [1, -1, 1, -1, 1, 1, 1],
                [-2, 1, 1, 0, -1, 1, -2]];

    beforeEach(() => {
        turnhandler = td.object('TurnHandler');
        board = new Board(new PIXI.Application(20, 20, {view: document.getElementById("gameboard")}), turnhandler);
    });


    it('is right size (and finding stones work)', () => {
        assert.equal(board.gameboardTo2dArray().length, 7);
        for(var i=0; i<board.gameboardTo2dArray().length; i++) {
            assert.equal(board.gameboardTo2dArray()[i].length, 7);
        }
    });

    it('correct number of stones', () => {
        var reds = 0;
        var blues = 0;
        var whites = 0;
        for(var i = 0; i < board.gameboardTo2dArray().length; i++) {
            for(var j = 0; j < board.gameboardTo2dArray()[i].length; j++) {
                if (board.gameboardTo2dArray()[i][j] === 1) {
                    reds++;
                } else if (board.gameboardTo2dArray()[i][j] === -1) {
                    blues++
                } else if (board.gameboardTo2dArray()[i][j] === 0) {
                    whites++;
                }
            }
        }
        assert.equal(reds, 17);
        assert.equal(blues, 17);
        assert.equal(whites, 11);
    });

    it('swapping works', () => {
        //his swaps only 5 stones: so there is (theoretical) chance it will swap
        //same colored stones and the test will pass.
        var table = board.gameboardTo2dArray();
        var temp;
        temp = table[1][1];
        table[1][1] = table[1][2];
        table[1][2] = temp;
        board.swap(board.findStone(1, 1), board.findStone(1, 2));
        temp = table[2][1];
        table[2][1] = table[2][2];
        table[2][2] = temp;
        board.swap(board.findStone(2, 1), board.findStone(2, 2));
        temp = table[3][1];
        table[3][1] = table[3][2];
        table[3][2] = temp;
        board.swap(board.findStone(3, 1), board.findStone(3, 2));
        temp = table[4][1];
        table[4][1] = table[4][2];
        table[4][2] = temp;
        board.swap(board.findStone(4, 1), board.findStone(4, 2));
        temp = table[5][1];
        table[5][1] = table[5][2];
        table[5][2] = temp;
        board.swap(board.findStone(5, 1), board.findStone(5, 2));
        for(var i=0; i<board.gameboardTo2dArray().length; i++) {
            for(var j=0; j<board.gameboardTo2dArray()[i].length; j++) {
                assert.equal(board.gameboardTo2dArray()[i][j], table[i][j]);
            }
        }
    });

    /*it('Hitting stones work', () => {
        var gameboardTo2dArray = td.function('gameboardTo2dArray');
        board.gameboardTo2dArray = gameboardTo2dArray;
        td.when(board.gameboardTo2dArray()).thenReturn(table);
        assert.equal(board.hitStones(0, 5, 3, 2, 6, 5), 2);
    });

    it('Starting turn works', () => {
        var gameboardTo2dArray = td.function('gameboardTo2dArray');
        board.gameboardTo2dArray = gameboardTo2dArray;
        td.when(board.gameboardTo2dArray()).thenReturn(table);
        assert.equal(board.startingTurn(), -1);
    });*/
});
