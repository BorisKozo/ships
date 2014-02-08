define(['Phaser','io', 'app/game.js', 'app/global.js'], function (Phaser, io, game, global) {

   
  var cursors;
  var player;
  var serverState = null;
  
  var socket = io.connect('http://ships.cloudapp.net:8000/');

  function updateFromServerState(state){
    if (!state) {
      return;
    }
    player.x = state[0].x || player.x;
    player.y = state[0].y || player.y;
    player.angle = state[0].angle || player.angle;
  }
  
  var battle = {

    preload: function () {
      game.load.image('ship', 'assets/sprites/ship.png');
    },

    create: function () {
      cursors = game.input.keyboard.createCursorKeys();
      player = game.add.sprite(200, 200,'ship');
      player.anchor.setTo(0.5,0.8);
      socket.emit('client-initialize', {
        x:player.x, 
        y:player.y,
        angle:player.angle
      });
      
      socket.on('server-state',function(state){
        serverState = state;
      });
    },

    update: function () {
    	
      updateFromServerState(serverState);
      serverState = null;
    if (cursors.up.isDown)
    {
    }

    if (cursors.left.isDown)
    {
      socket.emit('client-keys-pressed',{key:'left'});
    }
    else if (cursors.right.isDown)
    {
      socket.emit('client-keys-pressed',{key:'right'});
        }
    }
  };

  return battle;
});