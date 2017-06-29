import { UIUpdater } from './ui/UIUpdater.js';

var aisocket;
var uiUpdater;

//todo info about ai that is thinking
class AiSocket {

    constructor(newGame) {
        this.game = newGame;
        connect(newGame);
    }

    sendTurnData(table, aiColor, giveUp, difficulty, turnCounter, redpoints, bluepoints, scorelimit, gameId) {
        let msg = {
            type: "turnData",
            board: table,
            color: aiColor,
            start: null,
            target: null,
            didMove: true,
            surrender: giveUp,
            difficulty: difficulty,
            withoutHit: turnCounter,
            redPoints: redpoints,
            bluePoints: bluepoints,
            scoreLimit: scorelimit,
            gameId: gameId
        };
        console.log("send turnData: ai color " + aiColor + " surrender " + giveUp + " difficulty " + difficulty + " without hits " + turnCounter + " red points " + redpoints + " blue points " + bluepoints + " score limit " + scorelimit + 'gameId sent ' + gameId);
        aisocket.send(JSON.stringify(msg));
    }

    sendStartRound(table, aiColor, difficulty, scoreLimit, gameId) {
        let msg = {
            type: "startRound",
            board: table,
            color: aiColor,
            start: null,
            target: null,
            didMove: true,
            surrender: null,
            difficulty: difficulty,
            scoreLimit: scoreLimit,
            gameId: gameId
        };
        this.waitForSocketToBeOpenBeforeSendingStartRound(msg);
    }

    waitForSocketToBeOpenBeforeSendingStartRound(msg) {
        console.log("ai socket ready state: " + aisocket.readyState);
        let waitForConnectionInterval = setInterval(() => {
            if (aisocket.readyState === 1) {
                console.log("send starting round, color " + msg.color);
                aisocket.send(JSON.stringify(msg));
                clearInterval(waitForConnectionInterval);
            } else {
                console.log("Socket is still not open! Wait for another second");
            }
        }, 1000);
    }
}

    function connect(newGame) {
    uiUpdater = new UIUpdater();

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
    try {
        aisocket = new WebSocket(server);

    } catch(e) {
        uiUpdater = new UIUpdater();
        uiUpdater.disconnectionError("Failed to construct websocket");
    }

    aisocket.onmessage = (event, turnHandler) => {
        let msg = JSON.parse(event.data);

        if (msg.type === "startRound") {
            console.log("got starting round info from AI:\nsurrender: " + msg.surrender + " ai color " + msg.color);
            newGame.aiSurrender(msg.surrender, msg.color);
        } else {
            console.log("AI did move " + msg.didMove + "; start " + msg.start + "; target " + msg.target + "; corners " + msg.corners + "; surrender " + msg.surrender);
            newGame.aiTurn(msg.didMove, msg.start, msg.target, msg.corners, msg.surrender);
        }
    };

    aisocket.onopen = function() {
        console.log("connected to ai server");
        setInterval(ping, 30000);
    }

    aisocket.onclose = function(e) {
        console.log("disconnected from ai server");

        //For some reason onclose function is sometimes called even when theres no disconnection.
        //uiUpdater = new UIUpdater();
        //uiUpdater.disconnectionError("disconnected from ai server");

        console.log('Socket is closed. Reconnecting...');
        setTimeout(function() {
            connect();
        }, 10)
    }

    aisocket.onerror = function (event) {
        uiUpdater = new UIUpdater();
        uiUpdater.disconnectionError(event);
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

export { AiSocket };
