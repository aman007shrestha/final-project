// @param accepts 2d array of entities id
import BlockObject from './BlockObjects.js';
import { Goomba } from './Enemy.js';
import { assetImage, globalObject, HomeScreen, marioImg } from './Main.js';
import { backMenu } from './Utils.js';
import { PowerUpClass } from './PowerUp.js';
import Mario from './Mario.js';
import eventsInput from './Events.js';
import {
  CANVAS_HEIGHT,
  CANVAS_WIDTH,
  TILE_HEIGHT,
  TILE_WIDTH,
  DEFAULT_LIVES,
  GOOMBA_ID,
  GAME_PAGE,
  CLICK_EVENT,
  POWER_UP_ID,
} from './Constants.js';
import Selectors from './DomSelector.js';

class LevelConsumer {
  constructor(levelMap) {
    this.lives = DEFAULT_LIVES;
    this.gameWin;
    this.score = 0;
    this.levelMap = levelMap;
    this.canvas = document.createElement('canvas');
    this.canvas.height = CANVAS_HEIGHT;
    this.canvas.width = CANVAS_WIDTH;
    Selectors.gameCanvas = this.canvas;
    Selectors.gameSelector.appendChild(this.canvas);
    globalObject.canvas = this.canvas;
    globalObject.ctx = globalObject.canvas.getContext('2d');
    globalObject.ctx.imageSmoothingEnabled = false;
    globalObject.currentPage = GAME_PAGE;

    this.initObjects();
    this.handleEvent();
  }
  initObjects() {
    this.entities = [];
    this.score = 0;
    this.timer = 0;
    this.timerInterval = setInterval(() => {
      this.timer += 1;
      console.log(this.timer);
    }, 1000);
    this.enemies = [];
    this.powerUps = [];
    this.mario = new Mario(assetImage, 175, 0, TILE_WIDTH, TILE_HEIGHT);
    eventsInput.init(this.mario);
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
        } else if (elementId === POWER_UP_ID) {
          console.log(i, j);
          this.powerUps.push(
            new PowerUpClass({
              x: TILE_WIDTH * j,
              y: TILE_HEIGHT * i,
            })
          );
        }
      });
    });
    this.entities.forEach((entity) => {
      entity.initBlock(globalObject.ctx);
    });
  }

  update() {
    if (this.gameWin) {
      clearInterval(this.timerInterval);
      // Win Animation
      // Send Backend request to save highscore {playerName, Timing, score}
    }
    if (this.lives <= 0) {
      this.gameWin = false;
      console.log(gameWin);
    }
    globalObject.ctx.clearRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);
    eventsInput.update(this.mario);
    let viewPortFraction;
    if (this.mario.position.x >= globalObject.canvas.width / 2) {
      this.mario.position.x -= 2;
      viewPortFraction = 2;
    } else {
      viewPortFraction = 0;
    }
    this.powerUps.forEach((powerUp) => {
      powerUp.position.x -= viewPortFraction;
    });
    this.entities.forEach((blockObject) => {
      if (blockObject.position.x > -TILE_WIDTH) {
        blockObject.position.x = blockObject.position.x - viewPortFraction;
      }
      //draw entity only for visible range
      if (
        blockObject.position.x > -TILE_WIDTH &&
        blockObject.position.x < globalObject.canvas.width
      ) {
        blockObject.drawBlock(globalObject.ctx);
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
      // Enemy Mario collision check
      if (enemy.position.x < globalObject.canvas.width / 2 + TILE_WIDTH) {
        if (this.mario.isSpawning) {
          console.log('spawn');
          return;
        }
        if (this.mario.hasStar && this.mario.checkRectangularCollision(enemy)) {
          console.log('enemyDied');
          this.score += 200;
          console.log(this.score);
          enemy.isALive = false;
          setTimeout(() => {
            if (this.enemies.indexOf(enemy) > -1) {
              this.enemies.splice(this.enemies.indexOf(enemy), 1);
            }
          }, 2000);
          return;
        }
        if (this.mario.checkVerticalCollision(enemy)) {
          console.log('enemyDead');
          this.score += 200;
          console.log(this.score);
          enemy.isALive = false;
          enemy.velocity.x = 0;
          console.log(enemy);
          setTimeout(() => {
            if (this.enemies.indexOf(enemy) > -1) {
              this.enemies.splice(this.enemies.indexOf(enemy), 1);
            }
          }, 2000);
          return;
        }

        if (this.mario.checkHorizontalCollision(enemy)) {
          console.log('Big guy check collision to turn to small guy');
          if (this.mario.size === 'big') {
            this.mario.size = 'small';
            this.mario.height = TILE_HEIGHT;
            console.log('He is small and spawning');
            this.mario.isSpawning = true;
            setTimeout(() => {
              this.mario.isSpawning = false;
            }, 2000);
          } else {
            this.mario.isDead = true;
            clearInterval(this.timerInterval);

            // Dead Animation
            this.lives -= 1;
            console.log(this.lives);
            this.score = 0;
            setTimeout(() => {
              this.mario.isDead = false;
              this.initObjects();
            }, 2000);
          }
        }
        return;
      }
    });

    if (this.powerUps.length > 0) {
      this.powerUps.forEach((powerUp) => {
        if (powerUp.active) {
          if (powerUp.position.x > -TILE_WIDTH) {
            powerUp.position.x = powerUp.position.x - viewPortFraction;
          }
          if (
            powerUp.position.x > -TILE_WIDTH &&
            powerUp.position.x < globalObject.canvas.width
          ) {
            powerUp.draw();
            powerUp.move(this.entities);
          }
          if (this.mario.checkRectangularCollision(powerUp)) {
            setTimeout(() => {
              if (this.powerUps.indexOf(powerUp) > -1) {
                this.powerUps.splice(this.powerUps.indexOf(powerUp), 1);
              }
              this.mario.size = 'big';
              this.mario.height = 60;
            }, 200);
          }
        }
      });
    }
    this.mario.update(globalObject.ctx);
  }
  reset() {
    this.entities = [];
    this.enemies = [];
  }
  handleEvent() {
    Selectors.mainMenu.addEventListener(CLICK_EVENT, backMenu);
  }
}

export default LevelConsumer;
