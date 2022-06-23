// @param accepts 2d array of entities id
import BlockObject from './BlockObjects.js';
import { TILE_HEIGHT, TILE_WIDTH, DEFAULT_LIVES } from './constants.js';
import { globalObject } from './main.js';
class LevelConsumer {
  constructor(levelMap) {
    this.entities = [];
    this.lives = DEFAULT_LIVES;
    this.levelMap = levelMap;
    this.initObjects();
  }
  // mario enemy
  initObjects() {
    this.entities = [];
    let im = 1;
    this.levelMap.forEach((row, i) => {
      row.forEach((elementId, j) => {
        if (elementId !== 0) {
          this.entities.push(
            new BlockObject({
              position: {
                x: TILE_WIDTH * j,
                y: TILE_HEIGHT * i,
              },
              elementId,
            })
          );
        }
      });
    });
    console.log(this.entities);
  }
  update() {
    this.entities.forEach((entity) => {
      entity.drawBlock();
      globalObject.entities.mario.checkBlockCollision(entity);
      // console.log(entity.position);
      // console.log(globalObject.entities.mario);
      // exit(1);
    });
  }
}
export default LevelConsumer;
