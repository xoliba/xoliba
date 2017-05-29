var aisocket;

class AiSocket {
    constructor() {
        const server = 'wss://xoliba-ai.herokuapp.com/ai';
        aisocket = new WebSocket(server);

        aisocket.onmessage = function(event) {
            console.log(event.data);
        };
    }

    getSocket() {
        return aisocket;
    }
}

export { AiSocket };
