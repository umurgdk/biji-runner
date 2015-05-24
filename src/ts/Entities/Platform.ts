/// <reference path="../../../typings/tsd.d.ts"/>
/// <reference path="./IEntity"/>

module NHRun.Entities {
  export class Platform extends Phaser.Sprite implements IEntity {
    constructor (game: Phaser.Game, x: number, y: number, width: number, height: number, color: string = '#000') {
      var bmp = new Phaser.BitmapData(game, 'ground-bmp', width, height);
      bmp.ctx.beginPath();
      bmp.ctx.fillStyle = color;
      bmp.ctx.fillRect(0, 0, width, height);

      super(game, x, y, bmp);
    }

    initPhysics () {
      this.body.immovable = true;
    }

    onUpdate (cursors: Phaser.CursorKeys) {

    }
  }
}
