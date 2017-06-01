var assert = require('assert');
import { Logic } from '../public/scripts/Logic.js';
import { Actions } from '../public/scripts/logic/Actions.js';
import { Validations } from '../public/scripts/logic/Validations.js';

describe('Logic (and logic/*.js)', () => {

    var logic;
    var actions;
    var validations;
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
        logic = new Logic(c(emptyBoard), 1);
        actions = new Actions(c(emptyBoard));
        validations = new Validations(c(emptyBoard));
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
      validations = new Validations(boardSheet1);
      assert.equal(validations.stonesBetweenAreWhite(3, 3, 3, 0), true);
      validations = new Validations(boardSheet1);
      assert.equal(validations.stonesBetweenAreWhite(3, 3, 1, 1), true);
      validations = new Validations(boardSheet1);
      assert.equal(validations.stonesBetweenAreWhite(3, 3, 0, 3), false);
      validations = new Validations(boardSheet1);
      assert.equal(validations.stonesBetweenAreWhite(3, 3, 1, 5), false);
      validations = new Validations(boardSheet1);
      assert.equal(validations.stonesBetweenAreWhite(3, 3, 3, 6), true);
      validations = new Validations(boardSheet1);
      assert.equal(validations.stonesBetweenAreWhite(3, 3, 5, 5), true);
      validations = new Validations(boardSheet1);
      assert.equal(validations.stonesBetweenAreWhite(3, 3, 6, 3), true);
      validations = new Validations(boardSheet1);
      assert.equal(validations.stonesBetweenAreWhite(3, 3, 5, 1), true);
      validations = new Validations(boardSheet1);
      assert.equal(validations.stonesBetweenAreWhite(5, 3, 3, 0), false);
      validations = new Validations(boardSheet1);
      assert.equal(validations.stonesBetweenAreWhite(2, 4, 4, 6), true);
      validations = new Validations(boardSheet1);
      assert.equal(validations.stonesBetweenAreWhite(3, 0, 3, 6), true);
    });

    it('Swapping stones work', function() {
      validations = new Validations(c(boardSheet1));
      validations.swap2DArrayPositions(3, 0, 3, 6);
      validations.swap2DArrayPositions(1, 1, 1, 1);
      validations.swap2DArrayPositions(5, 1, 0, 1);
      validations.swap2DArrayPositions(6, 5, 6, 5);
      let temp = [[-2, 0, 0, 0, 0, 1, -2],
                  [0, 1, 1, 0, 1, 1, 0],
                  [0, 1, 0, 1, 1, 1, 0],
                  [1, 0, 0, 0, 0, 0, 0],
                  [0, 1, 0, 0, 0, 0, 0],
                  [1, 0, 1, 0, 1, 1, 1],
                 [-2, 1, 1, 0, 1, -1, -2]];

      for(let i=0; i<validations.gameboard.length; i++) {
        for(let j=0; j<validations.gameboard[i].length; j++) {
          assert.equal(validations.gameboard[i][j], temp[i][j]);
        }
      }
    });

    it('Is on board works', function() {
      assert.equal(validations.isThisOnBoard(-1, -1), false)
      assert.equal(validations.isThisOnBoard(-1, 3), false)
      assert.equal(validations.isThisOnBoard(3, -1), false)
      assert.equal(validations.isThisOnBoard(7, 7), false)
      assert.equal(validations.isThisOnBoard(7, 0), false)
      assert.equal(validations.isThisOnBoard(0, 7), false)
      assert.equal(validations.isThisOnBoard(0, 0), true)
      assert.equal(validations.isThisOnBoard(6, 6), true)
      assert.equal(validations.isThisOnBoard(3, 3), true)
    });

    it('Changing turn works', function() {
      assert.equal(logic.getTurn(), -1);
      logic.changeTurn();
      assert.equal(logic.getTurn(), 1);
      logic.changeTurn();
      assert.equal(logic.getTurn(), -1);
    });

    it('Stones on the same line works', function() {
      assert.equal(validations.stonesAreOnTheSameLine(1, 1, 1, 1), true);
      assert.equal(validations.stonesAreOnTheSameLine(6, 1, 1, 1), true);
      assert.equal(validations.stonesAreOnTheSameLine(5, 5, 1, 1), true);
      assert.equal(validations.stonesAreOnTheSameLine(1, 1, 2, 3), false);
    });

    it('Checking the colour works', function() {
      validations = new Validations(c(boardSheet1));
      assert.equal(validations.checkIfColour(1, 1, 1), 1);
      assert.equal(validations.checkIfColour(6, 5, -1), 1);
      assert.equal(validations.checkIfColour(3, 3, 1), 0);
      assert.equal(validations.checkIfColour(3, 3, -1), 0);
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
      let temp =[  [-2, 0, 1, 1, 0, 0,-2],
                    [0, 0, 0, 1,-1, 0,-1],
                    [0, 0, 0, 0,-1,-1, 0],
                    [0, 1, 0, 1, 1, 0, 0],
                    [0, 0, 1, 0, 0, 0, 0],
                    [0, 1, 0,-1, 0, 1, 0],
                   [-2, 0, 0, 1, 0, 0,-2]];
      logic = new Logic(c(temp), 1);
      assert.equal(logic.trianglesFound(3, 3, false), 2);
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

      let temp=[[-2, 0, 1, 1, 0, 0,-2],
                 [0, 1, 0, 1,-1, 0,-1],
                 [0, 0, 0, 0,-1,-1, 0],
                 [0, 1, 0, 0, 1, 0, 0],
                 [0, 0, 1, 0, 0, 0, 0],
                 [0, 1, 0,-1, 0, 1, 0],
                [-2, 0, 0, 1, 0, 0,-2]];

      logic = new Logic(c(temp), 1);
      assert.equal(logic.validateMove(1, 1, 2, 2, false), true);
      logic = new Logic(c(temp), 1);
      assert.equal(logic.validateMove(1, 1, 3, 3, false), true);
      logic = new Logic(c(temp), 1);
      assert.equal(logic.validateMove(1, 1, 4, 4, false), false);
      logic = new Logic(c(temp), 1);
      assert.equal(logic.validateMove(1, 1, 2, 0, false), true);
      logic = new Logic(c(temp), 1);
      assert.equal(logic.validateMove(1, 1, 0, 1, false), false);
      logic = new Logic(c(temp), 1);
      assert.equal(logic.validateMove(3, 4, 3, 3, false), true);
      logic = new Logic(c(temp), 1);
      assert.equal(logic.validateMove(3, 4, 3, 3, false), true);
      logic = new Logic(c(temp), 1);
      assert.equal(logic.validateMove(3, 4, 3, 5, false), true);
      logic = new Logic(c(temp), -1);
      assert.equal(logic.validateMove(2, 4, 2, 1, false), false);
      logic = new Logic(c(temp), 1);
      assert.equal(logic.validateMove(1, 4, 0, 4, false), false);
      logic = new Logic(c(temp), 1);
      assert.equal(logic.validateMove(5, 3, 3, 3, false), false);
      logic = new Logic(c(temp), 1);
      assert.equal(logic.validateMove(5, 3, 2, 3, false), true);
    });

    describe('Hitting the stones in triangle work', function() {
      let temp;
      let table;
      it('Legit moves work', function() {
        table = c(fullBoard);
        actions = new Actions();
        temp =  [[-2, 1, 1, 1, 1, 1, -2],
                  [1, 1, 0, 0, 0, 1, 1],
                  [1, 0, 0, 0, 0, 0, 1],
                  [1, 0, 0, 0, 0, 0, 1],
                  [1, 1, 1, 1, 1, 1, 1],
                  [1, 1, 1, 1, 1, 1, 1],
                 [-2, 1, 1, 1, 1, 1, -2]];
        assert.equal(actions.hitStones(3, 0, 0, 3, 3, 6, table), 2);
        for(let i=0; i<table.length; i++) {
          for(let j=0; j<table[i].length; j++) {
            assert.equal(table[i][j], temp[i][j]);
          }
        }
        table = c(fullBoard);
        actions = new Actions();
        temp =  [[-2, 1, 1, 1, 1, 1, -2],
                  [1, 1, 1, 1, 0, 0, 1],
                  [1, 1, 1, 0, 0, 0, 1],
                  [1, 1, 1, 0, 0, 0, 1],
                  [1, 1, 1, 0, 0, 0, 1],
                  [1, 1, 1, 1, 0, 0, 1],
                 [-2, 1, 1, 1, 1, 1, -2]];
        assert.equal(actions.hitStones(0, 5, 6, 5, 3, 2, table), 2);
        for(let i=0; i<table.length; i++) {
          for(let j=0; j<table[i].length; j++) {
            assert.equal(table[i][j], temp[i][j]);
          }
        }
        table = c(fullBoard);
        actions = new Actions();
        temp =  [[-2, 1, 1, 1, 1, 1, -2],
                  [1, 1, 1, 1, 1, 1, 1],
                  [1, 1, 1, 1, 1, 1, 1],
                  [1, 1, 1, 0, 1, 1, 1],
                  [1, 1, 1, 1, 1, 1, 1],
                  [1, 1, 1, 1, 1, 1, 1],
                 [-2, 1, 1, 1, 1, 1, -2]];
        assert.equal(actions.hitStones(3, 2, 3, 4, 2, 3, table), 2);
        for(let i=0; i<table.length; i++) {
          for(let j=0; j<table[i].length; j++) {
            assert.equal(table[i][j], temp[i][j]);
          }
        }
        table = c(fullBoard);
        actions = new Actions();
        temp =  [[-2, 1, 1, 1, 1, 1, -2],
                  [1, 1, 1, 1, 1, 1, 1],
                  [1, 1, 1, 1, 1, 1, 1],
                  [1, 1, 1, 1, 1, 1, 1],
                  [1, 1, 1, 1, 1, 1, 1],
                  [1, 1, 0, 0, 0, 1, 1],
                 [-2, 1, 0, 0, 0, 1, -2]];
        assert.equal(actions.hitStones(7, 3, 5, 5, 5, 1, table), 2);
        for(let i=0; i<table.length; i++) {
          for(let j=0; j<table[i].length; j++) {
            assert.equal(table[i][j], temp[i][j]);
          }
        }
      });
      it('Unlegit moves wont happen and will return false', function() {
        table = c(fullBoard);
        actions = new Actions();
        temp =  [[-2, 1, 1, 1, 1, 1, -2],
                  [1, 1, 1, 1, 1, 1, 1],
                  [1, 1, 1, 1, 1, 1, 1],
                  [1, 1, 1, 1, 1, 1, 1],
                  [1, 1, 1, 1, 1, 1, 1],
                  [1, 1, 1, 1, 1, 1, 1],
                 [-2, 1, 1, 1, 1, 1, -2]];
        assert.equal(actions.hitStones(0, 0, 6, 0, 0, 6, table), false);
        for(let i=0; i<table.length; i++) {
          for(let j=0; j<table[i].length; j++) {
            assert.equal(table[i][j], temp[i][j]);
          }
        }
      });
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
