/*global requirejs*/
'use strict';

requirejs.config({
  baseUrl:"",
  waitSeconds: 3000,
  shim: {
    'Phaser': {
      exports: 'Phaser'
    }

  },
  paths: {
    'Phaser': '../vendor/phaser.min'
  }
});

require(['app/loader.js'], function (loader) {
  loader.start();
});