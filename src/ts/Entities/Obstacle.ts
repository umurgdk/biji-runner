/// <reference path="../../../typings/tsd.d.ts"/>

module NHRun.Entities {
  var Textures = {
    obstacle1: {path: 'assets/obstacles/caret.png'}
  };

  var Spritesheets = {
    obstacle2: {path: 'assets/obstacles/cat1.png', margin: 0, max: 3, width: 38, height: 39, padding: 9}
  };

  var obstacleKeys = ['obstacle1', 'obstacle2'];
  var obstacleScales = {
    obstacle1: 2,
    obstacle2: 1
  };

  export class Obstacle extends Phaser.Sprite implements IEntity {
    // Initialization
    constructor (textureName: string, game: Phaser.Game) {
      super(game, 0, 0, textureName);

      this.scale.x = obstacleScales[textureName];
      this.scale.y = obstacleScales[textureName];
    }
    
    // IEntity
    initPhysics () {}
    onUpdate () {}
    
    // Meta
    static createRandom (game: Phaser.Game): Obstacle {
      var textureName = obstacleKeys[(Math.round(Math.random() * 10)) % obstacleKeys.length];

      return new Obstacle(textureName, game);
    }

    static preloadAssets (state: Phaser.State) {
      // load image
      state.load.image('obstacle1', Textures.obstacle1.path);

      // load spritesheets
      // Load textuers
      var loader = state.load.spritesheet.bind(state.load);

      var keyProp = R.flip(R.prop)(Spritesheets);
      var getProps = R.props(['path', 'width', 'height', 'max', 'margin', 'padding']);
      var getAssetProps = R.pipe(keyProp, getProps);
      var getLoadArguments = R.pipe(R.of, R.ap([R.identity, getAssetProps]), R.flatten);
      var load = R.pipe(getLoadArguments, R.apply(loader));

      R.map(load, R.keys(Spritesheets));
    }
  }
}
