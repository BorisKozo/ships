define(['Phaser', 'io', 'app/math.js', 'app/game.js', 'app/global.js', 'shared/logic.js','./../sprites/ship'], function(Phaser, io, math, game, global, logic, Ship) {

    var cursors;
    var player;
    var enemies;
    var shots;
    var gameSprites = {}; //I will put all the ship sprites here

    var serverState = null;
    var gameStarted = false;
    var socket = io.connect();
    var stats = [];

    var upButton, upLeftButton, leftButton, upRightButton, rightButton, fireButton;
    var buttons;

    var fontStyle = {
        font: "22px Arial",
        fill: "#00FF44",
        align: "left"
    };




    var TouchButton = function(x, y) {
        this.sprite = game.add.sprite(x, y, 'button', 0);
        this.sprite.anchor.setTo(0.5, 0.5);
        this.squaredRadius = Math.pow((this.sprite.width / 2) * 1.5, 2); //increase the hit area by 50%
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
                    if (math.distanceSquared(pointer.worldX, pointer.worldY, this.sprite.world.x, this.sprite.world.y) < this.squaredRadius) {
                        this.sprite.frame = 1;
                        this.isPressed = true;
                        break;
                    }
                }
            }
        }
    };

    function createButtons() {
        leftButton = new TouchButton(330, 190);
        upLeftButton = new TouchButton(345, 140);
        upButton = new TouchButton(390, 110);
        upRightButton = new TouchButton(430, 140);
        rightButton = new TouchButton(445, 190);
        fireButton = new TouchButton(-390, 110);

        buttons = [upButton, upLeftButton, leftButton, upRightButton, rightButton, fireButton];
    }


    function shoot(sprite, shotData) {

        var shotSprite = shots.create(shotData.x, shotData.y, 'enemy-shot');
        shotSprite.anchor.setTo(0.5, 0.5);
        shotSprite.rotation = shotData.rotation;
        shotSprite.serverId = sprite.serverId;
        sprite.shot = shotSprite;
    }

    function updateFromServerState(state) {
        if (!state) {
            return;
        }
        var i = 0,
            sprite;
        for (i = state.length - 1; i >= 0; i--) {
            sprite = gameSprites[state[i].id];
            if (!sprite) {
                continue;
            }
            sprite.x = state[i].x;
            sprite.y = state[i].y;
            sprite.rotation = state[i].rotation;
            sprite.name = state[i].name;
            sprite.score = state[i].score;
            sprite.hp = state[i].hp;
            if (state[i].shot !== null) { //Server thinks there is a shot
                if (sprite.shot === null) { //But we have no shot
                    shoot(sprite, state[i].shot); //Generate shot
                } else { // We have a shot
                    sprite.shot.x = state[i].shot.x;
                    sprite.shot.y = state[i].shot.y;

                }
            } else { //Server thinks there is no shot
                if (sprite.shot !== null) { // But we have a shot
                    sprite.shot.kill();
                    sprite.shot = null;
                }
            }
        }
    }

    function handleKeys() {
        var keys = {};
        var i;
        var toSend = false;
        for (i = 0; i < buttons.length; i++) {
            buttons[i].update();
        }


        if (cursors.up.isDown || upButton.isPressed || upLeftButton.isPressed || upRightButton.isPressed) {
            keys.up = true;
            toSend = true;
            player.moveForward();
        }

        if (cursors.left.isDown || leftButton.isPressed || upLeftButton.isPressed) {
            keys.left = true;
            toSend = true;
            player.rotateLeft();
        } else if (cursors.right.isDown || rightButton.isPressed || upRightButton.isPressed) {
            keys.right = true;
            toSend = true;
            player.rotateRight();
        }

        if (game.input.keyboard.isDown(Phaser.Keyboard.SPACEBAR) || fireButton.isPressed) {
            keys.shoot = true;
            toSend = true;
        }

        if (toSend) {
            socket.emit('client-keys-pressed', keys);
        }
    }

    function recalculateStats() { //update all the player stats based on the current data
        var text, count = 0,
            textSprite;

        for (var id in gameSprites) {
            if (gameSprites.hasOwnProperty(id)) {
                if (gameSprites[id].name) {
                    text = gameSprites[id].name + " - " + gameSprites[id].score;
                } else {
                    text = "Connecting..."
                }
                textSprite = stats[count];
                //if (textSprite === -1){
                if (count === stats.length) {
                    break;
                }
                textSprite.x = 307;
                textSprite.y = 30 * count + 10 + logic.world.top;
                textSprite.setText(text);
                count++;
            }
        }
    }

    function createEnemy(data) {
        var enemy = enemies.create(data.x, data.y, 'enemy-ship');
        enemy.anchor.setTo(0.2, 0.5);
        enemy.rotation = data.rotation;
        enemy.serverId = data.id;
        enemy.shot = null;
        enemy.hp = data.hp;
        enemy.score = data.score;
        enemy.name = data.name;
        gameSprites[data.id] = enemy;
    }

    function createSocketEvents() {
        socket.on('server-state', function(state) {
            serverState = state;
        });

        socket.on('server-initialize', function(data) {
            var i;
            player.serverId = data.id;
            for (i = 0; i < data.data.length; i++) {
                if (data.data[i].id === player.serverId) {
                    player.reset(data.data[i].x, data.data[i].y,data.data[i].rotation);
                    gameSprites[data.id] = player;

                } else {
                    createEnemy(data.data[i]);
                }
                stats.push(game.add.text(0, 0, '', fontStyle));

            }

            gameStarted = true;
        });

        socket.on('server-player-connected', function(data) { //This happens when other player connects
            createEnemy(data);
            stats.push(game.add.text(0, 0, '', fontStyle));
        });

        socket.on('server-player-disconnected', function(data) {
            var enemy = gameSprites[data.id];
            if (enemy) {
                enemy.kill();
            }
            delete gameSprites[data.id];
            stats[stats.length - 1].destroy();
            stats.pop();
        });



    }

    var battle = {

        preload: function() {
            game.world.setBounds(-2000, -2000, 4000, 4000);

            game.load.image('bound', 'assets/sprites/bound.png');
            game.load.spritesheet('button', 'assets/buttons/button.png', 45, 45);
            game.stage.disableVisibilityChange = true;
            
            Ship.preload();
        },

        create: function() {
            game.add.sprite(-300, -300, 'bound');
            cursors = game.input.keyboard.createCursorKeys();
            player = new Ship();
            player.create('player');
            
            enemies = game.add.group();
            shots = game.add.group();

            game.camera.setPosition(-game.stage.bounds.width / 2, -game.stage.bounds.height / 2);

            game.input.keyboard.addKeyCapture([
            Phaser.Keyboard.LEFT,
            Phaser.Keyboard.RIGHT,
            Phaser.Keyboard.UP,
            Phaser.Keyboard.DOWN,
            Phaser.Keyboard.SPACEBAR]);

            createSocketEvents();
            createButtons();

            socket.emit("client-ready", {
                name: document.URL.split('#')[1]
            }); //Signal the server that this client is ready to accept data
        },

        update: function() {
            if (!gameStarted) {
                return;
            }
            updateFromServerState(serverState);
            serverState = null;
            handleKeys();
            recalculateStats();
        }
    };

    return battle;
});