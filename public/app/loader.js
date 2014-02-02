define(['require', 'Phaser', './game.js', 'app/states/battle.js'], function (require, Phaser, game) {
  var battleState = require('app/states/battle.js');
 
  var loader = {
    start: function () {
      game.state.add('Battle', battleState);
      game.state.start('Battle');
    }
  };

  return loader;

});