define(['Phaser', 'app/game.js', 'shared/logic.js'], function(Phaser, game, logic) {
    'use strict';

    function preload() {
        game.load.image('player-ship', 'assets/sprites/player-ship.png');
        game.load.image('enemy-ship', 'assets/sprites/enemy-ship.png');
        game.load.image('player-shot', 'assets/sprites/player-shot.png');
        game.load.image('enemy-shot', 'assets/sprites/enemy-shot.png');

    }

    function create(type) {
        this.type = type;
        if (type === 'player') {
            this.player = game.add.sprite(0, 0, 'player-ship');
        } else {
            this.player = game.add.sprite(0, 0, 'enemy-ship');
        }
        this.player.anchor.setTo(0.2, 0.5);
        this.player.kill();
        this.shot = null;
    }

    function update(time) {

    }

    function destroy() {}

    function moveForward() {
        logic.moveForward(this.player);
    }

    function rotateRight() {
        logic.rotateRight(this.player);
    }

    function rotateLeft() {
        logic.rotateLeft(this.player);
    }

    function reset(x, y, rotation) {
        this.player.reset(x, y);
        this.player.rotation = rotation;
    }

    var Ship = function() {
        this.create = create;
        this.moveForward = moveForward;
        this.rotateRight = rotateRight;
        this.rotateLeft = rotateLeft;
        this.reset = reset;

    };

    Ship.preload = preload;

    return Ship;
});