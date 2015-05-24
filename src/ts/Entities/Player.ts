/// <reference path="../../../typings/tsd.d.ts"/>

module NHRun.Entities {
  var Textures = {
    playerIdle:   {path: 'assets/player/idle.png',   margin: 0, max: 3, width: 28, height: 36, padding: 9},
    playerJump:   {path: 'assets/player/jump.png',   margin: 0, max: 3, width: 30, height: 48, padding: 7},
    //playerRun:    {path: 'assets/player/run.png',    margin: 0, max: 5, width: 35, height: 41, padding: 6}
  };
  
  var Sounds = {
    biji: 'assets/player/biji.mp3'
  };

  var Atlases = {
    playerRun: {path: 'assets/player/run.png', json: 'assets/player/run.json'}
  };

  export class Player extends Phaser.Sprite implements IEntity {
    isJumping: boolean = false;

    // Movement constants
    jumpSpeed: number = 1000;

    // Sounds
    jumpSound: Phaser.Sound;

    /******************
     * Initialization *
     ******************/
    constructor (game: Phaser.Game, x: number, y: number) {
      super(game, x, y, 'playerRun', 'selo_run_000.png');

      // set anchor bottom left (different texture sizes)
      this.anchor.x = 1;
      this.anchor.y = 1;

      // prevent antialiasing
      this.smoothed = false;

      // define animations
      this.animations.add('idle');
      this.animations.add('jump', [3,2,1,1,1,3,3], 8.5);

      this.animations.add('run', Phaser.Animation.generateFrameNames('selo_run_', 0, 60, '.png', 3), 80, true);

      // define sounds
      this.jumpSound = game.add.sound('biji');

      // play idle animation on start & loop
      this.animations.play('run');
    }

    initPhysics () {
      this.body.gravity.y = 2500;
      this.body.collideWorldBounds = true;
    }

    /*****************
     * Update Player *
     *****************/
    onUpdate (cursors: Phaser.CursorKeys) {
      var keyboard = this.game.input.keyboard;

      this.handleMovement(cursors);
    }

    handleMovement (cursors: Phaser.CursorKeys) {
      this.body.velocity.x = 0;

      if (cursors.up.isDown && this.body.touching.down) {
        this.jump();
      }
    }

    playRunAnimation () {
      this.loadTexture('playerIdle', 0);
      var anim = this.play('run');
      this.frame = 0;
    }

    jump () {
      this.isJumping = true;
      this.body.velocity.y = -this.jumpSpeed;
      this.playJumpingAnimation();
      this.jumpSound.play();
    }

    playJumpingAnimation () {
      //this.loadTexture('playerJump', 0);
      //var anim = this.play('jump');
      //this.frame = 0;
      //anim.onComplete.addOnce(this.goIdle, this);
    }

    goIdle (e) {
      this.loadTexture('playerRun', 0);
      this.animations.play('run');
    }
    
    // Meta
    static preloadAssets (state: Phaser.State) {
      // Load sounds
      R.mapObjIndexed((path, key) => {
        state.load.audio(key, path);
      }, Sounds);

      // Load atlases
      R.mapObjIndexed((obj, key) => {
        state.load.atlasJSONHash(key, obj['path'], obj['json']);
      }, Atlases);
      
      // Load textuers
      var loader = state.load.spritesheet.bind(state.load);

      var keyProp = R.flip(R.prop)(Textures);
      var getProps = R.props(['path', 'width', 'height', 'max', 'margin', 'padding']);
      var getAssetProps = R.pipe(keyProp, getProps);
      var getLoadArguments = R.pipe(R.of, R.ap([R.identity, getAssetProps]), R.flatten);
      var load = R.pipe(getLoadArguments, R.apply(loader));

      R.map(load, R.keys(Textures));
    }
  }
}
