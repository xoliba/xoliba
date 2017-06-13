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

        game.board = board;
        game.socket = socket;
        game.validate = validate;
    });

    it('Ending turn works', () => {
        game.changeTurn();
        td.verify(board.gameboardTo2dArray());
        console.log("HALOo" + game.redPoints + " " + game.bluePoints);
    });

});
