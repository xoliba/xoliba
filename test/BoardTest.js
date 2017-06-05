let assert = require('assert');
//var BoardClass = require('../public/scripts/Board.js');
import { Board } from '../public/scripts/Board.js';

describe('Board', () => {

    var board;

    beforeEach(() => {
        //board = new BoardClass.Board();
        board = new Board();
    });

/*
    it('is right size', function() {
      console.log(board.gameboardArray);
        assert.equal(board.gameboardArray.length, 7);
        for(let i=0; i<board.gameboardArray.length; i++) {
            assert.equal(board.gameboardArray[i].length, 7);
        }
    });
*/

//Deprecated right now
/*
    it('correct number of stones', function() {
        let reds = 0;
        let blues = 0;
        let whites = 0;
        for(let i = 0; i < board.gameBoard.length; i++) {
            for(let j = 0; j < board.gameBoard[i].length; j++) {
                if (board.gameBoard[i][j] === 1) {
                    reds++;
                } else if (board.gameBoard[i][j] === -1) {
                    blues++
                } else if (board.gameBoard[i][j] === 0) {
                    whites++;
                }
            }
        }
        assert.equal(reds, 17);
        assert.equal(blues, 17);
        assert.equal(whites, 11);
    })*/
});
