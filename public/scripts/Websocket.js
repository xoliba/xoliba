var aisocket;
var latestTable;

import { updateBoard } from './Launcher.js';
import { sprites } from './Launcher.js';

class AiSocket {
    constructor() {
        /*const server = 'wss://xoliba-ai-staging.herokuapp.com/ai';
        //const server = 'ws://localhost:4567/ai';

        aisocket = new WebSocket(server);
        aisocket.onmessage = function(event) {
            latestTable = JSON.parse(event.data);
            console.log(event.data);
            updateBoard(latestTable, true);
        };*/
    }


    getSocket() {
        return aisocket;
    }

    sendTable(table) {
        aisocket.send(JSON.stringify(table));
    }

    getTable() {
        return latestTable;
    }
}

export { AiSocket };
