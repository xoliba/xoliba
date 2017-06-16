var assert = require('assert');
import { Board } from '../public/scripts/Board.js';
import { AiSocket } from '../public/scripts/Websocket.js';
import { Game } from '../public/scripts/Game.js';
import { Validations } from '../public/scripts/logic/Validations.js';
import { InfoConsole } from '../public/scripts/InfoConsole.js';
import { UIUpdater } from '../public/scripts/UIUpdater.js';
import * as PIXI from 'pixi.js';



describe('Game', () => {

    var game;
    var board;
    var socket;
    var validate;
    var infoConsole;
    var UIUpdater;
    var table = [[-2, 0, 0, 0, 0, 1, -2],
                [0, 1, 1, 0, 1, 1, 0],
                [0, 1, 0, 1, 1, 1, 0],
                [0, 0, 0, 0, 0, 0, 1],
                [0, 1, 0, 0, 0, 0, 0],
                [1, 0, 1, 0, 1, 1, 1],
                [-2, 1, 1, 0, 1, -1, -2]];

    beforeEach(() => {
        game = new Game(new PIXI.Application(20, 20, {view: document.getElementById("gameboard")}));
        board = td.object('Board');
        socket = td.object('AiSocket');
        validate = td.object('Validate');
        UIUpdater = td.object('UIUpdater');

        td.when(board.gameboardTo2dArray()).thenReturn(table);
        //td.when(validate.isMovesAvailable()).thenReturn(true);

        game.board = board;
        game.socket = socket;
        game.validate = validate;
        game.uiUpdater = UIUpdater;
    });

    it('sends table to ai when turn ends', () => {
        game.checkIfRoundEnds = td.function('checkIfRoundEnds');

        game.turn = -1;
        game.aiColor = 1;
        game.changeTurn();

        td.verify(socket.sendTable(table, 1), {times: 1});
    });

    it('sets the turn correctly at first turn', () => {
        td.when(board.startingTurn()).thenReturn(1);

        game.startFirstTurn();

        assert.equal(game.turn, 1);
    });

    it('starts a new round when there have been over 30 rounds without a hit', () => {
        td.when(validate.isMovesAvailable(td.matchers.anything(), td.matchers.anything())).thenReturn(true);

        game.turnCounter = 30;

        game.checkIfRoundEnds();

        td.verify(board.generateStartingBoard());
        td.verify(socket.sendStartRound(td.matchers.anything(), td.matchers.anything()), {times: 1});
    });

    it('skips a round when there are no possible moves', () => {
        td.when(validate.isMovesAvailable(td.matchers.anything(), td.matchers.anything())).thenReturn(false);

        game.turn = 1;
        game.roundskipped = 0;
        game.aiColor = -1;

        game.checkIfRoundEnds();

        assert.equal(game.roundskipped, 1);

        td.verify(socket.sendStartRound(td.matchers.anything(), td.matchers.anything()), {times: 0});
    });

    it('starts a new round when there are no moves available and round has been skipped', () => {
        td.when(validate.isMovesAvailable(td.matchers.anything(), td.matchers.anything())).thenReturn(false);

        game.turn = 1;
        game.roundskipped = 1;
        game.aiColor = -1;

        game.checkIfRoundEnds();

        td.verify(board.generateStartingBoard());
        td.verify(socket.sendStartRound(td.matchers.anything(), td.matchers.anything()));
    });

    it('resets the skip counter after a successful move', () => {
        td.when(validate.isMovesAvailable(td.matchers.anything(), td.matchers.anything())).thenReturn(true);

        game.roundskipped = 1;

        game.checkIfRoundEnds();

        assert.equal(game.roundskipped, 0);
    });
    
    it('draw with big triangles', () => {
        var drawBig = [[-2, 0, 0, 0, 0, 1, -2],
                    [0, 1, 1, 0, 1, 1, 0],
                    [-1, 1, 0, 1, 1, 1, -1],
                    [1, 0, 0, 0, 0, 0, 1],
                    [0, 1, 0, 0, 0, 0, 0],
                    [1, 0, 1, -1, 1, 1, 1],
                    [-2, 1, 1, 1, 1, -1, -2]];
        td.when(board.gameboardTo2dArray()).thenReturn(drawBig);
        td.when(validate.trianglesFound(td.matchers.anything(), td.matchers.anything(), td.matchers.anything(), td.matchers.anything())).thenReturn(3);

        game.calculatePoints();

        assert.equal(game.bluePoints, 0);
        assert.equal(game.redPoints, 0);
    });

    it('red wins', () => {
        var reds = [[-2, 0, 0, 0, 0, 1, -2],
                    [0, 1, 1, 0, 1, 1, 0],
                    [0, 1, 0, 1, 1, 1, 0],
                    [1, 0, 0, 0, 0, 0, 1],
                    [0, 1, 0, 0, 0, 0, 0],
                    [1, 0, 1, 0, 1, 1, 1],
                    [-2, 1, 1, 1, 1, 0, -2]];
        td.when(board.gameboardTo2dArray()).thenReturn(reds);
        td.when(validate.trianglesFound(td.matchers.anything(), td.matchers.anything(), td.matchers.anything(), td.matchers.anything())).thenReturn(3);

        game.calculatePoints();

        assert.equal(game.redPoints, 51);
        assert.equal(game.bluePoints, 0);
    });

    it('draw with no triangles', () => {
        var drawNo = [[-2, 0, 1, 0, -1, 0, -2],
                    [1, 1, 1, 0, -1, -1, -1],
                    [0, 0, 0, 0, 0, 0, 0],
                    [1, 1, 1, 0, -1, -1, -1],
                    [0, 0, 0, 0, 0, 0, 0],
                    [1, 1, 1, 0, -1, -1, -1],
                    [-2, 0, 1, 0, -1, 0, -2]];
        td.when(board.gameboardTo2dArray()).thenReturn(drawNo);
        td.when(validate.trianglesFound(td.matchers.anything(), td.matchers.anything(), td.matchers.anything(), td.matchers.anything())).thenReturn(3);

        game.calculatePoints();

        assert.equal(game.bluePoints, 0);
        assert.equal(game.redPoints, 0);
    });

    it('draw with small triangles', () => {
        var drawSmall = [[-2, 0, 0, 0, 0, 1, -2],
                    [0, 0, 0, 0, 1, 0, 1],
                    [0, 0, 0, 0, 0, 0, 0],
                    [0, 0, 0, 0, 0, 0, 0],
                    [0, 0, 0, 0, 0, 0, 0],
                    [-1, 0, -1, 0, 0, 0, 0],
                    [-2, -1, 0, 0, 0, 0, -2]];
        td.when(board.gameboardTo2dArray()).thenReturn(drawSmall);
        td.when(validate.trianglesFound(td.matchers.anything(), td.matchers.anything(), td.matchers.anything(), td.matchers.anything())).thenReturn(3);

        game.calculatePoints();

        assert.equal(game.bluePoints, 0);
        assert.equal(game.redPoints, 0);
    });
});
