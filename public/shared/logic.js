    ({ define: typeof define === "function"
        ? define  // browser
        : function(F) { F(require,exports,module) } }).  // Node.js
    define(function (require, exports, module) {
      var rotationSpeed = 0.02;
      var shipSpeed = 2;
      var shotSpeed = 5;
       module.exports = {
         screenWidth : 600,
         screenHeight : 600,
         
         rotateRight:function(player){
           player.rotation += rotationSpeed;
         },
         rotateLeft:function(player){
           player.rotation -= rotationSpeed;
         },
         moveForward:function(player){
               player.x += Math.cos(player.rotation) * shipSpeed;
               player.y += Math.sin(player.rotation) * shipSpeed;

         },
         canShoot:function(player){
           return player.shot === null;
         },
         moveShot:function(shot){
               shot.x += Math.cos(shot.rotation) * shotSpeed;
               shot.y += Math.sin(shot.rotation) * shotSpeed;
           
         },
         isShotOutOfBounds:function(shot){
           if (shot.x < -5 || shot.x > module.exports.screenWidth + 5) return true;
           if (shot.y < -5 || shot.y > module.exports.screenHeight + 5) return true;
           return false;
         }
         
       }; 
    });