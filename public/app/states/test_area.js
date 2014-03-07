define(['Phaser', 'io', 'app/math.js', 'app/game.js', 'app/global.js'], function(Phaser, io, math, game, global) {


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

            game.input.keyboard.addKeyCapture([
            Phaser.Keyboard.LEFT,
            Phaser.Keyboard.RIGHT,
            Phaser.Keyboard.UP,
            Phaser.Keyboard.DOWN,
            Phaser.Keyboard.SPACEBAR]);

        },

        update: function() {

        }
    };

    return battle;
});