import { Board } from '../public/scripts/Board.js';
import { AiSocket } from '../public/scripts/Websocket.js';
import { Game } from '../public/scripts/Game.js';
import * as PIXI from 'pixi.js';

describe('Game', () => {

    let game;

    beforeEach(() => {
        game = new Game(new PIXI.Application(20, 20, {view: document.getElementById("gameboard")}));
        //game.board = td.object('Board');
        game.socket = td.object('AiSocket');
    });

/*    it('Ending turn works', function() {
        game.changeTurn();
        console.log("HALOo" + game.redPoints + " " + game.bluePoints);
    });*/

});
