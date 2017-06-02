var aisocket;

import { updateBoard } from './Launcher.js';
import { sprites } from './Launcher.js';

class AiSocket {
    constructor() {
        //const server = 'wss://xoliba-ai-staging.herokuapp.com/ai';
        const server = 'ws://localhost:4567/ai';

        aisocket = new WebSocket(server);
        //aisocket.send(JSON.stringify({ type: "ping" }))
        

        aisocket.onmessage = function(event) {
            var latestTable = JSON.parse(event.data);
            console.log(event.data);
            updateBoard(latestTable, true);
        };

        aisocket.onopen = function() {
            console.log("connected to ai server");
            setInterval(ping, 60000);
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
            }
        }
    }

    sendTable(table) {
        let msg = {
            type: "message",
            table: table
        }
        aisocket.send(JSON.stringify(msg));
    }
}

export { AiSocket };
