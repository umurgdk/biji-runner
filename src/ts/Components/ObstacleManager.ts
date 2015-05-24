/// <reference path="../../../typings/tsd.d.ts" />
/// <reference path="../Entities/Obstacle" />

module NHRun.Components {
  export class ObstacleManager {
    // State dependencies
    obstacles: Phaser.Group;
    game: Phaser.Game;
        
    // options
    groundHeight: number;
    maxObstacle: number = 5;
    scrollSpeed: number;
    
    // state
    private _lastSpawnTime = 0;
    private _nextSpawnDelay = 1000;
    private _randomGenerator: Phaser.RandomDataGenerator;
    
    constructor (game: Phaser.Game, obstacles: Phaser.Group, scrollSpeed: number, groundHeight: number, maxObstacles?: number) {
      // Dependencies
      this.game = game;
      this.obstacles = obstacles;
      
      // options
      this.maxObstacle = maxObstacles || this.maxObstacle;
      this.groundHeight = groundHeight;
      this.scrollSpeed = scrollSpeed;
      
      // state
      this._lastSpawnTime = this.game.time.now;
      this._randomGenerator = new Phaser.RandomDataGenerator([13,27]);
      
      this.createObstacleBuffer();
    }
    
    private createObstacleBuffer () {
      var obstaclePosibility = ['obstacle1', 'obstacle1', 'obstacle2', 'obstacle2', 'obstacle2'];

      R.times((id) => {
        var obstacle = new Entities.Obstacle(obstaclePosibility[id], this.game);
        this.obstacles.add(obstacle);
        obstacle.smoothed = false;
        obstacle.name = 'obstacle-' + id;
        obstacle.exists = false;
        obstacle.visible = false;
        obstacle.checkWorldBounds = true;
        obstacle.outOfBoundsKill = true;
      }, this.maxObstacle);
    }
    
    update (playerPosition: Phaser.Point) {
      if (this.game.time.now > this._lastSpawnTime + this._nextSpawnDelay) {
        var deadOnes = this.obstacles.filter((obstacle: Entities.Obstacle) => !obstacle.exists);
        var obstacle = <Entities.Obstacle> deadOnes.list[this._randomGenerator.integerInRange(0, deadOnes.total)];
        //var obstacle = <Entities.Obstacle> this.obstacles.getFirstExists(false);
        
        if (obstacle) {
          obstacle.reset(this.game.world.width - 100, this.game.world.height - 64 - obstacle.height);
          obstacle.body.velocity.x = -this.scrollSpeed;
          
          this._lastSpawnTime = this.game.time.now;
          this.getNextSpawnDelay();
        }
      }
    }
    
    getNextSpawnDelay () {
      this._nextSpawnDelay = this._randomGenerator.integerInRange(750, 3000);
      console.log(this._nextSpawnDelay);
    }
  }
}