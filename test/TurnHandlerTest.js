var assert = require('assert');
import { Game } from '../public/scripts/Game.js';
import { Board } from '../public/scripts/Board.js';
import { TurnHandler } from '../public/scripts/TurnHandler.js';
import { Stone } from '../public/scripts/Stone.js';
import { Validations } from '../public/scripts/logic/Validations.js';

describe('TurnHandler', () => {
    var turnHandler;
    var game;
    var board;
    var validate;
    var stone1;
    var stone2;
    var stone3;
    var stone4;

    beforeEach(() => {
        board = td.object('Board');
        game = td.object('Game');
        validate = td.object('Validations');
        stone1 = td.object('Stone');
        stone2 = td.object('Stone');
        stone3 = td.object('Stone');
        stone4 = td.object('Stone');

        board.gameboardTo2dArray = td.when(td.function()()).thenReturn(new Array());

        game.board = board;
        game.playerColor = 1;
        game.turn = 1;

        stone1.value = 1;
        stone1.x = 1;
        stone1.y = 1;
        stone2.value = 0;
        stone2.x = 2;
        stone2.y = 2;
        stone3.value = 1;
        stone3.x = 3;
        stone3.y = 3;
        stone4.value = 1;
        stone4.x = 4;
        stone4.y = 4;

        turnHandler = new TurnHandler(board, game);
        turnHandler.validate = validate;
    });

    it('parses the click on first stone correctly', () => {
        turnHandler.spriteClicked(stone1);

        td.verify(stone1.choose(), {times: 1});
    });

    it('parses the click on second stone correctly', () => {
        td.when(validate.moveIsValid(td.matchers.anything(), td.matchers.anything(), td.matchers.anything(), td.matchers.anything(), td.matchers.anything())).thenReturn(true);

        turnHandler.spriteClicked(stone1);
        turnHandler.spriteClicked(stone2);

        td.verify(stone1.choose(), {times: 1});
        td.verify(board.swap(td.matchers.isA(Object), td.matchers.isA(Object)), {times: 1});

        assert.equal(turnHandler.corners.includes(stone1), true);
    });

    it('parses the click on second corner correctly', () => {
        td.when(validate.moveIsValid(td.matchers.anything(), td.matchers.anything(), td.matchers.anything(), td.matchers.anything(), td.matchers.anything())).thenReturn(true);

        turnHandler.spriteClicked(stone1);
        turnHandler.spriteClicked(stone2);
        turnHandler.spriteClicked(stone3);

        td.verify(stone1.choose(), {times: 1});
        td.verify(stone3.choose(), {times: 1})
        td.verify(board.swap(td.matchers.isA(Object), td.matchers.isA(Object)), {times: 1});

        assert.equal(turnHandler.corners.includes(stone1), true);
        assert.equal(turnHandler.corners.includes(stone3), true);
    });

    it('hits stones and changes turn when clicks form a triangle', () => {
        td.when(validate.moveIsValid(td.matchers.anything(), td.matchers.anything(), td.matchers.anything(), td.matchers.anything(), td.matchers.anything())).thenReturn(true);
        td.when(validate.checkIfTriangle(td.matchers.anything(), td.matchers.anything(), td.matchers.anything(), td.matchers.anything(), td.matchers.anything(), td.matchers.anything())).thenReturn(true);
        td.when(board.hitStones(td.matchers.anything(), td.matchers.anything(), td.matchers.anything(), td.matchers.anything(), td.matchers.anything(), td.matchers.anything(), td.matchers.anything())).thenReturn(2);

        turnHandler.spriteClicked(stone1);
        turnHandler.spriteClicked(stone2);
        turnHandler.spriteClicked(stone3);
        turnHandler.spriteClicked(stone4);

        td.verify(stone1.choose(), {times: 1});
        td.verify(stone3.choose(), {times: 1});
        td.verify(board.swap(td.matchers.isA(Object), td.matchers.isA(Object)), {times: 1});
        td.verify(stone1.unchoose(), {times: 1});
        td.verify(stone3.unchoose(), {times: 1});
        td.verify(game.changeTurn(), {times: 1});

        assert.equal(turnHandler.corners.includes(stone1), false);
        assert.equal(turnHandler.corners.includes(stone3), false);
    });

    it('deselects the stone if it is clicked twice', () => {
        turnHandler.spriteClicked(stone1);
        turnHandler.spriteClicked(stone1);

        td.verify(stone1.choose(), {times: 1});
        td.verify(stone1.unchoose(), {times: 1});

        assert.equal(turnHandler.firstClicked, undefined);
    });

    it('deselects the second corner if triangle is not formed', () => {
        td.when(validate.moveIsValid(td.matchers.anything(), td.matchers.anything(), td.matchers.anything(), td.matchers.anything(), td.matchers.anything())).thenReturn(true);
        td.when(validate.checkIfTriangle(td.matchers.anything(), td.matchers.anything(), td.matchers.anything(), td.matchers.anything(), td.matchers.anything(), td.matchers.anything())).thenReturn(false);

        turnHandler.spriteClicked(stone1);
        turnHandler.spriteClicked(stone2);
        turnHandler.spriteClicked(stone3);
        turnHandler.spriteClicked(stone4);

        td.verify(stone3.unchoose(), {times: 1});

        assert.equal(turnHandler.corners.includes(stone3), false);
    });

    it('parses ai move correctly', () => {
        td.when(board.findStone(td.matchers.anything(), td.matchers.anything())).thenReturn(stone1, stone2);
        td.when(board.hitStones(td.matchers.anything(), td.matchers.anything(), td.matchers.anything(), td.matchers.anything(), td.matchers.anything(), td.matchers.anything(), td.matchers.anything())).thenReturn(2);

        turnHandler.aiTurn(true, 0, 0, [[0,0],[0,0]]);

        td.verify(board.swap(td.matchers.isA(Object), td.matchers.isA(Object)), {times: 1});
        td.verify(game.changeTurn());
    });
});