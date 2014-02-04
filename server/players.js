module.exports = (function(){
  var playerList = [];
  var id = 0;
  
  
  function Player(socket){
    id++;
    this.socket = socket;
    this.id = id;
    this.socket.player = this;
    this.socket.on('init',function(data){
      this.player.initialize(data);
    });
//    socket.on('client-message', function (data) {
//      socketServer.sockets.emit('server-message', data);
//  });

  }
  
  Player.prototype.initialize = function(data){
    this.x = data.x;
    this.y = data.y;
    this.angle = data.angle;
  }
  
  var players = {
    addPlayer: function(socket){
      var player = new Player(socket);
      playerList.push(player);
      
      socket.on('disconnect', function() {
        var i;
        for (i=0; i< playerList.length; i++){
          if (playerList[i] && playerList[i].id === player.id){
            playerList.splice(i, 1);
            console.log("Deleted player "+player.id);
            return;
          }
        }
      }
    }
  }
  return players
})();