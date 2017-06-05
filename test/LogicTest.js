var assert = require('assert');
import { BoardActions } from '../public/scripts/logic/BoardActions.js';
import { Validations } from '../public/scripts/logic/Validations.js';

describe('Logic (Actions and Validations)', () => {

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
                     [-2, 1, 1, 1, 1,-1, -2]];

    beforeEach(() => {
        actions = new BoardActions();
        validations = new Validations();
    });

    //This is reprecated.
    /*
    it('Turn is given right when starting the game', function() {
        //This is reprecated

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
    */

    it('Function stones between are white works', function() {
      assert.equal(validations.stonesBetweenAreWhite(3, 3, 3, 0, boardSheet1), true);
      assert.equal(validations.stonesBetweenAreWhite(3, 3, 1, 1, boardSheet1), true);
      assert.equal(validations.stonesBetweenAreWhite(3, 3, 0, 3, boardSheet1), false);
      assert.equal(validations.stonesBetweenAreWhite(3, 3, 1, 5, boardSheet1), false);
      assert.equal(validations.stonesBetweenAreWhite(3, 3, 3, 6, boardSheet1), true);
      assert.equal(validations.stonesBetweenAreWhite(3, 3, 5, 5, boardSheet1), true);
      assert.equal(validations.stonesBetweenAreWhite(3, 3, 6, 3, boardSheet1), true);
      assert.equal(validations.stonesBetweenAreWhite(3, 3, 5, 1, boardSheet1), true);
      assert.equal(validations.stonesBetweenAreWhite(5, 3, 3, 0, boardSheet1), false);
      assert.equal(validations.stonesBetweenAreWhite(2, 4, 4, 6, boardSheet1), true);
      assert.equal(validations.stonesBetweenAreWhite(3, 0, 3, 6, boardSheet1), true);
    });

    it('Swapping stones work', function() {
      let temp = c(boardSheet1);
      actions.swap2DArrayPositions(temp, 3, 0, 3, 6);
      actions.swap2DArrayPositions(temp, 1, 1, 1, 1);
      actions.swap2DArrayPositions(temp, 5, 1, 0, 1);
      actions.swap2DArrayPositions(temp, 6, 5, 6, 5);
      let temp2 = [[-2, 0, 0, 0, 0, 1, -2],
                  [0, 1, 1, 0, 1, 1, 0],
                  [0, 1, 0, 1, 1, 1, 0],
                  [1, 0, 0, 0, 0, 0, 0],
                  [0, 1, 0, 0, 0, 0, 0],
                  [1, 0, 1, 0, 1, 1, 1],
                 [-2, 1, 1, 0, 1, -1, -2]];

      for(let i=0; i<temp.length; i++) {
        for(let j=0; j<temp[i].length; j++) {
          assert.equal(temp[i][j], temp2[i][j]);
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

    //Also deprecated. Must be fixed when turning system gets reimplemented.
    /*
    it('Changing turn works', function() {
      assert.equal(logic.getTurn(), -1);
      logic.changeTurn();
      assert.equal(logic.getTurn(), 1);
      logic.changeTurn();
      assert.equal(logic.getTurn(), -1);
    });
    */

    it('Stones on the same line works', function() {
      assert.equal(validations.stonesAreOnTheSameLine(1, 1, 1, 1), true);
      assert.equal(validations.stonesAreOnTheSameLine(6, 1, 1, 1), true);
      assert.equal(validations.stonesAreOnTheSameLine(5, 5, 1, 1), true);
      assert.equal(validations.stonesAreOnTheSameLine(1, 1, 2, 3), false);
    });

    it('Checking the colour works', function() {
      assert.equal(validations.checkIfColour(1, 1, 1, boardSheet1), 1);
      assert.equal(validations.checkIfColour(6, 5, -1, boardSheet1), 1);
      assert.equal(validations.checkIfColour(3, 3, 1, boardSheet1), 0);
      assert.equal(validations.checkIfColour(3, 3, -1, boardSheet1), 0);
    });

    it('Finding the triangles work', function() {
      assert.equal(validations.trianglesFound(3, 3, boardSheet2, false), 4);
      assert.equal(validations.trianglesFound(3, 0, boardSheet2, false), 8);
      assert.equal(validations.trianglesFound(0, 3, boardSheet2, false), 10);
      assert.equal(validations.trianglesFound(3, 4, boardSheet2, false), 10);
      assert.equal(validations.trianglesFound(4, 3, boardSheet2, false), 10);
      assert.equal(validations.trianglesFound(4, 4, boardSheet2, false), 3);
      assert.equal(validations.trianglesFound(3, 3, boardSheet2, false), 4);
      assert.equal(validations.trianglesFound(3, 3, boardSheet2, true), 2);
      assert.equal(validations.trianglesFound(3, 0, boardSheet2, true), 3);
      assert.equal(validations.trianglesFound(0, 3, boardSheet2, true), 3);
      assert.equal(validations.trianglesFound(3, 4, boardSheet2, true), 2);
      assert.equal(validations.trianglesFound(4, 3, boardSheet2, true), 2);
      assert.equal(validations.trianglesFound(4, 4, boardSheet2, true), 2);
      assert.equal(validations.trianglesFound(3, 3, boardSheet2, true), 2);
      let temp =[  [-2, 0, 1, 1, 0, 0,-2],
                    [0, 0, 0, 1,-1, 0,-1],
                    [0, 0, 0, 0,-1,-1, 0],
                    [0, 1, 0, 1, 1, 0, 0],
                    [0, 0, 1, 0, 0, 0, 0],
                    [0, 1, 0,-1, 0, 1, 0],
                   [-2, 0, 0, 1, 0, 0,-2]];
      assert.equal(validations.trianglesFound(3, 3, temp, false), 2);
    });

    describe('Validating the moves work', function() {

      let temp=[[-2, 0, 1, 1, 0, 0,-2],
                 [0, 1, 0, 1,-1, 0,-1],
                 [0, 0, 0, 0,-1,-1, 0],
                 [0, 1, 0, 0, 1, 0, 0],
                 [0, 0, 1, 0, 0, 0, 0],
                 [0, 1, 0,-1, 0, 1, 0],
                [-2, 0, 0, 1, 0, 0,-2]];

      let temp2=[[-2, 1, 0, 0, 0, 1,-2],
                  [0, 0, 0, 0, 0,-1, 0],
                  [1, 0, 0, 1,-1, 0, 0],
                  [0, 1, 0,-1, 0, 0,-1],
                  [1, 0,-1, 0, 0, 0, 0],
                  [1, 0, 0,-1, 0,-1, 0],
                 [-2,-1, 0, 0, 0, 1,-2]]

      it('Legit moves return true', function() {
        assert.equal(validations.moveIsValid(1, 1, 1, 0, boardSheet2), true);
        assert.equal(validations.moveIsValid(2, 3, 3, 3, boardSheet2), true);
        assert.equal(validations.moveIsValid(5, 6, 4, 6, boardSheet2), true);
        assert.equal(validations.moveIsValid(1, 1, 2, 0, boardSheet2), true);
        assert.equal(validations.moveIsValid(1, 1, 2, 2, temp), true);
        assert.equal(validations.moveIsValid(1, 1, 3, 3, temp), true);
        assert.equal(validations.moveIsValid(1, 1, 2, 0, temp), true);
        assert.equal(validations.moveIsValid(3, 4, 3, 3, temp), true);
        assert.equal(validations.moveIsValid(3, 4, 3, 3, temp), true);
        assert.equal(validations.moveIsValid(3, 4, 3, 5, temp), true);
        assert.equal(validations.moveIsValid(5, 3, 2, 3, temp), true);
      });

      it('Unlegit moves return false', function() {
        assert.equal(validations.moveIsValid(2, 3, 6, 3, boardSheet2), false);
        assert.equal(validations.moveIsValid(1, 1, 6, 2, boardSheet2), false);
        assert.equal(validations.moveIsValid(6, 5, 4, 5, boardSheet2), false);
        assert.equal(validations.moveIsValid(1, 1, 4, 4, temp), false);
        assert.equal(validations.moveIsValid(1, 1, 0, 1, temp), false);
        assert.equal(validations.moveIsValid(2, 4, 2, 1, temp), false);
        assert.equal(validations.moveIsValid(1, 4, 0, 4, temp), false);
        assert.equal(validations.moveIsValid(5, 3, 3, 3, temp), false);
        assert.equal(validations.moveIsValid(1, 3, 3, 3, temp2), false);
      });
    });

    describe('Hitting the stones in triangle work', function() {
      let temp;
      let table;
      it('Legit moves work', function() {
        table = c(fullBoard);
        actions = new BoardActions();
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
        actions = new BoardActions();
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
        actions = new BoardActions();
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
        actions = new BoardActions();
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
        actions = new BoardActions();
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
