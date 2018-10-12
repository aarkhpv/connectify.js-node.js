var app = require('express')(),
  express = require('express'),
  http = require('http').Server(app),
  io = require('socket.io')(http),
  bodyParser = require('body-parser'),
  arraySendedMessages = new Array();

app.use(express.static('public'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.get('/', function (req, res) {
  res.sendFile(__dirname + '/index.html');
});

app.post('/http', function (req, res) {
  var arrayMessagesForSend = [];
  var lastMessageIdOnClient = req.query.id;
  arraySendedMessages.forEach(function(item, i, arraySendedMessages) {
    if (lastMessageIdOnClient == "null") { 
      lastMessageIdOnClient = 0;
    }
    ++i;
    if ( i > lastMessageIdOnClient ) {
      arrayMessagesForSend.push({ id : i, message : item });
    }
  });
  res.send(arrayMessagesForSend);
});

app.post('/newmessage', function (req, res) {
  var id = arraySendedMessages.push(req.body.message);
  io.emit('message', { id : id, message : req.body.message });
  res.send('success');
});

io.on('connection', function (socket) {
  socket.on('disconnect', function () {
  });
});

http.listen(3000, function () {
  console.log('listening on *:3000');
  console.log('http://localhost:3000/');
});