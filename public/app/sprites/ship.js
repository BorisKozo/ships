define(['Phaser', 'app/game.js', 'shared/logic.js'], function(Phaser, game, logic) {
    'use strict';

    return {
        updateState: function(state) {
            this.ship.x = state.x;
            this.ship.y = state.y;
            this.ship.rotation = state.rotation;
            this.name = state.name;
            this.score = state.score;
            this.hp = state.hp;
            if (state.shot !== null) { //Server thinks there is a shot
                if (this.shot === null) { //But we have no shot
                    this.shoot(state.shot); //Generate shot
                } else { // We have a shot
                    this.shot.x = state.shot.x;
                    this.shot.y = state.shot.y;

                }
            } else { //Server thinks there is no shot
                if (this.shot !== null) { // But we have a shot
                    this.shot.destroy();
                    this.shot = null;
                }
            }

        },
        shoot: function(shotData) {

            var shotSprite = game.add.sprite(shotData.x, shotData.y, this.type + '-shot');
            shotSprite.anchor.setTo(0.5, 0.5);
            shotSprite.rotation = shotData.rotation;
            shotSprite.serverId = this.serverId;
            this.shot = shotSprite;
        }
    }
});