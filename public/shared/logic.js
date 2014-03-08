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

            },
            canShoot: function(player) {
                return player.shot === null;
            },
            moveShot: function(shot) {
                shot.x += Math.cos(shot.rotation) * shotSpeed;
                shot.y += Math.sin(shot.rotation) * shotSpeed;

            },
            isShotOutOfBounds: function(shot) {
                if (shot.x < module.exports.world.left - 5 || shot.x > module.exports.world.right + 5) return true;
                if (shot.y < module.exports.world.top - 5 || shot.y > module.exports.world.bottom + 5) return true;
                return false;
            }

        };
    });