/*global requirejs*/
'use strict';

requirejs.config({
  baseUrl:"",
  waitSeconds: 3000,
  shim: {
    'Phaser': {
      exports: 'Phaser'
    },
    'io': {
      exports: 'io'
    }

  },
  paths: {
    'Phaser': '../vendor/phaser.min',
    'io': '../vendor/socket.io'
  }
});

require(['app/loader.js'], function (loader) {
  loader.start();
});