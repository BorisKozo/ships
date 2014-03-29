define(['require', 'Phaser', './game.js', 'app/states/battle.js', 'app/states/test_area.js','app/states/explosion_area.js'], function (require, Phaser, game) {
  var battleState = require('app/states/battle.js');
  var testArea = require('app/states/test_area.js');
  var explosionArea = require('app/states/explosion_area.js');
 
  var loader = {
    start: function () {
      game.state.add('Battle', battleState);
      game.state.add('Test', testArea);
      game.state.add('Explosion', explosionArea);
      game.state.start('Battle');
    }
  };

  return loader;

});