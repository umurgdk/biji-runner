/// <reference path="../../../typings/tsd.d.ts"/>

module NHRun.Entities {
  export interface IEntity {
    // Called after entity placed into physics
    initPhysics ();

    // Called every update cycle
    onUpdate (cursor: Phaser.CursorKeys);
  }
}
