var express = require('express');
var http = require('http');
var io = require('socket.io');
var app = express();
var server = http.createServer(app);
var socketServer = io.listen(server);
var players = require('./server/players');

app.use(express.static(__dirname + '/public'));



socketServer.sockets.on('connection', function (socket) {
  players.addPlayer(socket);
});

server.listen(3000);
console.log("Starting server on port 3000");