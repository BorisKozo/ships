define(['Phaser', 'io', 'app/math.js', 'app/game.js', 'app/global.js', 'shared/logic.js'], function(Phaser, io, math, game, global, logic) {

    var cursors;
    var player;
    var enemies;
    var shots;
    var gameSprites = {}; //I will put all the ship sprites here

    var serverState = null;
    var gameStarted = false;
    var initializationPacket = null;
    var socket = io.connect();

    function shoot(sprite, shotData) {

        var shotSprite = shots.create(shotData.x, shotData.y, 'enemy-shot');
        shotSprite.anchor.setTo(0.5, 0.5);
        shotSprite.rotation = shotData.rotation;
        shotSprite.serverId = sprite.serverId;
        sprite.shot = shotSprite;
    }

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
            if (state[i].shot !== null) { //Server thinks there is a shot
                if (sprite.shot === null) { //But we have no shot
                    shoot(sprite, state[i].shot); //Generate shot
                } else { // We have a shot
                    sprite.shot.x = state[i].shot.x;
                    sprite.shot.y = state[i].shot.y;

                }
            } else { //Server thinks there is no shot
                if (sprite.shot !== null) { // But we have a shot
                    sprite.shot.kill();
                    sprite.shot = null;
                }
            }
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

        if (game.input.keyboard.isDown(Phaser.Keyboard.SPACEBAR)) {
            keys.shoot = true;
            toSend = true;
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
        enemy.shot = null;
        gameSprites[data.id] = enemy;
    }

    function createSocketEvents() {
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
            createEnemy(data);
        });

        socket.on('server-player-disconnected', function(data) {
            var enemy = gameSprites[data.id];
            if (enemy) {
                enemy.kill();
            }
            delete gameSprites[data.id];
        });

        socket.emit("client-ready"); //Signal the server that this client is ready to accept data

    }

    var battle = {

        preload: function() {
            game.load.image('player-ship', 'assets/sprites/player-ship.png');
            game.load.image('enemy-ship', 'assets/sprites/enemy-ship.png');
            game.load.image('player-shot', 'assets/sprites/player-shot.png');
            game.load.image('enemy-shot', 'assets/sprites/enemy-shot.png');

            game.stage.disableVisibilityChange = true;
        },

        create: function() {
            cursors = game.input.keyboard.createCursorKeys();
            player = game.add.sprite(0, 0, 'player-ship');
            player.anchor.setTo(0.2, 0.5);
            player.kill();
            player.shot = null;
            enemies = game.add.group();
            shots = game.add.group();


            game.input.keyboard.addKeyCapture([
            Phaser.Keyboard.LEFT,
            Phaser.Keyboard.RIGHT,
            Phaser.Keyboard.UP,
            Phaser.Keyboard.DOWN,
            Phaser.Keyboard.SPACEBAR]);

            createSocketEvents();
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