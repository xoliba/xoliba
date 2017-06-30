import { UIUpdater } from './ui/UIUpdater.js';

var aisocket;

//todo info about ai that is thinking
class AiSocket {

    constructor(newGame) {
        
        this.game = newGame;
        connect(newGame, new UIUpdater());
    }

    sendTurnData(table, aiColor, giveUp, difficulty, turnCounter, redpoints, bluepoints, scorelimit, msgId) {
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
            msgId: msgId
        };
        console.log("send turnData: ai color " + aiColor + " surrender " + giveUp + " difficulty " + difficulty + " without hits " + turnCounter + " red points " + redpoints + " blue points " + bluepoints + " score limit " + scorelimit + 'msgId sent ' + msgId);
        
        aisocket.send(JSON.stringify(msg));
    }

    sendStartRound(table, aiColor, difficulty, scoreLimit, msgId) {
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
            msgId: msgId
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

//yes, this must be separated function.
function connect(newGame, uiUpdater) {
    let returnedPong = true;

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
        uiUpdater.disconnectionError();
    }

    aisocket.onmessage = (event, turnHandler) => {
        let msg = JSON.parse(event.data);

        if (msg.type === "startRound") {
            console.log("got starting round info from AI:\nsurrender: " + msg.surrender + " ai color " + msg.color);
            newGame.aiSurrender(msg.surrender, msg.color, msg.msgId);
        } else if(msg.type === "TurnData") {
            console.log("AI did move " + msg.didMove + "; start " + msg.start + "; target " + msg.target + "; corners " + msg.corners + "; surrender " + msg.surrender);
            newGame.aiTurn(msg.didMove, msg.start, msg.target, msg.corners, msg.surrender, msg.msgId);
        } else if(msg.type === "pong") {
            returnedPong = true;
            console.log("Pong!");
        } else console.log("Unknown message received: " + event.data);
    };

    aisocket.onopen = function() {
        console.log("connected to ai server");
        uiUpdater.connectedToAi();
        setInterval(ping, 15000);
    }

    aisocket.onclose = function(e) {
        uiUpdater.stopAiIsThinkingInterval();
        uiUpdater.disconnectionError();
        uiUpdater.reconnectTry();
        console.log('Socket is closed. Reconnecting in 6sec...');
        setTimeout(function() {
            connect(newGame, uiUpdater);
            newGame.resendTurnDataToAI;
        }, 6000)
    }

    aisocket.onerror = function (event) {
        uiUpdater.disconnectionError();
    }

    function ping() {
        let msg = {
            type: "ping"
        };

        if (aisocket.readyState === 1) {
            if(returnedPong === false) {
                console.log("AI didnt answer to the ping. Reconnecting...");
                clearInterval(ping);
                aisocket.close();   //onlclose will handle reconnecting.
            } else {
                returnedPong = false;
                aisocket.send(JSON.stringify(msg));
                console.log("ping");
            }
        }
    }
}

export { AiSocket };
