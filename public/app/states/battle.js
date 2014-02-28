define(['Phaser', 'io', 'app/math.js', 'app/game.js', 'app/global.js', 'shared/logic.js'], function(Phaser, io, math, game, global, logic) {

    var cursors;
    var player;
    var enemies;
    var gameSprites = {}; //I will put all the ship sprites here

    var serverState = null;
    var gameStarted = false;
    var initializationPacket = null;
    var socket = io.connect();

    function updateFromServerState(state) {
        if (!state) {
            return;
        }
        var i = 0,
            sprite;
        for (i = state.length - 1; i >= 0; i--) {
            sprite = gameSprites[state[i].id];
            if (!sprite) {
                continue;
            }
            sprite.x = state[i].x;
            sprite.y = state[i].y;
            sprite.rotation = state[i].rotation;
        }
    }

    function handleKeys() {
        var keys = {};
        var toSend = false;
        if (cursors.up.isDown) {
            keys.up = true;
            toSend = true;
        }

        if (cursors.left.isDown) {
            keys.left = true;
            toSend = true;
            logic.rotateLeft(player);
        } else if (cursors.right.isDown) {
            keys.right = true;
            toSend = true;
            logic.rotateRight(player);
        }

        if (toSend) {
            socket.emit('client-keys-pressed', keys);
        }
    }

    function createEnemy(data) {
        var enemy = enemies.create(data.x, data.y, 'enemy-ship');
        enemy.anchor.setTo(0.2, 0.5);
        enemy.rotation = data.rotation;
        enemy.serverId = data.id;
        gameSprites[data.id] = enemy;
    }

    var battle = {

        preload: function() {
            game.load.image('player-ship', 'assets/sprites/player.png');
            game.load.image('enemy-ship', 'assets/sprites/ship.png');
            game.stage.disableVisibilityChange = true;
        },

        create: function() {
            cursors = game.input.keyboard.createCursorKeys();
            player = game.add.sprite(0, 0, 'player-ship');
            player.anchor.setTo(0.2, 0.5);
            player.kill();
            enemies = game.add.group();

            socket.on('server-state', function(state) {
                serverState = state;
            });

            socket.on('server-initialize', function(data) {
                var i;
                player.serverId = data.id;
                for (i = 0; i < data.data.length; i++) {
                    if (data.data[i].id === player.serverId) {
                        player.reset(data.data[i].x, data.data[i].y);
                        player.rotation = data.data[i].rotation;
                        gameSprites[data.id] = player;

                    } else {
                        createEnemy(data.data[i]);
                    }

                }

                gameStarted = true;
            });

            socket.on('server-player-connected', function(data) { //This happens when other player connects
                var enemy = enemies.create(data.x, data.y, 'enemy-ship');
                enemy.anchor.setTo(0.2, 0.5);
                enemy.rotation = data.rotation;
                enemy.serverId = data.id;
                gameSprites[data.id] = enemy;
            });

            socket.on('server-player-disconnected', function(data) {
                var enemy = gameSprites[data.id];
                if (enemy) {
                    enemy.kill();
                }
                delete gameSprites[data.id];
            });

            socket.emit("client-ready"); //Signal the server that this client is ready to accept data
        },

        update: function() {
            if (!gameStarted) {
                return;
            }
            var keys = {};
            updateFromServerState(serverState);
            serverState = null;
            handleKeys();

        }
    };

    return battle;
});