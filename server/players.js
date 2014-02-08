module.exports = (function() {
    var playerList = [];
    var id = 0;

    function initializeConstants(player){
      player.metadata = {
        topSpeed:1
      };
    }

    function attachSocketHandlers(player){
              player.socket.on('client-initialize', function(data) {
            this.player.initialize(data);
        });
        
        player.socket.on('client-keys-pressed', function(keys) {
            if (keys.right) {
                this.player.rotation += 0.02;
            } else {
                if (keys.left) {
                    this.player.rotation -= 0.02;
                }
            }
            
            if (keys.up){
              this.player.x += Math.cos(this.player.rotation)*this.player.metadata.topSpeed;
              this.player.y += Math.sin(this.player.rotation)*this.player.metadata.topSpeed;
            }

            console.log("keys pressed ", keys);
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
        this.x = data.x;
        this.y = data.y;
        this.rotation = data.rotation;
    };

    Player.prototype.getCurrentState = function() {
        return {
            x: this.x,
            y: this.y,
            rotation: this.rotation
        };
    };


    var players = {
        addPlayer: function(socket) {
            var player = new Player(socket);
            playerList.push(player);

            socket.on('disconnect', function() {
                var i;
                for (i = 0; i < playerList.length; i++) {
                    if (playerList[i] && playerList[i].id === player.id) {
                        playerList.splice(i, 1);
                        console.log("Deleted player " + player.id);
                        return;
                    }
                }
            });
        },
        getCurrentState: function() {
            var result = [];
            var i;
            for (i = 0; i < playerList.length; i++) {
                result.push(playerList[i].getCurrentState());
            }
            return result;
        }
    };
    return players;
}());