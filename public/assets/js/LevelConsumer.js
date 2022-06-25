// @param accepts 2d array of entities id
import BlockObject from './BlockObjects.js';
import { TILE_HEIGHT, TILE_WIDTH, DEFAULT_LIVES } from './constants.js';
import { assetImage, globalObject } from './main.js';
import Mario from './Mario.js';
import eventsInput from './events.js';
import { CANVAS_HEIGHT, CANVAS_WIDTH } from './constants.js';
class LevelConsumer {
  constructor(levelMap) {
    this.lives = DEFAULT_LIVES;
    this.levelMap = levelMap;
    this.initObjects();
  }
  initObjects() {
    this.entities = [];
    this.enemies = [];
    this.mario = new Mario(assetImage, 175, 0, 60, 60);
    eventsInput.init();
    this.mario.draw(globalObject.ctx);
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
    globalObject.ctx.clearRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);
    globalObject.ctx.fillStyle = '#64acfc';
    globalObject.ctx.fillRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);
    eventsInput.update(this.mario);
    this.mario.update(globalObject.ctx);
    let updatedEntities = [];
    let viewPortFraction;
    if (this.mario.position.x >= globalObject.canvas.width / 2) {
      this.mario.position.x -= 2;
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
          this.mario.checkBlockCollision(entity);
        }
      }
    });
  }
  reset() {
    this.entities = [];
    this.enemies = [];
  }
}
export default LevelConsumer;
