// @param accepts 2d array of entities id
import BlockObject from './BlockObjects.js';
import { Goomba } from './Enemy.js';
import { assetImage, globalObject } from './Main.js';
import Mario from './Mario.js';
import eventsInput from './Events.js';
import {
  CANVAS_HEIGHT,
  CANVAS_WIDTH,
  TILE_HEIGHT,
  TILE_WIDTH,
  DEFAULT_LIVES,
  GOOMBA_ID,
} from './Constants.js';

class LevelConsumer {
  constructor(levelMap) {
    this.lives = DEFAULT_LIVES;
    this.levelMap = levelMap;
    this.initObjects();
  }
  initObjects() {
    this.entities = [];
    this.enemies = [];
    this.mario = new Mario(assetImage, 175, 0, TILE_WIDTH, TILE_HEIGHT);
    eventsInput.init();
    this.mario.draw(globalObject.ctx);
    this.levelMap.forEach((row, i) => {
      row.forEach((elementId, j) => {
        if (elementId !== 0 && (elementId <= 10 || elementId > 400)) {
          this.entities.push(
            new BlockObject({
              position: {
                x: TILE_WIDTH * j,
                y: TILE_HEIGHT * i,
              },
              elementId,
            })
          );
        } else if (elementId > 10 && elementId <= 20) {
          if (elementId === GOOMBA_ID) {
            this.enemies.push(
              new Goomba({
                x: TILE_WIDTH * j,
                y: TILE_HEIGHT * i,
              })
            );
          }
        }
      });
    });
    this.entities.forEach((entity) => {
      entity.initBlock();
    });
  }

  update() {
    globalObject.ctx.clearRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);
    globalObject.ctx.fillStyle = '#64acfc';
    globalObject.ctx.fillRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);
    eventsInput.update(this.mario);
    let viewPortFraction;
    if (this.mario.position.x >= globalObject.canvas.width / 2) {
      this.mario.position.x -= 2;
      viewPortFraction = 2;
    } else {
      viewPortFraction = 0;
    }
    this.entities.forEach((blockObject) => {
      if (blockObject.position.x > -TILE_WIDTH) {
        blockObject.position.x = blockObject.position.x - viewPortFraction;
      }
      //draw entity only for visible range
      if (
        blockObject.position.x > -60 &&
        blockObject.position.x < globalObject.canvas.width
      ) {
        blockObject.drawBlock();
        if (
          blockObject.position.x <
          globalObject.canvas.width / 2 + TILE_WIDTH
        ) {
          this.mario.checkBlockCollision(blockObject);
        }
      }
    });
    this.enemies.forEach((enemy) => {
      if (enemy.position.x > -TILE_WIDTH) {
        enemy.position.x = enemy.position.x - viewPortFraction;
      }
      if (
        enemy.position.x > -TILE_WIDTH &&
        enemy.position.x < globalObject.canvas.width
      ) {
        enemy.draw();
        if (enemy.type === 'goomba') {
          enemy.move(this.entities);
        }
      }
      if (enemy.position.x < globalObject.canvas.width / 2 + TILE_WIDTH) {
        if (this.mario.checkVerticalCollision(enemy)) {
          console.log('enemyDead');
          if (this.enemies.indexOf(enemy) > -1) {
            this.enemies.splice(this.enemies.indexOf(enemy), 1);
          }
          return;
        }
        if (this.mario.checkHorizontalCollision(enemy)) {
          console.log('Mario died');
        }
        return;
      }
    });
    this.mario.update(globalObject.ctx);
  }
  reset() {
    this.entities = [];
    this.enemies = [];
  }
}
export default LevelConsumer;
