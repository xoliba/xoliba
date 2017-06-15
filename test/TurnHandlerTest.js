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

    beforeEach(() => {
        board = td.object('Board');
        game = td.object('Game');
        validate = td.object('Validations');
        stone1 = td.object('Stone');
        stone2 = td.object('Stone');
        stone3 = td.object('Stone');

        board.gameboardTo2dArray = td.when(td.function()()).thenReturn(new Array());

        game.board = board;
        game.playerColor = 1;
        game.turn = 1;
        stone1.value = 1;
        stone2.value = 0;

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
    });
});