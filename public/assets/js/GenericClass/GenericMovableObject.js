import { Vector } from '../Utilities/Maths.js';
import { globalObject } from '../Main.js';
import {
  MARIO_SMALL,
  BOUNCE_BACK,
  DEAD_JUMP,
  BRICK,
  FLAG,
  GOOMBA,
  GROUND,
  PIPE,
  STONE,
  TREASURE,
  POWER_UP,
  TREASURE_OPEN_X,
  CANVAS_HEIGHT,
} from '../Constants.js';

/**
 * class create object for all movable objects
 */
class GenericMovableObject {
  /**
   *
   * @param {img} sprite sprite images of entity
   * @param {String} name name of movable object
   * @param {Number} position_x x position of movable object
   * @param {Number} position_y y position of movable object
   * @param {Number} width width of movable object
   * @param {Number} height height of movable object
   */
  constructor(sprite, name, position_x, position_y, width, height) {
    this.velocity = new Vector(0, 0);
    this.position = new Vector(position_x, position_y);
    this.sprite = sprite;
    this.name = name;
    this.width = width;
    this.height = height;
  }
  /**
   * @desc draw entity
   */
  draw() {
    globalObject.drawImagesOnCanvasFromSprite(
      this.sprite.image,
      this.sprite.sx,
      this.sprite.sy,
      this.sprite.sw,
      this.sprite.sh,
      this.position.x,
      this.position.y,
      this.width,
      this.height
    );
  }

  /**
   *
   * @param {Object} entity Entity whose collision is to be checked agains this object
   * @returns Bool
   */
  checkRectangularCollision(entity) {
    return (
      this.position.x < entity.position.x + entity.width &&
      this.position.x + this.width > entity.position.x &&
      this.position.y < entity.position.y + entity.height &&
      this.position.y + this.height > entity.position.y
    );
  }
  /**
   *
   * @param {Object} entity Entity whose collision is to be checked agains this object
   * @returns Null, True
   */
  checkHorizontalCollision(entity) {
    // no collision check if entity is dead or mario is spawning
    if (!entity.isAlive) {
      return;
    }
    if (this.isSpawning) {
      return;
    }
    if (this.checkRectangularCollision(entity)) {
      if (entity.type === GOOMBA) {
        if (
          this.position.x >= entity.position.x &&
          this.position.y + this.height > entity.position.y + entity.height / 2
        ) {
          this.position.x = entity.position.x + entity.width;
          this.velocity.y = DEAD_JUMP;
          entity.velocity.x = 0;
          this.isJumping = true;
          return true;
        } else if (
          this.position.x <= entity.position.x &&
          this.position.y + this.height > entity.position.y + entity.height / 2
        ) {
          this.position.x = entity.position.x - this.width;
          if (this.size === MARIO_SMALL) {
            this.velocity.x = 0;
            this.velocity.y = DEAD_JUMP;
            entity.velocity.x = 0;
            this.isJumping = true;
          }
          return true;
        }
      }
    }
  }
  /**
   *
   * @param {Object} entity entity Entity whose collision is to be checked agains this object
   * @returns Null, True
   */
  checkVerticalCollision(entity) {
    if (!entity.isAlive) {
      return;
    }
    if (this.checkRectangularCollision(entity)) {
      if (
        this.position.y + this.height <
        entity.position.y + entity.height / 2
      ) {
        entity.isAlive = false;
        this.velocity.y = BOUNCE_BACK;
        return true;
      }
    }
  }
  /**
   *
   * @param {Object} entity entity entity Entity whose collision is to be checked agains this object
   * @returns true, Null
   */
  checkBlockCollision(entity) {
    if (this.checkRectangularCollision(entity)) {
      // Collision with flag leads to game win
      if (entity.type === FLAG && !globalObject.level.gameWin) {
        if (
          this.position.x + this.width / 2 >=
          entity.position.x + entity.width / 2
        ) {
          globalObject.level.gameWin = true;
          globalObject.level.flagScore =
            Math.floor(CANVAS_HEIGHT - globalObject.level.mario.position.y) * 5;
          globalObject.level.mario.isControllable = false;
        }
        return;
      }
      // Collision with other entities leads to positioning set of movable objects
      if (
        entity.type === PIPE ||
        entity.type === STONE ||
        entity.type === BRICK ||
        entity.type === TREASURE ||
        entity.type === GROUND
      ) {
        if (
          this.position.y > entity.position.y + entity.height / 2 &&
          this.velocity.y < 0
        ) {
          this.position.y = entity.position.y + entity.height;
          this.velocity.y *= -1;
          if (entity.type === TREASURE) {
            globalObject.sounds.coin.play();
            globalObject.level.coins += 1;
            globalObject.level.score += 200;
            entity.isOpen = true;
            entity.spriteCoordinates[0] = TREASURE_OPEN_X;
            globalObject.level.powerUps.forEach((powerUp) => {
              if (
                powerUp.position.x < entity.position.x + entity.width &&
                powerUp.position.x + powerUp.width > entity.position.x
              ) {
                powerUp.active = true;
              }
            });
          }
          return;
        }

        if (
          this.position.x < entity.position.x &&
          this.position.y >= entity.position.y
        ) {
          if (this.type === GOOMBA || this.type === POWER_UP) {
            this.velocity.x *= -1;
            return;
          }
          this.position.x = entity.position.x - this.width - 2;
          return;
        }

        if (
          this.position.x > entity.position.x &&
          this.position.y >= entity.position.y
        ) {
          if (this.type === GOOMBA || this.type === POWER_UP) {
            this.velocity.x *= -1;
            return;
          }
          this.position.x = entity.position.x + entity.width + 2;
          return;
        }

        if (
          this.position.y < entity.position.y - entity.height / 2 &&
          this.velocity.y > 0
        ) {
          this.position.y = entity.position.y - this.height - 1;
          this.velocity.y = 1;
          this.isJumping = false;
        }
      }
    }
  }
}
export default GenericMovableObject;
