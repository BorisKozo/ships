define(['Phaser', 'io', 'app/math.js', 'app/game.js', 'app/global.js','shared/logic.js'], function(Phaser, io, math, game, global,logic) {

    var player, cursors;
    var upButton, upLeftButton, leftButton, upRightButton, rightButton, fireButton;
    var buttons; 
    var TouchButton = function(x, y) {
        this.sprite = game.add.sprite(x, y, 'button', 0);
        this.sprite.anchor.setTo(0.5, 0.5);
        this.squaredRadius = Math.pow(this.sprite.width / 2, 2);
        this.isPressed = false;
        this.numberOfPointers = 2;
    };

    TouchButton.prototype.update = function() {
        var i, pointer;
        this.sprite.frame = 0;
        this.isPressed = false;
        for (i = 1; i <= this.numberOfPointers; i++) {
            pointer = game.input["pointer" + i.toString()];
            if (pointer) {
                if (pointer.isDown) {
                    if (math.distanceSquared(pointer.worldX, pointer.worldY, this.sprite.worldCenterX, this.sprite.worldCenterY) < this.squaredRadius) {
                        this.sprite.frame = 1;
                        this.isPressed = true;
                        break;
                    }
                }
            }
        }
    };

    function createButtons() {
        leftButton= new TouchButton(330, 170);
        upLeftButton = new TouchButton(350, 130);
        upButton = new TouchButton(390, 110);
        upRightButton= new TouchButton(430, 130);
        rightButton= new TouchButton(450, 170);
        fireButton= new TouchButton(-390, 110);
        
        buttons = [upButton, upLeftButton, leftButton, upRightButton, rightButton, fireButton];
    }

    var battle = {

        preload: function() {
            game.world.setBounds(-2000, -2000, 4000, 4000);

            game.load.image('player-ship', 'assets/sprites/player-ship.png');
            game.load.image('enemy-ship', 'assets/sprites/enemy-ship.png');
            game.load.image('player-shot', 'assets/sprites/player-shot.png');
            game.load.image('enemy-shot', 'assets/sprites/enemy-shot.png');
            game.load.image('bound', 'assets/sprites/bound.png');
            game.load.spritesheet('button', 'assets/buttons/button.png', 45, 45);

            game.stage.disableVisibilityChange = true;
        },

        create: function() {
            game.add.sprite(-300, -300, 'bound');
            cursors = game.input.keyboard.createCursorKeys();
            player = game.add.sprite(0, 0, 'player-ship');
            player.anchor.setTo(0.2, 0.5);
            createButtons();

            game.input.keyboard.addKeyCapture([
            Phaser.Keyboard.LEFT,
            Phaser.Keyboard.RIGHT,
            Phaser.Keyboard.UP,
            Phaser.Keyboard.DOWN,
            Phaser.Keyboard.SPACEBAR]);

            game.camera.setPosition(-game.stage.bounds.width / 2, -game.stage.bounds.height / 2);
        },

        update: function() {
            var i;
            for (i=0;i<buttons.length;i++){
                buttons[i].update();
            }
            
            if (upButton.isPressed || upLeftButton.isPressed || upRightButton.isPressed){
                logic.moveForward(player);
            }
            
            if (leftButton.isPressed || upLeftButton.isPressed){
                logic.rotateLeft(player);
            }
            
            if (rightButton.isPressed || upRightButton.isPressed){
                logic.rotateRight(player);
            }
        },

        render: function() {
            //game.debug.renderCameraInfo(game.camera, 32, 32);
            game.debug.renderPointer(game.input.pointer1);
            game.debug.renderPointer(game.input.pointer2);
        }
    };

    return battle;
});