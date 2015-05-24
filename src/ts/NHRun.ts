/// <reference path="../../typings/tsd.d.ts"/>
/// <reference path="./GameStates/GamePlay"/>

module NHRun {
  export class Game extends Phaser.Game {
    player: Entities.Player;
    platforms: Phaser.Group;
    cursors: Phaser.CursorKeys;

    constructor () {
      super(window.innerWidth + 100 , window.innerHeight,
        Phaser.AUTO, '');

      // Set state to game play
      var gamePlay = new GameStates.GamePlay();
      this.state.add('gamePlay', gamePlay);
      this.state.start('gamePlay');
    }
  }
}
