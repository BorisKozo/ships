module.exports = (function(){
  var playerList = [];
  var id = 0;
  
  
  function Player(socket){
    id++;
    this.socket = socket;
    this.id = id;
    this.socket.player = this;
    this.socket.on('client-initialize',function(data){
      this.player.initialize(data);
    });
    socket.on('client-keys-pressed', function (data) {
      if (data.key==='right'){
        this.player.angle+=1;
      }
      if (data.key === 'left'){
        this.player.angle-=1;
      }
      
      console.log("keys pressed ",data);
   });

  }
  
  Player.prototype.initialize = function(data){
    this.x = data.x;
    this.y = data.y;
    this.angle = data.angle;
  };
  
  Player.prototype.getCurrentState = function(){
    return {
  	  x:this.x,
  	  y:this.y,
  	  angle:this.angle
  	}
  };
  
  
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
      });
    },
    getCurrentState: function(){
    	var result = [];
    	var i;
    	for (i=0; i<playerList.length;i++){
    		result.push(playerList[i].getCurrentState());
    	}
    	return result;
    }
  };
  return players;
}());