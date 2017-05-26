var assert = require('assert');
var BoardClass = require('../public/scripts/Board.js');

describe('Board.js tests', () => {

    var board;

    beforeEach(() => {
        board = new BoardClass.Board();
    });

    it('Board is right size', function() {
        assert.equal(board.gameBoard.length, 7);
        for(var i=0; i<board.gameBoard.length; i++) {
            assert.equal(board.gameBoard[i].length, 7);
        }

    });
});