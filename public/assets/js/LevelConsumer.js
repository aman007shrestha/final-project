// @param accepts 2d array of entities id
import BlockObject from './BlockObjects.js';
import { TILE_HEIGHT, TILE_WIDTH, DEFAULT_LIVES } from './constants.js';
import { globalObject } from './main.js';
class LevelConsumer {
  constructor(levelMap) {
    this.entities = [];
    this.enemies = [];
    this.lives = DEFAULT_LIVES;
    this.levelMap = levelMap;
    this.initObjects();
  }
  initObjects() {
    this.entities = [];
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
  }
  update() {
    let updatedEntities = [];
    let viewPortFraction;
    if (
      globalObject.entities.mario.position.x >=
      globalObject.canvas.width / 2
    ) {
      globalObject.entities.mario.position.x -= 2;
      viewPortFraction = 2;
    } else {
      viewPortFraction = 0;
    }
    this.entities.forEach((blockObject) => {
      if (blockObject.position.x > -60) {
        updatedEntities.push(
          new BlockObject({
            position: {
              x: blockObject.position.x - viewPortFraction,
              y: blockObject.position.y,
            },
            elementId: blockObject.elementId,
          })
        );
      }
    });
    this.entities = updatedEntities;
    this.entities.forEach((entity) => {
      // check collision only for visible range draw entity only for visible range
      if (
        entity.position.x > -60 &&
        entity.position.x < globalObject.canvas.width
      ) {
        entity.drawBlock();
        if (entity.position.x < globalObject.canvas.width / 2 + 60) {
          globalObject.entities.mario.checkBlockCollision(entity);
        }
      }
    });
  }
}
export default LevelConsumer;
