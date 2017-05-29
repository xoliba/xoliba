var aisocket;
var latestTable;

class AiSocket {
    constructor() {
        const server = 'wss://xoliba-ai.herokuapp.com/ai';
        aisocket = new WebSocket(server);

        aisocket.onmessage = function(event) {
            latestTable = event.data;
            console.log(event.data);
        };
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
