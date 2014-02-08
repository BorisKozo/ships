define(['Phaser', 'io', 'app/math.js', 'app/game.js', 'app/global.js'], function(Phaser, io, math, game, global) {


    var cursors;
    var player;
    var serverState = null;
    var gameStarted = false;
    var initializationPacket = null;
    var socket = io.connect('http://ships.cloudapp.net:8000/');

    function updateFromServerState(state) {
        if (!state) {
            return;
        }
        player.x = state[0].x || player.x;
        player.y = state[0].y || player.y;
        player.rotation = state[0].rotation || player.rotation;
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
        } else if (cursors.right.isDown) {
            keys.right = true;
            toSend = true;
        }

        if (toSend) {
            socket.emit('client-keys-pressed', keys);
        }
    }

    var battle = {

        preload: function() {
            game.load.image('ship', 'assets/sprites/ship.png');
        },

        create: function() {
            cursors = game.input.keyboard.createCursorKeys();
            player = game.add.sprite(0, 0, 'ship');
            player.anchor.setTo(0.2, 0.5);
            player.kill();

            socket.on('server-state', function(state) {
                serverState = state;
            });

            socket.on('server-initialize', function(data) {
                player.reset(data.x, data.y);
                player.rotation = data.rotation;
                gameStarted = true;
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