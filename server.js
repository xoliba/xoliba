var express = require('express');
var app = express();

app.set('port', (process.env.PORT || 5000));

app.use(express.static(__dirname + '/public'));

app.set('views', __dirname + '/public');
app.set('view engine', 'ejs');

var server = require('http').createServer(app);
var io = require('socket.io')(server);

var WebSocketClient = require('websocket').client;
var aisocket = new WebSocketClient();


app.get('/', function(req, res) {
	res.render('index')
});

var table;

io.on('connection', function(socket) {
	socket.on('message', function(data) {
		console.log(data);
	});

	socket.on('table', function(data) {
		table = data;
		console.log(table);
		aisocket.connect('ws://127.0.0.1:4567/echo'); // edit for deployment
	});

});

aisocket.on('connect', function(connection) {
	console.log('connected to ai server');
	connection.sendUTF(table);
});

server.listen(app.get('port'), function() {
	console.log('Node running on port', app.get('port'));
});
