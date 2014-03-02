module.exports = (function(){
	
var players = require('./players');

var socketServer;


function gameLoop(){
  players.update();
	socketServer.sockets.emit('server-state',players.getCurrentState());
}

var game = {
	initialize: function(socket){
	   socketServer = socket;
       socketServer.sockets.on('connection', function (socket) {
           var player = players.addPlayer(socket);
           socket.broadcast.emit('server-player-connected',player.getCurrentState());
        });
        
        setInterval(gameLoop,16);
		
	}
};

return game;


}());