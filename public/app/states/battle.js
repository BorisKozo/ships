define(['Phaser','io', 'app/game.js', 'app/global.js'], function (Phaser, io, game, global) {

   
  var cursors;
  var player;
  
  var socket = io.connect('http://blackwater-bay-nodejs-64270.euw1.nitrousbox.com:3000/');

  
  var battle = {

    preload: function () {
      game.load.image('ship', 'assets/sprites/ship.png');
    },

    create: function () {
      cursors = game.input.keyboard.createCursorKeys();
      player = game.add.sprite(200, 200,'ship');
      player.anchor.setTo(0.5,0.8);
      socket.emit('init', {
        x:player.x, 
        y:player.y,
        angle:player.angle
      }); 
    },

    update: function () {
        //  For example this checks if the up or down keys are pressed and moves the camera accordingly.
    if (cursors.up.isDown)
    {
    }

    if (cursors.left.isDown)
    {
      //player.angle-=1;
    }
    else if (cursors.right.isDown)
    {
      //player.angle+=1;
        }
    }
  };

  return battle;
});