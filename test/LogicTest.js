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
    var boardSheet1=[[-2, 0, 0, 0, 0, 1, -2],
                      [0, 1, 1, 0, 1, 1, 0],
                      [0, 1, 0, 1, 1, 1, 0],
                      [0, 0, 0, 0, 0, 0, 1],
                      [0, 1, 0, 0, 0, 0, 0],
                      [1, 0, 1, 0, 1, 1, 1],
                     [-2, 1, 1, 0, 1, 0, -2]];
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

    it('Function stones between are white works', function() {
      logic = new Logic(boardSheet1, 1);
      assert.equal(logic.stonesBetweenAreWhite(3, 3, 3, 0), true);
      logic = new Logic(boardSheet1, 1);
      assert.equal(logic.stonesBetweenAreWhite(3, 3, 1, 1), true);
      logic = new Logic(boardSheet1, 1);
      assert.equal(logic.stonesBetweenAreWhite(3, 3, 0, 3), false);
      logic = new Logic(boardSheet1, 1);
      assert.equal(logic.stonesBetweenAreWhite(3, 3, 1, 5), false);
      logic = new Logic(boardSheet1, 1);
      assert.equal(logic.stonesBetweenAreWhite(3, 3, 3, 6), true);
      logic = new Logic(boardSheet1, 1);
      assert.equal(logic.stonesBetweenAreWhite(3, 3, 5, 5), true);
      logic = new Logic(boardSheet1, 1);
      assert.equal(logic.stonesBetweenAreWhite(3, 3, 6, 3), true);
      logic = new Logic(boardSheet1, 1);
      assert.equal(logic.stonesBetweenAreWhite(3, 3, 5, 1), true);
      logic = new Logic(boardSheet1, 1);
      assert.equal(logic.stonesBetweenAreWhite(5, 3, 3, 0), false);
      logic = new Logic(boardSheet1, 1);
      assert.equal(logic.stonesBetweenAreWhite(2, 4, 4, 6), true);
      logic = new Logic(boardSheet1, 1);
      assert.equal(logic.stonesBetweenAreWhite(3, 0, 3, 6), true);
    });

});
