
module.exports = (function() {
    var logic = require('./../public/shared/logic');
    var players;
    var playerList = [];
    var id = 0;



    function initializeConstants(player) {
        player.x = 200;
        player.y = 200;
        player.rotation = 0;
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

    Player.prototype.initialize = function() {

        console.log("Initialized player - ", this.id);
        this.socket.emit("server-initialize", {
          id:this.id,
          data:players.getCurrentState()
          });
    };

    Player.prototype.getCurrentState = function() {
        return {
            x: this.x,
            y: this.y,
            rotation: this.rotation,
            id: this.id
        };
    };


    players = {
        addPlayer: function(socket) {
            var player = new Player(socket);
            playerList.push(player);

            socket.on('client-ready', function() {
                player.initialize();
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
        }
    };
    return players;
}());