var assert = require('assert');
import { BoardActions } from '../public/scripts/logic/BoardActions.js';

describe('BoardActions', () => {

    var actions;
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
