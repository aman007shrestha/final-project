// @param accepts 2d array of entities id
import BlockObject from './GenericClass/BlockObjects.js';
import { Goomba } from './EntityClass/Enemy.js';
import { assetImage, globalObject } from './Main.js';
import { backMenu } from './Utilities/Utils.js';
import { PowerUpClass } from './EntityClass/PowerUp.js';
import Mario from './EntityClass/Mario.js';
import { notification } from './Utilities/Utils.js';
import eventsInput from './Utilities/Events.js';
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
  MARIO_INITIAL_POSITION_X,
  MARIO_INITIAL_POSITION_Y,
} from './Constants.js';
import Selectors from './Utilities/DomSelector.js';

/**
 * class responsible for entire events during a particular level
 */
class LevelConsumer {
  /**
   *
   * @param {Array} levelMap 2d Array of position of entities by entityId
   * @param {object} customLevel if Present , denotes this is custom level
   */
  constructor(levelMap, customLevel) {
    this.customLevel = customLevel;
    this.levelMap = levelMap;
    this.lives = DEFAULT_LIVES;
    this.score = 0;
    this.gameWin;
    this.scoreSaved = false;
    // create canvas and add to Selectors attributes gameCanvas
    this.canvas = document.createElement('canvas');
    this.canvas.height = CANVAS_HEIGHT;
    this.canvas.width = CANVAS_WIDTH;
    Selectors.gameCanvas = this.canvas;
    Selectors.gameSelector.appendChild(this.canvas);
    globalObject.canvas = this.canvas;
    // create Context for canvas
    globalObject.ctx = globalObject.canvas.getContext('2d');
    // pixelated images
    globalObject.ctx.imageSmoothingEnabled = false;
    globalObject.currentPage = GAME_PAGE;
    this.initObjects();
    this.handleEvent();
  }
  /**
   * @desc initializes entities for new level, also useful when mario dies to reposition it to start
   */
  initObjects() {
    // Collection of block objects
    this.entities = [];
    // Collection of enemy Object
    this.enemies = [];
    // Collection of enemies Object
    this.powerUps = [];

    this.score = 0;
    this.timer = 0;
    this.timerInterval = setInterval(() => {
      this.timer++;
    }, 1000);
    // Create mario instance
    this.mario = new Mario(
      assetImage,
      MARIO_INITIAL_POSITION_X,
      MARIO_INITIAL_POSITION_Y,
      TILE_WIDTH,
      TILE_HEIGHT
    );
    // Intialize input events
    eventsInput.init(this.mario);
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
      if (!this.customLevel) {
        if (!this.scoreSaved) {
          this.databaseScoreAppend();
          this.scoreSaved = true;
        }
      }
      console.log('won the game');
      // Win Animation

      // Send Backend request to save highscore {playerName, Timing, score}
      return;
    }

    if (this.lives <= 0) {
      this.gameWin = false;
      console.log(this.gameWin);
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
          return;
        }

        if (this.mario.hasStar && this.mario.checkRectangularCollision(enemy)) {
          console.log('enemyDied');
          globalObject.sounds.stomp.play();
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
          globalObject.sounds.stomp.play();
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
            globalObject.sounds.powerDown.play();
            this.mario.size = 'small';
            this.mario.height = TILE_HEIGHT;
            console.log('He is small and spawning');
            this.mario.isSpawning = true;
            setTimeout(() => {
              this.mario.isSpawning = false;
            }, 2000);
          } else {
            this.mario.isDead = true;
            globalObject.sounds.marioDeath.play();
            clearInterval(this.timerInterval);
            this.mario.isControllable = false;
            // Dead Animation
            this.lives -= 1;
            console.log(this.lives);
            this.score = 0;
            setTimeout(() => {
              this.mario.isDead = false;
              this.initObjects();
            }, 5000);
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
              globalObject.sounds.powerUp.play();
              this.mario.size = 'big';
              this.mario.height = 60;
            }, 200);
          }
        }
      });
    }
    this.mario.update(globalObject.ctx);
    this.UiUpdate();
  }
  reset() {
    this.entities = [];
    this.enemies = [];
  }
  UiUpdate() {
    globalObject.ctx.font = '32px marioFont';
    globalObject.ctx.fillStyle = 'white';
    globalObject.ctx.fillText(`Lives ${this.lives}`, 600, 50);
    globalObject.ctx.fillText(`Time ${this.timer}`, 800, 50);
    globalObject.ctx.fillText(`Score ${this.score}`, 1000, 50);
  }
  handleEvent() {
    Selectors.mainMenu.addEventListener(CLICK_EVENT, backMenu);
    Selectors.nightMode.addEventListener(CLICK_EVENT, () => {
      console.log('clicked');
      if (Selectors.gameSelector.style.backgroundColor !== 'transparent') {
        Selectors.gameSelector.style.backgroundColor = 'transparent';
        Selectors.gameSelector.style.backgroundImage = 'none';
      } else {
        // console.log(cloudImage);
        // Selectors.gameSelector.style.backgroundImage =
        //   "url('./public/assets/image/clouds.png')";
        Selectors.gameSelector.style.backgroundColor = '#87ceeb';
      }
    });
  }

  async databaseScoreAppend() {
    const rawData = {
      player: globalObject.playerName,
      score: this.score,
      time: this.timer,
    };
    const jsonData = JSON.stringify(rawData);
    console.log(jsonData);
    const response = await fetch('http://127.0.0.1:5005/api/score', {
      method: 'POST',
      body: jsonData,
      headers: {
        'Content-type': 'application/json; charset=UTF-8',
      },
    });
    const data = await response.json();
    if (data.success) {
      notification('Score Saved');
    }
  }
}

export default LevelConsumer;
