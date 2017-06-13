import { Board } from '../public/scripts/Board.js';
import { AiSocket } from '../public/scripts/Websocket.js';
import { Game } from '../public/scripts/Game.js';
import { Validations } from '../public/scripts/logic/Validations.js';
import * as PIXI from 'pixi.js';

    

describe('Game', () => {

    let game;
    let board;
    let socket;
    let validate;

    beforeEach(() => {
        game = new Game(new PIXI.Application(20, 20, {view: document.getElementById("gameboard")}));
        board = td.object('Board');
        socket = td.object('AiSocket');
        validate = td.object('Validate');

        td.when(board.gameboardTo2dArray()).thenReturn(new Array());
        td.when(validate.isMovesAvailable()).thenReturn(true);

        game.board = board;
        game.socket = socket;
        game.validate = validate;
    });

    it('sends table to ai when turn ends', () => {
        game.checkIfRoundEnds = td.function('checkIfRoundEnds');

        game.turn = -1;
        game.aiColor = 1;
        game.changeTurn();
        td.verify(board.gameboardTo2dArray());
        //td.verify(validate.isMovesAvailable(1, []));
        td.verify(socket.sendTable([], 1));
    });

});
