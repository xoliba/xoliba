let assert = require('assert');
import { Board } from '../public/scripts/Board.js';
import { AiSocket } from '../public/scripts/Websocket.js';
import { Game } from '../public/scripts/Game.js';
import { Validations } from '../public/scripts/logic/Validations.js';
import { InfoConsole } from '../public/scripts/InfoConsole.js';
import { UIUpdater } from '../public/scripts/UIUpdater.js';
import * as PIXI from 'pixi.js';

    

describe('Game', () => {

    let game;
    let board;
    let socket;
    let validate;
    let infoConsole;
    let UIUpdater;

    beforeEach(() => {
        game = new Game(new PIXI.Application(20, 20, {view: document.getElementById("gameboard")}));
        board = td.object('Board');
        socket = td.object('AiSocket');
        validate = td.object('Validate');
        UIUpdater = td.object('UIUpdater');

        td.when(board.gameboardTo2dArray()).thenReturn(new Array());
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

        td.verify(board.gameboardTo2dArray());
        td.verify(socket.sendTable([], 1));
    });

    it('sets the turn correctly at first turn', () => {
        td.when(board.startingTurn()).thenReturn(1);

        game.startFirstTurn();

        assert.equal(game.turn, 1);
    });

    /*it('starts a new round when there are no moves available', () => {
        var startNewRound = td.function('startNewRound');
        var updatePoints = td.function('updatePoints');
        game.startNewRound = startNewRound;
        game.updatePoints = updatePoints;

        td.when(validate.isMovesAvailable()).thenReturn(false);

        game.checkIfRoundEnds();

        td.verify(startNewRound());
    });*/
});
