var aisocket;

class AiSocket {
    constructor() {
        const server = 'ws://127.0.0.1:4567/echo';
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
