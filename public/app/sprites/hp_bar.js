define(['Phaser','app/game.js'], function(Phaser,game) {
    'use strict';
    
    var greenColor = 0x00FF00;
    var yellowColor = 0xFFFF00;
    var redColor = 0xFF0000;

    function create(x, y, width, maxHp) {
        this.hpBar = game.add.graphics(x, y);
        this.hp = maxHp;
        this.maxHp = maxHp;
        this.width = width;
        this.visible = true;

    }

    function moveTo(x, y) {
        this.hpBar.x = x;
        this.hpBar.y = y;
    }

    function update() {
        if (!this.visible){
            this.hpBar.clear();
            return;
        }
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
        this.hpBar.beginFill(0xFF0000);
        this.hpBar.lineStyle(1, 0x282828, 1);
        this.hpBar.beginFill(color);
        this.hpBar.drawRect(1, 1, percent * (this.width - 2), 3);
        this.hpBar.endFill();
        this.hpBar.drawRect(0, 0, this.width, 5);

    }
    
    function hide(){
        this.visible = false;
    }
    
    function show(){
        this.visible = true;
    }
    
    function destroy(){
        this.hpBar.destroy();
    }

    var HpBar = function() {
        this.create = create;
        this.moveTo = moveTo;
        this.update = update;
        this.hide = hide;
        this.show = show;
        this.destroy = destroy;
    };

    return HpBar;
});