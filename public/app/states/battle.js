define(['Phaser', 'io', 'app/math.js', 'app/game.js', 'app/global.js'], function(Phaser, io, math, game, global) {


    var cursors;
    var player;
    var serverState = null;

    var socket = io.connect('http://ships.cloudapp.net:8000/');

    function updateFromServerState(state) {
        if (!state) {
            return;
        }
        player.x = state[0].x || player.x;
        player.y = state[0].y || player.y;
        player.rotation = state[0].rotation || player.rotation;
    }

    var battle = {

        preload: function() {
            game.load.image('ship', 'assets/sprites/ship.png');
        },

        create: function() {
            cursors = game.input.keyboard.createCursorKeys();
            player = game.add.sprite(math.randomIntInRange(100, 600), 200, 'ship');
            player.anchor.setTo(0.2, 0.5);
            socket.emit('client-initialize', {
                x: player.x,
                y: player.y,
                rotation: player.rotation
            });

            socket.on('server-state', function(state) {
                serverState = state;
            });
        },

        update: function() {

            var keys = {};
            updateFromServerState(serverState);
            serverState = null;

            if (cursors.up.isDown) {
                keys.up = true;
            }

            if (cursors.left.isDown) {
                keys.left = true;
            } else if (cursors.right.isDown) {
                keys.right = true;
            }

            socket.emit('client-keys-pressed', keys);
        }
    };

    return battle;
});