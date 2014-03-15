module.exports = (function() {
    var logic = require('./../public/shared/logic');
    var players;
    var playerList = [];
    var id = 0;



    function initializeConstants(player) {
        player.x = 0;
        player.y = 0;
        player.rotation = 0;
        player.shot = null;
    }

    function attachSocketHandlers(player) {

        player.socket.on('client-keys-pressed', function(keys) {
            if (keys.right) {
                logic.rotateRight(this.player);
            } else {
                if (keys.left) {
                    logic.rotateLeft(this.player);
                }
            }

            if (keys.up) {
                logic.moveForward(this.player);
            }
            
            if (keys.shoot){
              if (logic.canShoot(player)){
                player.shot = {
                  x:player.x,
                  y:player.y,
                  rotation:player.rotation
                };
              }
            }

            //console.log("keys pressed ", keys);
        });
    }

    function Player(socket) {
        id++;
        this.socket = socket;
        this.id = id;
        this.socket.player = this;
        initializeConstants(this);
        attachSocketHandlers(this);


    }

    Player.prototype.initialize = function(data) {
        var name = data.name ? data.name : 'player '+this.id;
        console.log('Initialized player - ', name," (", this.id,')');
        this.socket.emit('server-initialize', {
          id:this.id,
          name:name,
          data:players.getCurrentState()
          });
    };

    Player.prototype.getCurrentState = function() {
        return {
            x: this.x,
            y: this.y,
            rotation: this.rotation,
            id: this.id,
            shot: this.shot
        };
    };
    
    Player.prototype.update = function(){
      if (this.shot){
        logic.moveShot(this.shot);
        if (logic.isShotOutOfBounds(this.shot)){
          this.shot = null;
        }
      }
    };


    players = {
        addPlayer: function(socket) {
            var player = new Player(socket);
            playerList.push(player);

            socket.on('client-ready', function(data) {
                player.initialize(data);
            });

            socket.on('disconnect', function() {
                var i;
                for (i = 0; i < playerList.length; i++) {
                    if (playerList[i] && playerList[i].id === player.id) {
                        playerList.splice(i, 1);
                        console.log("Deleted player " + player.id);
                        break;
                    }
                }
                socket.broadcast.emit('server-player-disconnected',{id:player.id});
            });

            return player;
        },
        getCurrentState: function() {
            var result = [];
            var i;
            for (i = 0; i < playerList.length; i++) {
                result.push(playerList[i].getCurrentState());
            }
            return result;
        },
        update: function(){
            var i;
            for (i = 0; i < playerList.length; i++) {
                playerList[i].update();
            }
        }
    };
    return players;
}());