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
        player.score = 0;
        player.hp = 100;
        player.deathTimer = 0;
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

            if (keys.shoot) {
                if (logic.canShoot(player)) {
                    player.shot = {
                        x: player.x,
                        y: player.y,
                        rotation: player.rotation
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
        var name = data.name ? data.name : 'Player ' + this.id;
        this.name = name;
        console.log('Initialized player - ', name, " (", this.id, ')');
        this.socket.emit('server-initialize', {
            id: this.id,
            data: players.getCurrentState()
        });
    };

    Player.prototype.getCurrentState = function() {
        return {
            x: this.x,
            y: this.y,
            rotation: this.rotation,
            id: this.id,
            shot: this.shot,
            hp: this.hp,
            score: this.score,
            name: this.name,
            deathTimer: this.deathTimer
        };
    };

    Player.prototype.update = function() {
        if (this.shot) {
            logic.moveShot(this.shot);
            if (logic.isShotOutOfBounds(this.shot)) {
                this.shot = null;
            }
        }
        
        if (this.deathTimer){
            this.deathTimer -= 1;
        }
    };

    function withinDistance(x1, y1, x2, y2, distance) {
      return Math.pow(distance, 2) > (Math.pow((x1 - x2), 2) + Math.pow((y1 - y2), 2));
    }


    function areColliding(shot, player){
       return withinDistance(shot.x, shot.y, player.x, player.y, 15);
    }
    
    function doShotsCollisions() {
        var i, j;
        for (i = 0; i < playerList.length; i++) {
            if (!playerList[i].shot) {
                continue;
            }
            for (j = 0; j < playerList.length; j++) {
                if ((i !== j) && playerList[j].deathTimer === 0 && areColliding(playerList[i].shot,playerList[j])){
                    playerList[i].shot = null;
                    playerList[i].score += 1;
                    playerList[i].hp = 100; //Fill the HP of the player who killed someone
                    playerList[j].deathTimer = 200;
                }
            }
        }
    }

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
                socket.broadcast.emit('server-player-disconnected', {
                    id: player.id
                });
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
        update: function() {
            var i;
            for (i = 0; i < playerList.length; i++) {
                playerList[i].update();
            }
            doShotsCollisions();
        }

    };
    return players;
}());