import { Game } from './Game.js';

var game;
var aisocket;

class AiSocket {


    constructor(newGame) {
        this.game = newGame;
        //const server = 'wss://xoliba-ai-staging.herokuapp.com/ai';
        const server = 'ws://localhost:4567/ai';

        aisocket = new WebSocket(server);

        aisocket.onmessage = (event, turnHandler) => {
            let msg = JSON.parse(event.data);
            if (msg.type === "startRound") {
                this.game.aiSurrender(msg.surrender);
            } else {
                console.log("AI did move " + msg.didMove + "; start " + msg.start + "; target " + msg.target + "; corners " + msg.corners)
                this.game.aiTurn(msg.didMove, msg.start, msg.target, msg.corners, msg.surrender);
            }
        };

        aisocket.onopen = function() {
            console.log("connected to ai server");
            setInterval(ping, 30000);
        }

        aisocket.onclose = function() {
            console.log("disconnected from ai server");
        }

        function ping() {
            let msg = {
                type: "ping"
            }

            if (aisocket.readyState === 1) {
                aisocket.send(JSON.stringify(msg));
                console.log("ping");
            }
        }
    }

    sendTable(table, aiColor, giveUp) {
        let msg = {
            type: "message",
            board: table,
            color: aiColor,
            start: null,
            target: null,
            didMove: true,
            surrender: giveUp
        }
        console.log("send table");
        aisocket.send(JSON.stringify(msg));
    }

    sendStartRound(table, aiColor) {
        let msg = {
            type: "startRound",
            board: table,
            color: aiColor,
            start: null,
            target: null,
            didMove: true,
            surrender: null
        }
        console.log("send starting round");
        aisocket.send(JSON.stringify(msg));

        }

}


export { AiSocket };
