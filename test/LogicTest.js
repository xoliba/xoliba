var assert = require('assert');
import { Logic } from '../public/scripts/Logic.js';
import { Board } from '../public/scripts/Board.js';

describe('Logic', () => {

    var logic;
    var board;
    //PLEASE NOTE: cuz of javascript, all the X and Y coordinates are swapped ":D"
    var emptyBoard =[[-2, 0, 0, 0, 0, 0, -2],
                      [0, 0, 0, 0, 0, 0, 0],
                      [0, 0, 0, 0, 0, 0, 0],
                      [0, 0, 0, 0, 0, 0, 0],
                      [0, 0, 0, 0, 0, 0, 0],
                      [0, 0, 0, 0, 0, 0, 0],
                     [-2, 0, 0, 0, 0, 0, -2]];
    var fullBoard  =[[-2, 1, 1, 1, 1, 1, -2],
                      [1, 1, 1, 1, 1, 1, 1],
                      [1, 1, 1, 1, 1, 1, 1],
                      [1, 1, 1, 1, 1, 1, 1],
                      [1, 1, 1, 1, 1, 1, 1],
                      [1, 1, 1, 1, 1, 1, 1],
                     [-2, 1, 1, 1, 1, 1, -2]];
    var boardSheet1=[[-2, 0, 0, 0, 0, 1, -2],
                      [0, 1, 1, 0, 1, 1, 0],
                      [0, 1, 0, 1, 1, 1, 0],
                      [0, 0, 0, 0, 0, 0, 1],
                      [0, 1, 0, 0, 0, 0, 0],
                      [1, 0, 1, 0, 1, 1, 1],
                     [-2, 1, 1, 0, 1, -1, -2]];
    var boardSheet2=[[-2, 0, 0, 1, 0, 1, -2],
                      [0, 1, 1, 0, 1, 1, 0],
                      [0, 1, 1, 1, 1, 1, 0],
                      [1, 1, 0, 1, 1, 0, 1],
                      [0, 1, 0, 1, 0, 0, 0],
                      [1, 0, 1, 0, 1, 1, 1],
                     [-2, 1, 1, 1, 1, -1, -2]];

    beforeEach(() => {
        board = new Board();
        logic = new Logic(c(emptyBoard), 1);
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

    it('Swapping stones work', function() {
      logic = new Logic(c(boardSheet1), 1);
      logic.swap2DArrayPositions(3, 0, 3, 6);
      logic.swap2DArrayPositions(1, 1, 1, 1);
      logic.swap2DArrayPositions(5, 1, 0, 1);
      logic.swap2DArrayPositions(6, 5, 6, 5);
      let temp = [[-2, 0, 0, 0, 0, 1, -2],
                        [0, 1, 1, 0, 1, 1, 0],
                        [0, 1, 0, 1, 1, 1, 0],
                        [1, 0, 0, 0, 0, 0, 0],
                        [0, 1, 0, 0, 0, 0, 0],
                        [1, 0, 1, 0, 1, 1, 1],
                       [-2, 1, 1, 0, 1, -1, -2]];

      for(let i=0; i<logic.gameboard.length; i++) {
        for(let j=0; j<logic.gameboard[i].length; j++) {
          assert.equal(logic.gameboard[i][j], temp[i][j]);
        }
      }
    });

    it('Is on board works', function() {
      assert.equal(logic.isThisOnBoard(-1, -1), false)
      assert.equal(logic.isThisOnBoard(-1, 3), false)
      assert.equal(logic.isThisOnBoard(3, -1), false)
      assert.equal(logic.isThisOnBoard(7, 7), false)
      assert.equal(logic.isThisOnBoard(7, 0), false)
      assert.equal(logic.isThisOnBoard(0, 7), false)
      assert.equal(logic.isThisOnBoard(0, 0), true)
      assert.equal(logic.isThisOnBoard(6, 6), true)
      assert.equal(logic.isThisOnBoard(3, 3), true)
    });

    it('Changing turn works', function() {
      assert.equal(logic.getTurn(), -1);
      logic.changeTurn();
      assert.equal(logic.getTurn(), 1);
      logic.changeTurn();
      assert.equal(logic.getTurn(), -1);
    });

    it('Stones on the same line works', function() {
      assert.equal(logic.stonesAreOnTheSameLine(1, 1, 1, 1), true);
      assert.equal(logic.stonesAreOnTheSameLine(6, 1, 1, 1), true);
      assert.equal(logic.stonesAreOnTheSameLine(5, 5, 1, 1), true);
      assert.equal(logic.stonesAreOnTheSameLine(1, 1, 2, 3), false);
    });

    it('Checking the colour works', function() {
      logic = new Logic(c(boardSheet1), 1);
      assert.equal(logic.checkIfColour(1, 1, 1), 1);
      assert.equal(logic.checkIfColour(6, 5, -1), 1);
      assert.equal(logic.checkIfColour(3, 3, 1), 0);
      assert.equal(logic.checkIfColour(3, 3, -1), 0);
    });

    it('Finding the triangles work', function() {
      logic = new Logic(c(boardSheet2), 1);
      assert.equal(logic.trianglesFound(3, 3, false), 4);
      assert.equal(logic.trianglesFound(3, 0, false), 8);
      assert.equal(logic.trianglesFound(0, 3, false), 10);
      assert.equal(logic.trianglesFound(3, 4, false), 10);
      assert.equal(logic.trianglesFound(4, 3, false), 10);
      assert.equal(logic.trianglesFound(4, 4, false), 3);
      assert.equal(logic.trianglesFound(3, 3, false), 4);
      assert.equal(logic.trianglesFound(3, 3, true), 2);
      assert.equal(logic.trianglesFound(3, 0, true), 3);
      assert.equal(logic.trianglesFound(0, 3, true), 3);
      assert.equal(logic.trianglesFound(3, 4, true), 2);
      assert.equal(logic.trianglesFound(4, 3, true), 2);
      assert.equal(logic.trianglesFound(4, 4, true), 2);
      assert.equal(logic.trianglesFound(3, 3, true), 2);
    });

    it('Validating the moves work', function() {
      logic = new Logic(c(boardSheet2), 1);
      assert.equal(logic.validateMove(1, 1, 1, 0, false), true);
      assert.equal(logic.validateMove(1, 1, 1, 0, true), false);
      assert.equal(logic.validateMove(2, 3, 6, 3, false), false);
      assert.equal(logic.validateMove(2, 3, 6, 3, true), false);
      assert.equal(logic.validateMove(2, 3, 3, 3, false), true);
      assert.equal(logic.validateMove(2, 3, 3, 3, true), true);
      assert.equal(logic.validateMove(5, 6, 4, 6, false), true);
      assert.equal(logic.validateMove(5, 6, 4, 6, true), true);
      assert.equal(logic.validateMove(1, 1, 2, 0, false), true);
      assert.equal(logic.validateMove(1, 1, 2, 0, true), true);
      assert.equal(logic.validateMove(1, 1, 6, 2, false), false);
      assert.equal(logic.validateMove(1, 1, 6, 2, true), false);
      assert.equal(logic.validateMove(6, 5, 4, 5, false), false);
      assert.equal(logic.validateMove(6, 5, 4, 5, true), false);
    });

    it('Hitting the stones in triangle work', function() {
      let temp;
      logic = new Logic(c(fullBoard), 1);
      temp =  [[-2, 1, 1, 1, 1, 1, -2],
                [1, 1, 0, 0, 0, 1, 1],
                [1, 0, 0, 0, 0, 0, 1],
                [1, 0, 0, 0, 0, 0, 1],
                [1, 1, 1, 1, 1, 1, 1],
                [1, 1, 1, 1, 1, 1, 1],
               [-2, 1, 1, 1, 1, 1, -2]];
      assert.equal(logic.hitStones(3, 0, 0, 3, 3, 6), true);
      for(let i=0; i<logic.gameboard.length; i++) {
        for(let j=0; j<logic.gameboard[i].length; j++) {
          assert.equal(logic.gameboard[i][j], temp[i][j]);
        }
      }
      logic = new Logic(c(fullBoard), 1);
      temp =  [[-2, 1, 1, 1, 1, 1, -2],
                [1, 1, 1, 1, 0, 0, 1],
                [1, 1, 1, 0, 0, 0, 1],
                [1, 1, 1, 0, 0, 0, 1],
                [1, 1, 1, 0, 0, 0, 1],
                [1, 1, 1, 1, 0, 0, 1],
               [-2, 1, 1, 1, 1, 1, -2]];
      assert.equal(logic.hitStones(0, 5, 6, 5, 3, 2), true);
      for(let i=0; i<logic.gameboard.length; i++) {
        for(let j=0; j<logic.gameboard[i].length; j++) {
          assert.equal(logic.gameboard[i][j], temp[i][j]);
        }
      }
      logic = new Logic(c(fullBoard), 1);
      temp =  [[-2, 1, 1, 1, 1, 1, -2],
                [1, 1, 1, 1, 1, 1, 1],
                [1, 1, 1, 1, 1, 1, 1],
                [1, 1, 1, 0, 1, 1, 1],
                [1, 1, 1, 1, 1, 1, 1],
                [1, 1, 1, 1, 1, 1, 1],
               [-2, 1, 1, 1, 1, 1, -2]];
      assert.equal(logic.hitStones(3, 2, 3, 4, 2, 3), true);
      for(let i=0; i<logic.gameboard.length; i++) {
        for(let j=0; j<logic.gameboard[i].length; j++) {
          assert.equal(logic.gameboard[i][j], temp[i][j]);
        }
      }
      logic = new Logic(c(fullBoard), 1);
      temp =  [[-2, 1, 1, 1, 1, 1, -2],
                [1, 1, 1, 1, 1, 1, 1],
                [1, 1, 1, 1, 1, 1, 1],
                [1, 1, 1, 1, 1, 1, 1],
                [1, 1, 1, 1, 1, 1, 1],
                [1, 1, 0, 0, 0, 1, 1],
               [-2, 1, 0, 0, 0, 1, -2]];
      assert.equal(logic.hitStones(7, 3, 5, 5, 5, 1), true);
      for(let i=0; i<logic.gameboard.length; i++) {
        for(let j=0; j<logic.gameboard[i].length; j++) {
          assert.equal(logic.gameboard[i][j], temp[i][j]);
        }
      }
    });



    function c(array) { //copy the array
      let rArray = new Array(7);
      for (let i = 0; i < 7; i++) {
          rArray[i] = [];
          for (let j = 0; j < 7; j++) {
              rArray[i][j] = array[i][j];
          }
      }
      return rArray;
    }

});
