define(['Phaser', 'app/game.js'], function(Phaser, game) {
    'use strict';

    function emitParticleCircular() {

        var particle = this.getFirstExists(false);

        if (particle == null) {
            return;
        }

        particle.angle = 0;
        particle.bringToTop();

        if (this.minParticleScale !== 1 || this.maxParticleScale !== 1) {
            particle.scale.set(this.game.rnd.realInRange(this.minParticleScale, this.maxParticleScale));
        }

        if (this.width > 1 || this.height > 1) {
            particle.reset(this.game.rnd.integerInRange(this.left, this.right), this.game.rnd.integerInRange(this.top, this.bottom));
        } else {
            particle.reset(this.emitX, this.emitY);
        }

        particle.lifespan = this.lifespan;

        particle.body.bounce.setTo(this.bounce.x, this.bounce.y);

        var particleAngle = Phaser.Math.degToRad(this.game.rnd.integerInRange(0, 360));
        var velocity = 0;
        if (this.minParticleSpeed.x !== this.maxParticleSpeed.x) {
            velocity = this.game.rnd.integerInRange(this.minParticleSpeed.x, this.maxParticleSpeed.x);
        } else {
            velocity = this.minParticleSpeed.x;
        }

        particle.body.velocity.x = velocity * Math.sin(particleAngle);
        particle.body.velocity.y = velocity * Math.cos(particleAngle);


        if (this.minRotation !== this.maxRotation) {
            particle.body.angularVelocity = this.game.rnd.integerInRange(this.minRotation, this.maxRotation);
        } else if (this.minRotation !== 0) {
            particle.body.angularVelocity = this.minRotation;
        }

        if (typeof this._frames === 'object') {
            particle.frame = this.game.rnd.pick(this._frames);
        } else {
            particle.frame = this._frames;
        }

        particle.body.gravity.y = this.gravity;
        particle.body.drag.x = this.particleDrag.x;
        particle.body.drag.y = this.particleDrag.y;
        particle.body.angularDrag = this.angularDrag;

    }

    function preload() {
        game.load.image('player-explosion-particle', 'assets/sprites/player-explosion-particle.png');
        game.load.image('enemy-explosion-particle', 'assets/sprites/enemy-explosion-particle.png');
    }

    function create(type) {
        this.emitter = game.add.emitter(0, 0, 100);
        this.emitter.emitParticle = emitParticleCircular;

        if (type === 'player') {
            this.emitter.makeParticles('player-explosion-particle');
        } else {
            this.emitter.makeParticles('enemy-explosion-particle');
        }
        this.emitter.minParticleSpeed.setTo(0, 0);

        this.emitter.maxParticleSpeed.setTo(400, 0);
        this.emitter.particleDrag.setTo(100, 100);
        this.emitter.gravity = 0;
        this.type = type;
    }
    
    function explode(x,y) {
      
        this.emitter.x = x;
        this.emitter.y = y;

        //  The first parameter sets the effect to "explode" which means all particles are emitted at once
        //  The second gives each particle a 2000ms lifespan
        //  The third is ignored when using burst/explode mode
        //  The final parameter (10) is how many particles will be emitted in this single burst
        this.emitter.start(true, 300, null, 300);  
    }

  

    var Explosion = function() {
        this.create = create;
        this.explode = explode;
    };

    Explosion.preload = preload;


    return Explosion;
});