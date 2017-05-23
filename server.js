var express = require('express');
var app = express();

app.set('port', (process.env.PORT || 5000));

app.use(express.static(__dirname + '/public'));

app.set('views', __dirname + '/public');
app.set('view engine', 'ejs');

var server = require('http').createServer(app);
var io = require('socket.io')(server);

app.get('/', function(req, res) {
	res.render('index')
});

io.on('connection', function(socket) {
	socket.on('message', function(data) {
		console.log(data);
	});

	socket.on('table', function(data) {
		console.log(data);
	});
});

server.listen(app.get('port'), function() {
	console.log('Node running on port', app.get('port'));
});
