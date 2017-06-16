
var game;
var aisocket;

//todo info about ai that is thinking
//todo bug with popup of skipping turn
class AiSocket {

    constructor(newGame) {
        this.game = newGame;
        //parse URL
        let server;
        let url = window.location.href;
        let name = "ai";
        name = name.replace(/[\[\]]/g, "\\$&");
        let regex = new RegExp("[?&]" + name + "(=([^&#]*)|&|#|$)"), results = regex.exec(url);
        if (!results || !results[2]) server = 'wss://xoliba-ai.herokuapp.com/ai';
        else {
            let parsed = decodeURIComponent(results[2].replace(/\+/g, " "));
            if (parsed === 'localhost') server = "ws://localhost:4567/ai";
            else if (parsed === 'staging') server = "wss://xoliba-ai-staging.herokuapp.com/ai";
            else server = decodeURIComponent(results[2].replace(/\+/g, " "));
        }

        console.log("Trying to connect " + server);
        aisocket = new WebSocket(server);

        aisocket.onmessage = (event, turnHandler) => {
            let msg = JSON.parse(event.data);

            if (msg.type === "startRound") {
                this.game.aiSurrender(msg.surrender);
            } else {
                console.log("AI did move " + msg.didMove + "; start " + msg.start + "; target " + msg.target + "; corners " + msg.corners);
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
            };

            if (aisocket.readyState === 1) {
                aisocket.send(JSON.stringify(msg));
                console.log("ping");
            }
        }
    }

    sendTable(table, aiColor, giveUp) {
        let msg = {
            type: "turnData",
            board: table,
            color: aiColor,
            start: null,
            target: null,
            didMove: true,
            surrender: giveUp,
            difficulty: null
        };
        console.log("send turnData");
        aisocket.send(JSON.stringify(msg));
    }

    sendStartRound(table, aiColor, difficulty) {
        let msg = {
            type: "startRound",
            board: table,
            color: aiColor,
            start: null,
            target: null,
            didMove: true,
            surrender: null,
            difficulty: difficulty
        };
        this.waitForSocketToBeOpenBeforeSendingStartRound(msg);
    }

    waitForSocketToBeOpenBeforeSendingStartRound(msg) {
        console.log("ai socket ready state: " + aisocket.readyState);
        let waitForConnectionInterval = setInterval(() => {
            if (aisocket.readyState === 1) {
                console.log("send starting round");
                aisocket.send(JSON.stringify(msg));
                clearInterval(waitForConnectionInterval);
            } else {
                console.log("Socket is still not open! Wait for another second");
            }
        }, 1000);
    }
}


export { AiSocket };
