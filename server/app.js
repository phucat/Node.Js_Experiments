var app = require('express')(),
  	server = require('http').createServer(app),
  	io = require('socket.io').listen(server),
	fs = require('fs'),
  	util = require('util');

server.listen(8080);
		
io.set('transports', [
     'websocket'	
	, 'jsonp-polling'
   	, 'flashsocket'	
   	, 'htmlfile'
   	, 'xhr-polling'
   
]);

io.sockets.on('connection', function (socket) {
	//io.sockets.emit('news', { hello: 'world' });
	socket.on('moving', function (data) {
		console.log(data);
		socket.broadcast.emit('move it', { ascii: data.ascii});
	});
});

app.get('/', function (req, res) {	
  	res.sendfile(__dirname + '/index.html');
});

//app.get('/:message', function (req, res) {
//	var message = req.params.message;
//	io.sockets.emit('messages', { subject: message });
//	res.end();
//});

app.get('/move/', function (req, res) {
	res.sendfile(__dirname + '/move.html');
});


app.get('/stream/:filename/type/:type', function (req, res) {
	
	if(req.params.type == 'audio')	{
		path = '../../MP3/Mp3/' + req.params.filename + '.mp3';
		contentType = 'audio/mp3';	//TODO : Check file type to serve audio or video and change Content-Type
	}	else {
		path = 'video.mp4';
		contentType = 'video/mp4';	//TODO : Check file type to serve audio or video and change Content-Type
	}
	
	var stat = fs.statSync(path);
	var total = stat.size;

	
	if (req.headers['range']) {
		var range = req.headers.range;
		var parts = range.replace(/bytes=/, "").split("-");
		var partialstart = parts[0];
		var partialend = parts[1];
		
		var start = parseInt(partialstart, 10);
		var end = partialend ? parseInt(partialend, 10) : total-1;
		var chunksize = (end-start)+1;
		console.log('RANGE: ' + start + ' - ' + end + ' = ' + chunksize);
		
		var file = fs.createReadStream(path, {start: start, end: end});
		res.writeHead(206, { 'Content-Range': 'bytes ' + start + '-' + end + '/' + total, 'Accept-Ranges': 'bytes', 'Content-Length': chunksize, 'Content-Type': contentType });
		file.pipe(res);
	} else {		
		console.log('ALL: ' + total);
		res.writeHead(200, { 'Content-Length': total, 'Content-Type': contentType });
		fs.createReadStream(path).pipe(res);
	}
});
