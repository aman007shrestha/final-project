// @param accepts 2d array of entities id
import BlockObject from './GenericClass/BlockObjects.js';
import { Goomba } from './EntityClass/Enemy.js';
import { assetImage, globalObject, cloudsImage } from './Main.js';
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
  EMPTY_OBJECT,
  BLOCK_OBJECT_RANGE,
  BLOCK_OBJECT_PIPE_RANGE,
  ENEMY_OBJECT_RANGE,
  VIEWPORT_REDUCTION,
  GOOMBA,
  ENEMY_REMOVAL_INTERVAL,
  MARIO_BIG,
  MARIO_SMALL,
  MARIO_SPAWN_INTERVAL,
  MARIO_DEAD_ANIMATION_INTERVAL,
  BIG_MARIO_HEIGHT,
  SMALL_MARIO_HEIGHT,
  POWERUP_CONSUME_INTERVAL,
  GAME_INFO_SCORE_X,
  GAME_INFO_TIMER_X,
  GAME_INFO_LIVES_X,
  GAME_INFO_Y,
  GAME_INFO_COINS_X,
  SKY_COLOR,
  SCORE_API,
  MESSAGE_API,
  GROUND,
  FLAG,
  BLACK,
  NONE,
  WRITE_CENTER_Y,
  WRITE_CENTER_X,
  WIN_MSG,
  LOSE_MSG,
  WHITE,
  MARIO_SPRITE,
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
    this.flagScore;
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
    this.coins = 0;
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
    // Iterate map and create objects based on ID
    this.levelMap.forEach((row, i) => {
      row.forEach((elementId, j) => {
        if (
          elementId !== EMPTY_OBJECT &&
          (elementId <= BLOCK_OBJECT_RANGE ||
            elementId > BLOCK_OBJECT_PIPE_RANGE)
        ) {
          this.entities.push(
            new BlockObject({
              position: {
                x: TILE_WIDTH * j,
                y: TILE_HEIGHT * i,
              },
              elementId,
            })
          );
        } else if (
          elementId > BLOCK_OBJECT_RANGE &&
          elementId <= ENEMY_OBJECT_RANGE
        ) {
          if (elementId === GOOMBA_ID) {
            this.enemies.push(
              new Goomba({
                x: TILE_WIDTH * j,
                y: TILE_HEIGHT * i,
              })
            );
          }
        } else if (elementId === POWER_UP_ID) {
          this.powerUps.push(
            new PowerUpClass({
              x: TILE_WIDTH * j,
              y: TILE_HEIGHT * i,
            })
          );
        }
      });
    });
    // initBlock assigns coordinates in sprite to entities object based off their elementId
    this.entities.forEach((entity) => {
      entity.initBlock(globalObject.ctx);
    });
  }
  /**
   * @desc check collisions , write scores on each frame, check gameWin and send score to database
   *
   * @returns in game win, mario dead, enemy dead
   */
  update() {
    // clear timerInterval, append once to database, animate win scenario if win return
    if (this.gameWin) {
      globalObject.sounds.gameWin.play();
      clearInterval(this.timerInterval);
      if (this.mario.size === MARIO_SMALL) {
        [
          this.mario.sprite.sx,
          this.mario.sprite.sy,
          this.mario.sprite.sh,
          this.mario.sprite.sh,
        ] = MARIO_SPRITE.small.win;
      } else {
        [
          this.mario.sprite.sx,
          this.mario.sprite.sy,
          this.mario.sprite.sh,
          this.mario.sprite.sh,
        ] = MARIO_SPRITE.big.win;
      }

      while (this.flagScore !== 0) {
        this.score += 1;
        this.flagScore -= 1;
      }
      if (!this.scoreSaved) {
        if (!this.customLevel) {
          this.databaseScoreAppend();
          this.scoreSaved = true;
        } else if (this.customLevel) {
          this.sendGlobalMessage(this.customLevel);
          this.scoreSaved = true;
        }
      }
      globalObject.ctx.clearRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);
      this.mario.position.y += 1;
      this.entities.forEach((entity) => {
        entity.drawBlock(globalObject.ctx);
        this.mario.checkBlockCollision(entity);
      });
      this.mario.draw();
      this.UiUpdate();
      setTimeout(() => {
        cancelAnimationFrame(globalObject.animationFrame);
        globalObject.ctx.fillStyle = BLACK;
        globalObject.ctx.fillRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);
        this.UiUpdate();
      }, 3000);
      return;
    }

    if (this.lives <= 0) {
      this.gameWin = false;
      setTimeout(() => {
        cancelAnimationFrame(globalObject.animationFrame);
        globalObject.ctx.fillStyle = 'black';
        globalObject.ctx.fillRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);
        this.UiUpdate();
      }, 3000);
      return;
    }
    // clear canvas
    globalObject.ctx.clearRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);
    // update mario position based on events
    eventsInput.update(this.mario);
    // if mario is position at half canvas width, scroll screen by reducing viewport pixels from each objects
    let viewPortFraction;
    if (this.mario.position.x >= globalObject.canvas.width / 2) {
      this.mario.position.x -= VIEWPORT_REDUCTION;
      viewPortFraction = VIEWPORT_REDUCTION;
    } else {
      viewPortFraction = 0;
    }
    this.powerUps.forEach((powerUp) => {
      powerUp.position.x -= viewPortFraction;
    });
    // Draw entities only for visible canvas range, reduce viewport
    this.entities.forEach((blockObject) => {
      // viewport reduction
      if (blockObject.position.x > -TILE_WIDTH) {
        blockObject.position.x = blockObject.position.x - viewPortFraction;
      }
      // draw for visible range
      if (
        blockObject.position.x > -TILE_WIDTH &&
        blockObject.position.x < globalObject.canvas.width
      ) {
        blockObject.drawBlock(globalObject.ctx);
        // check collsions only for entities whose x position is less than half width of canvas
        if (
          blockObject.position.x <
          globalObject.canvas.width / 2 + TILE_WIDTH
        ) {
          this.mario.checkBlockCollision(blockObject);
        }
      }
    });
    // reduce enemy by viewport, move enemy
    this.enemies.forEach((enemy) => {
      if (enemy.position.x > -TILE_WIDTH) {
        enemy.position.x = enemy.position.x - viewPortFraction;
      }
      if (
        enemy.position.x > -TILE_WIDTH &&
        enemy.position.x < globalObject.canvas.width
      ) {
        enemy.draw();
        // apply movement logics on goomba
        if (enemy.type === GOOMBA) {
          enemy.move(this.entities);
        }
      }
      // Enemy Mario collision check, if Spawning return back
      if (enemy.position.x < globalObject.canvas.width / 2 + TILE_WIDTH) {
        if (this.mario.isSpawning) {
          return;
        }
        // Star power kills enemy
        if (this.mario.hasStar && this.mario.checkRectangularCollision(enemy)) {
          globalObject.sounds.stomp.play();
          this.score += 200;
          enemy.isALive = false;
          // remove enemy object from array
          setTimeout(() => {
            if (this.enemies.indexOf(enemy) > -1) {
              this.enemies.splice(this.enemies.indexOf(enemy), 1);
            }
          }, ENEMY_REMOVAL_INTERVAL);
          return;
        }
        // check mario vertical collision with enemy -> enemy death
        if (this.mario.checkVerticalCollision(enemy)) {
          globalObject.sounds.stomp.play();
          this.score += 200;
          enemy.isALive = false;
          enemy.velocity.x = 0;
          setTimeout(() => {
            if (this.enemies.indexOf(enemy) > -1) {
              this.enemies.splice(this.enemies.indexOf(enemy), 1);
            }
          }, ENEMY_REMOVAL_INTERVAL);
          return;
        }
        // check horizontal collision between mario and enemy
        if (this.mario.checkHorizontalCollision(enemy)) {
          // big mario turns back to small while surviving following enemy attack under spawing period
          if (this.mario.size === MARIO_BIG) {
            globalObject.sounds.powerDown.play();
            this.mario.size = MARIO_SMALL;
            this.mario.height = SMALL_MARIO_HEIGHT;
            this.mario.isSpawning = true;
            setTimeout(() => {
              this.mario.isSpawning = false;
            }, MARIO_SPAWN_INTERVAL);
          } else {
            this.mario.isDead = true;
            globalObject.sounds.marioDeath.play();
            clearInterval(this.timerInterval);
            this.mario.isControllable = false;
            this.lives -= 1;
            this.score = 0;
            setTimeout(() => {
              this.mario.isDead = false;
              this.initObjects();
            }, MARIO_DEAD_ANIMATION_INTERVAL);
          }
        }
        return;
      }
    });
    // check powerUp collision only when there is one in powerUp array
    if (this.powerUps.length > 0) {
      this.powerUps.forEach((powerUp) => {
        // power up becomes active only when treasure box is popped
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
              this.mario.size = MARIO_BIG;
              this.mario.height = BIG_MARIO_HEIGHT;
            }, POWERUP_CONSUME_INTERVAL);
          }
        }
      });
    }
    this.mario.update(globalObject.ctx);
    this.UiUpdate();
  }
  /**
   * @desc resets entities
   */
  reset() {
    this.entities = [];
    this.enemies = [];
    this.powerUps = [];
  }
  /**
   * @desc write score lives timer on each frame
   */
  UiUpdate() {
    globalObject.ctx.font = '32px marioFont';
    globalObject.ctx.fillStyle = WHITE;
    globalObject.ctx.fillText(
      `Coins ${this.coins}`,
      GAME_INFO_COINS_X,
      GAME_INFO_Y
    );
    globalObject.ctx.fillText(
      `Lives ${this.lives}`,
      GAME_INFO_LIVES_X,
      GAME_INFO_Y
    );
    globalObject.ctx.fillText(
      `Time ${this.timer}`,
      GAME_INFO_TIMER_X,
      GAME_INFO_Y
    );
    globalObject.ctx.fillText(
      `Score ${this.score}`,
      GAME_INFO_SCORE_X,
      GAME_INFO_Y
    );
    if (this.gameWin) {
      Selectors.nightMode.style.display = NONE;
      globalObject.ctx.fillText(WIN_MSG, WRITE_CENTER_X, WRITE_CENTER_Y);
    }
    if (this.gameWin === false) {
      Selectors.nightMode.style.display = NONE;
      globalObject.ctx.fillText(LOSE_MSG, WRITE_CENTER_X, WRITE_CENTER_Y);
    }
  }
  /**
   * @desc events handler for backMenu and nightmode click
   */
  handleEvent() {
    Selectors.mainMenu.addEventListener(CLICK_EVENT, backMenu);
    Selectors.nightMode.addEventListener(CLICK_EVENT, () => {
      if (
        Selectors.gameSelector.style.backgroundColor !== 'transparent' ||
        Selectors.gameSelector.style.backgroundColor === SKY_COLOR
      ) {
        Selectors.gameSelector.style.backgroundColor = 'transparent';
        Selectors.gameSelector.style.backgroundImage = 'none';
      } else {
        Selectors.gameSelector.style.backgroundColor = SKY_COLOR;
        Selectors.gameSelector.style.backgroundImage = cloudsImage.src;
      }
    });
  }
  /**
   * @desc save info in database for preset level
   */
  async databaseScoreAppend() {
    const rawData = {
      player: globalObject.playerName,
      score: this.score,
      time: this.timer,
    };
    const jsonData = JSON.stringify(rawData);
    const response = await fetch(SCORE_API, {
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
  /**
   *
   * @param {object} levelObject level info
   * @desc send global message
   */
  async sendGlobalMessage(levelObject) {
    const rawData = {
      player: 'Game',
      message: `${globalObject.playerName} scored ${this.score} playing saved level ${levelObject.level} created by ${levelObject.player}`,
    };
    const jsonData = JSON.stringify(rawData);
    const response = await fetch(MESSAGE_API, {
      method: 'POST',
      body: jsonData,
      headers: {
        'Content-type': 'application/json; charset=UTF-8',
      },
    });
    const data = await response.json();
    if (data.success) {
      notification('Message Sent');
    }
  }
}

export default LevelConsumer;
