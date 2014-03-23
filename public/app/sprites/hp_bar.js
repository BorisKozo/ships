define(['Phaser'], function(Phaser) {
    'use strict';
    
    var greenColor = 0x00FF00;
    var yellowColor = 0xFFFF00;
    var redColor = 0xFF0000;

    function create(x, y, width, maxHp) {
        this.hpBar = this.game.add.graphics(x, y);
        this.hp = maxHp;
        this.maxHp = maxHp;
        this.width = width;

    }

    function reset(x, y, width, maxHp) {
        this.hp = maxHp;
        this.maxHp = maxHp;
        this.width = width;
        this.hpBar.x = x;
        this.hpBar.y = y;
    }

    function update() {
        var percent = this.hp / this.maxHp;
        var color = redColor;
        if (percent > 0.5) {
            color = greenColor;
        } else {
            if (percent > 0.2) {
                color = yellowColor;
            }
        }
        this.hpBar.clear();
        //this.hpBar.beginFill(0xFF0000);
        this.hpBar.lineStyle(1, 0x282828, 1);
        this.hpBar.beginFill(color);
        this.hpBar.drawRect(1, 1, percent * (this.width - 2), 3);
        this.hpBar.endFill();
        this.hpBar.drawRect(0, 0, this.width, 5);

    }

    var HpBar = function(game) {
        this.game = game;

        this.create = create;
        this.reset = reset;
        this.update = update;
    };

    return HpBar;
});