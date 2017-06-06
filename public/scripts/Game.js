import { Board } from './Board.js';
import { AiSocket } from './Websocket.js';

let board;
let turn;
let redPoints;
let bluePoints;
let socket;
let turnHandler;

class Game {
    constructor(app) {
        this.board = new Board(app);
        this.redPoints = 0;
        this.bluePoints = 0;
        this.socket = new AiSocket();
        this.turnHandler = new turnHandler(board);
    }

    changeTurn() {
        if (this.turn === 1) {
            this.turn = -1;
        } else if (this.turn === -1) {
            this.socket.sendTable(this.board.gameboardTo2dArray());
            this.turn = 1;
        }
    }

    get turn() {
        return this.turn;
    }
}