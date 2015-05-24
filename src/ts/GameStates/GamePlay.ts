/// <reference path="../../../typings/tsd.d.ts"/>
/// <reference path="../Entities/Player"/>
/// <reference path="../Entities/Platform"/>
/// <reference path="../Entities/Obstacle" />
/// <reference path="../Components/ObstacleManager" />

module NHRun.GameStates {
  export class GamePlay extends Phaser.State {
    // Entities & Groups
    player: Entities.Player;
    platforms: Phaser.Group;
    obstacles: Phaser.Group;
    
    // UI
    fpsText: Phaser.Text;
    meterText: Phaser.Text;
    gameOverDialog: Phaser.Sprite;
    
    // Components
    obstacleManager: Components.ObstacleManager;

    // Input
    cursors: Phaser.CursorKeys;
    
    // Game state
    scrollSpeed: number = 300;
    groundHeight: number = 64;
    metersRan: number = 0;
    isGameOver: boolean = false;
    hitObstacle: Entities.Obstacle;
    
    // Options
    meterDelay: number = 200;
    meterGrow: number = 1;
    nextSpeedDelay: number = 50;
    
    private _lastMeterTime: number = 0;
    private _lastSpeedMeter: number = 0;

    constructor () {
      super();
    }

    preload () {
      Entities.Player.preloadAssets(this);
      Entities.Obstacle.preloadAssets(this);
    }

    create () {
      // reset game state
      this.scrollSpeed = 300;
      this.metersRan = 0;
      this._lastMeterTime = 0;
      this._lastSpeedMeter = 0;

      // to show fps
      this.time.advancedTiming = true;

      // set background
      this.stage.backgroundColor = "#fff";
      
      // init UI
      this.fpsText = this.add.text(10, 10, 'FPS: 0', {});
      this.meterText = this.add.text(10, 40, 'METRE: 0', {});

      // Init keyboard cursors
      this.cursors = this.game.input.keyboard.createCursorKeys();

      // Init physics
      this.physics.startSystem(Phaser.Physics.ARCADE);

      // Init platforms
      this.platforms = this.add.group();
      this.platforms.enableBody = true;
      this.createPlatforms();
      
      // Init obstacles
      this.obstacles = this.game.add.group();
      this.obstacles.enableBody = true;
      this.obstacles.physicsBodyType = Phaser.Physics.ARCADE;
      this.obstacleManager = new Components.ObstacleManager(
        this.game,
        this.obstacles, 
        this.scrollSpeed, 
        this.groundHeight,
        5 /* maxObstacles */);

      // Init player
      this.player = new Entities.Player(this.game, 220, this.world.height - this.groundHeight);
      this.physics.arcade.enable(this.player);
      this.player.initPhysics();
      this.add.existing(this.player);
    }

    createPlatforms () {
      // Create ground
      var ground = <Entities.Platform> this.platforms.add(
        new Entities.Platform(this.game, 0, this.world.height - this.groundHeight, this.world.width + 100, this.groundHeight));

      ground.initPhysics();
    }

    update () {
      // show fps
      this.fpsText.text = 'FPS: ' + this.game.time.fps.toString();
      
      // collisions
      this.physics.arcade.collide(this.player, this.platforms);
      this.physics.arcade.collide(this.player, this.obstacles, this.hitObstacle, null, this);

      // update player
      this.player.onUpdate(this.cursors);
      
      // update obstacles
      this.obstacleManager.update(this.player.position);
      
      // update meters ran!
      if (this.time.now > this._lastMeterTime + this.meterDelay) {
        this.metersRan += 1;
        this.meterText.text = 'METRE: ' + this.metersRan.toString();
        this._lastMeterTime = this.time.now;
        
        if (this.metersRan > this._lastSpeedMeter + this.nextSpeedDelay) {
          this.scrollSpeed += this.meterGrow;
          this.obstacleManager.scrollSpeed = this.scrollSpeed;
        }
      }
    }


    paused ():void {
      super.paused ();


    }

    pauseUpdate ():void {
      super.pauseUpdate ();

      if (this.isGameOver && this.hitObstacle != null) {

      }
    }

    hitObstacle (obstacle) {
      this.hitObstacle = obstacle;
      this.isGameOver = true;
      this.game.paused = true;
    }
  }
}
