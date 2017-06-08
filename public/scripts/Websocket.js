var aisocket;

//import { updateBoard } from './Launcher.js';
//import { sprites } from './Launcher.js';
import { Game } from './Game.js';
var game;
class AiSocket {

    constructor(gamee) {
        game = gamee;

        const server = 'wss://xoliba-ai-staging.herokuapp.com/ai';
        //const server = 'ws://localhost:4567/ai';

        aisocket = new WebSocket(server);
        //aisocket.send(JSON.stringify({ type: "ping" }))

        aisocket.onmessage = function(event) {
            let msg = JSON.parse(event.data);
            game.aiTurn(msg.didMove, msg.start, msg.target, msg.corners);
            
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

    sendTable(table) {
        /*
        let msg = {
            type: "message",
            table: table
        }
        aisocket.send(JSON.stringify(msg));
        */
        aisocket.send(JSON.stringify(table));
    }

}  

export { AiSocket };
