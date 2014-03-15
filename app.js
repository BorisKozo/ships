var express = require('express');
var http = require('http');
var io = require('socket.io');
var app = express();
var server = http.createServer(app);
var socketServer = io.listen(server);
var game = require('./server/game');


app.use(express.static(__dirname + '/public'));


socketServer.set('log level', 1);
game.initialize(socketServer);


server.listen(8000);
console.log("Starting server on port 8000");