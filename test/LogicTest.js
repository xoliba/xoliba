var assert = require('assert');
import { Logic } from '../public/scripts/Logic.js';
import { Board } from '../public/scripts/Board.js';

describe('Logic', () => {

    var logic;
    var board;
    var emptyBoard = [[-2, 0, 0, 0, 0, 0, -2],
                      [0, 0, 0, 0, 0, 0, 0],
                      [0, 0, 0, 0, 0, 0, 0],
                      [0, 0, 0, 0, 0, 0, 0],
                      [0, 0, 0, 0, 0, 0, 0],
                      [0, 0, 0, 0, 0, 0, 0],
                      [-2, 0, 0, 0, 0, 0, -2]];

    beforeEach(() => {
        board = new Board();
    });

    it('Turn is given right when starting the game', function() {
        logic = new Logic(emptyBoard, 1);
        assert.equal(logic.getTurn(), -1);
        logic = new Logic(emptyBoard, -1);
        assert.equal(logic.getTurn(), 1);
        logic = new Logic(emptyBoard, 200);
        assert.equal(logic.getTurn(), -1);
        logic = new Logic(emptyBoard, -200);
        assert.equal(logic.getTurn(), 1);
        logic = new Logic(emptyBoard, 0);
        if(logic.getTurn() === 1 || logic.getTurn() === -1) {
          assert(true);
        } else assert(false);
    });
});
