var server = 'ws://127.0.0.1:4567/echo'; // korjaa herokuun
var aisocket = new WebSocket(server);

aisocket.onmessage = function(event) {
	console.log(event.data);
}
