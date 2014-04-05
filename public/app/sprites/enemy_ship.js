define(['Phaser', 'app/game.js', 'shared/logic.js','./ship'], function(Phaser, game, logic,ship) {
    'use strict';

    function preload() {
        game.load.image('enemy-ship', 'assets/sprites/enemy-ship.png');
        game.load.image('enemy-shot', 'assets/sprites/enemy-shot.png');
    }

    function create(data) {
        this.ship = game.add.sprite(data.x, data.y, 'enemy-ship');
        this.ship.anchor.setTo(0.2, 0.5);
        this.shot = null;
        this.ship.rotation = data.rotation;
        this.serverId = data.id;
        this.hp = data.hp;
        this.score = data.score;
        this.name = data.name;
        this.type = 'enemy';
    }
    
    function destroy(){
        this.ship.destroy();
        this.hpBar.destroy();
        if (this.shot !== null){
            this.shot.destroy();
            this.shot = null;
        }
    }
    


    var Ship = function() {
        this._create = create;
        this.destroy = destroy;

    };

    Ship.preload = preload;
    Ship.prototype = ship;

    return Ship;
});