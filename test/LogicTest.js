var assert = require('assert');
import { Logic } from '../public/scripts/Logic.js';
import { Board } from '../public/scripts/Board.js';

describe('Logic', () => {

    var logic;
    var board;

    beforeEach(() => {
        board = new Board();
        //for now uses random table; we dont want it ofc
        logic = new Logic(board.boardTable, board.startingTurn);
    });

    it('first test', function() {
        assert.equal(1, 1);
    });
});
