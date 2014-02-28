    ({ define: typeof define === "function"
        ? define  // browser
        : function(F) { F(require,exports,module) } }).  // Node.js
    define(function (require, exports, module) {
      var rotationSpeed = 0.02;
      var topSpeed = 2;
       module.exports = {
         
         rotateRight:function(player){
           player.rotation += rotationSpeed;
         },
         rotateLeft:function(player){
           player.rotation -= rotationSpeed;
         },
         moveForward:function(player){
               player.x += Math.cos(player.rotation) * topSpeed;
               player.y += Math.sin(player.rotation) * topSpeed;

         }
       }; 
    });