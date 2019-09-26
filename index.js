const express = require('express');
const app = express();
const http = require('http').Server(app);
const io = require('socket.io')(http);

var clients = [];

app.get('/', function(req, res) {
  res.sendFile(__dirname + '/index.html');
});

io.sockets.on('connection', function(socket) {

    socket.on('username', function(username) {
        socket.username = username;
        clients.push(socket.username)
        io.emit('is_online', '🔵 <i>' + socket.username + ' join the chat..</i>');
        io.emit('username', clients);
    });

    socket.on('disconnect', function(username) {
      clients.splice(clients.indexOf(socket.username), 1);
        io.emit('is_online', '🔴 <i>' + socket.username + ' left the chat..</i>');
        io.emit('username', clients);
    })

    socket.on('chat_message', function(message) {
        io.emit('chat_message', '<strong>' + socket.username + '</strong>: ' + message);
    });

});

const server = http.listen(8080, function() {
    console.log('listening on *:8080');
});
