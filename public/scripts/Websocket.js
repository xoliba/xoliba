import { Game } from './Game.js';

//var game;
var aisocket;

class AiSocket {

    constructor(turnHandler) {
        //const server = 'wss://xoliba-ai-staging.herokuapp.com/ai';
        const server = 'ws://localhost:4567/ai';

        aisocket = new WebSocket(server);

        aisocket.onmessage = (event) => {
            let msg = JSON.parse(event.data);
            console.log("AI did move " + msg.didMove + "; start " + msg.start + "; target " + msg.target + "; corners " + msg.corners)
            turnHandler.aiTurn(msg.didMove, msg.start, msg.target, msg.corners);
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

    sendTable(table, aiColor) {
        let msg = {
            type: "message",
            board: table,
            color: aiColor,
            start: null,
            target: null,
            didMove: true
        }
        console.log("HALOO");
        aisocket.send(JSON.stringify(msg));
    }
}


export { AiSocket };
