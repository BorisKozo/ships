module.exports = (function(){
	
var players = require('./players');

var socketServer;


function gameLoop(){
	socketServer.sockets.emit('server-state',players.getCurrentState());
}

var game = {
	initialize: function(socket){
	   socketServer = socket;
       socketServer.sockets.on('connection', function (socket) {
           players.addPlayer(socket);
        });
        
        setInterval(gameLoop,16);
		
	}
};

return game;


})();