let assert = require('assert');
//var BoardClass = require('../public/scripts/Board.js');
import { Board } from '../public/scripts/Board.js';
import { TurnHandler } from '../public/scripts/TurnHandler.js';
import * as PIXI from 'pixi.js';

describe('Board', () => {

    var board;

    beforeEach(() => {
        //board = new BoardClass.Board();
        board = new Board(new PIXI.Application(20, 20, {view: document.getElementById("gameboard")}), td.object(['TurnHandler']));
    });


    it('is right size (and finding stones work)', function() {
        assert.equal(board.gameboardTo2dArray().length, 7);
        for(let i=0; i<board.gameboardTo2dArray().length; i++) {
            assert.equal(board.gameboardTo2dArray()[i].length, 7);
        }
    });

    it('correct number of stones', function() {
        let reds = 0;
        let blues = 0;
        let whites = 0;
        for(let i = 0; i < board.gameboardTo2dArray().length; i++) {
            for(let j = 0; j < board.gameboardTo2dArray()[i].length; j++) {
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

    it('swapping works', function() {
        //his swaps only 5 stones: so there is (theoretical) chance it will swap
        //same colored stones and the test will pass.
        let table = board.gameboardTo2dArray();
        let temp;
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
        for(let i=0; i<board.gameboardTo2dArray().length; i++) {
            for(let j=0; j<board.gameboardTo2dArray()[i].length; j++) {
                assert.equal(board.gameboardTo2dArray()[i][j], table[i][j]);
            }
        }
    });

    it.skip('Hitting stones work', function() {
        //TODO
    });
    
});
