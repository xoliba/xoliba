import { Board } from './Board.js';
import { AiSocket } from './Websocket.js';
import { TurnHandler } from './TurnHandler';

let board;
let turn;
let redPoints;
let bluePoints;
let socket;
let turnHandler;

class Game {
    constructor(app) {
        this.turnHandler = new TurnHandler(false, this);
        this.board = new Board(app, this.turnHandler);
        this.redPoints = 0;
        this.bluePoints = 0;
        this.socket = new AiSocket(this);
        this.turnHandler.board = this.board;
        this.turn = -1;
    }

    changeTurn() {
        if (this.turn === 1) {
            this.turn = -1;
        } else if (this.turn === -1) {
            this.turn = 1;
            this.socket.sendTable(this.board.gameboardTo2dArray());  
        }
    }

    aiTurn(start, target, corners) {
        this.turnHandler.aiTurn(start, target, corners);
    }


    /*get turn() {
        return this.turn;
    }*/
}


export { Game };