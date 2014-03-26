define(['Phaser', 'app/game.js', 'shared/logic.js','./ship','./hp_bar'], function(Phaser, game, logic,ship,HpBar) {
    'use strict';

    
    function preload() {
        game.load.image('player-ship', 'assets/sprites/player-ship.png');
        game.load.image('player-shot', 'assets/sprites/player-shot.png');
    }

    function create() {
        this.ship = game.add.sprite(0, 0, 'player-ship');
        this.ship.kill();
        this.ship.anchor.setTo(0.2, 0.5);
        this.shot = null;
        this.type = 'player';
        
    }

    function moveForward() {
        logic.moveForward(this.ship);
        //this.hpBar.reset(this.ship.x+hpBarDx,this.ship.y+hpBarDy,hpBarWidth,100);
    }

    function rotateRight() {
        logic.rotateRight(this.ship);
    }

    function rotateLeft() {
        logic.rotateLeft(this.ship);
    }

    function reset(x, y, rotation) {
        this.ship.reset(x, y);
        this.ship.rotation = rotation;
        //this.hpBar.reset(x+hpBarDx,y+hpBarDy,hpBarWidth,100);
    }
    

    var Ship = function() {
        this._create = create;
        this.moveForward = moveForward;
        this.rotateRight = rotateRight;
        this.rotateLeft = rotateLeft;
        this.reset = reset;
    };

    Ship.preload = preload;
    Ship.prototype = ship;

    return Ship;
});