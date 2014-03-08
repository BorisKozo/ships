define(['require', 'Phaser', './game.js', 'app/states/battle.js', 'app/states/test_area.js'], function (require, Phaser, game) {
  var battleState = require('app/states/battle.js');
  var testArea = require('app/states/test_area.js');
 
  var loader = {
    start: function () {
      game.state.add('Battle', battleState);
      game.state.add('Test', testArea);
      game.state.start('Test');
    }
  };

  return loader;

});