define(['Phaser', 'app/game.js', 'shared/logic.js', './hp_bar', './explosion'], function(Phaser, game, logic, HpBar, Explosion) {
    'use strict';

    var ship = {
        hpBarDx: -15,
        hpBarDy: -32,
        hpBarWidth: 30,
        updateHpBar: function() {
            this.hpBar.moveTo(this.ship.x + this.hpBarDx, this.ship.y + this.hpBarDy);
            this.hpBar.hp = this.hp;
        },
        create: function() {
            this.hpBar = new HpBar();
            this.hpBar.create(ship.hpBarDx, ship.hpBarDy, ship.hpBarWidth, 100);
            if (this._create) {
                this._create.apply(this, Array.prototype.slice.call(arguments));
            }
            this.explosion = new Explosion();
            this.explosion.create(this.type);
        },
        update: function() {
            this.hpBar.update();
            if (this._update) {
                this._update.apply(this, Array.prototype.slice.call(arguments));
            }
        },
        updateState: function(state) {
            if (state.deathTimer > 0){
                if (this.ship.alive){
                    this.ship.kill();
                    this.hpBar.hide();
                    if (this.shot){
                        this.shot.destroy();
                        this.shot = null;
                    }
                    this.explosion.explode(state.x,state.y);
                }
                return;
            } else {
                if (!this.ship.alive){
                    this.ship.reset(state.x,state.y);
                    this.hpBar.show();
                }
            }
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

            this.updateHpBar();

        },
        shoot: function(shotData) {

            var shotSprite = game.add.sprite(shotData.x, shotData.y, this.type + '-shot');
            shotSprite.anchor.setTo(0.5, 0.5);
            shotSprite.rotation = shotData.rotation;
            shotSprite.serverId = this.serverId;
            this.shot = shotSprite;
        }
    }

    return ship;
});