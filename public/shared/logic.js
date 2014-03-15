    ({
        define: typeof define === "function" ? define // browser
        :


        function(F) {
            F(require, exports, module)
        }
    }). // Node.js
    define(function(require, exports, module) {
        var rotationSpeed = 0.02;
        var shipSpeed = 2;
        var shotSpeed = 5;
        
        function clipTpWorld(player){
                if (player.x < module.exports.world.left){
                    player.x = module.exports.world.left + shipSpeed;
                }
                
                if (player.x > module.exports.world.right){
                    player.x = module.exports.world.right - shipSpeed;
                    console.log(player.x);
                }

                if (player.y < module.exports.world.top){
                    player.y = module.exports.world.top + shipSpeed;
                }
                
                if (player.y > module.exports.world.bottom){
                    player.y = module.exports.world.bottom - shipSpeed;
                }
        }
        
        module.exports = {
            world: {
                left: -300,
                right: 300,
                top: -300,
                bottom: 300
            },
            rotateRight: function(player) {
                player.rotation += rotationSpeed;
            },
            rotateLeft: function(player) {
                player.rotation -= rotationSpeed;
            },
            moveForward: function(player) {
                player.x += Math.cos(player.rotation) * shipSpeed;
                player.y += Math.sin(player.rotation) * shipSpeed;
                
                clipTpWorld(player);
            },
            canShoot: function(player) {
                return player.shot === null;
            },
            moveShot: function(shot) {
                shot.x += Math.cos(shot.rotation) * shotSpeed;
                shot.y += Math.sin(shot.rotation) * shotSpeed;

            },
            isShotOutOfBounds: function(shot) {
                if (shot.x < module.exports.world.left - shotSpeed || shot.x > module.exports.world.right + shotSpeed) return true;
                if (shot.y < module.exports.world.top - shotSpeed || shot.y > module.exports.world.bottom + shotSpeed) return true;
                return false;
            }

        };
    });