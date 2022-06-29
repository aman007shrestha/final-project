import { Vector } from './Maths.js';
import { globalObject } from './Main.js';
import {
  BOUNCE_BACK,
  BRICK,
  DEAD_JUMP,
  FLAG,
  GOOMBA,
  GROUND,
  PIPE,
  STONE,
  TREASURE,
} from './Constants.js';

// @desc takes image off the spriteSheet along with name of object and the location of where to draw the image
class GenericMovableObject {
  constructor(sprite, name, position_x, position_y, width, height) {
    this.velocity = new Vector(0, 0);
    this.position = new Vector(position_x, position_y);
    this.sprite = sprite;
    this.name = name;
    this.width = width;
    this.height = height;
  }

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

  //@desc Rectangle collision with mario & (block || coin || Powerup || Enemy)
  checkRectangularCollision(entity) {
    return (
      this.position.x < entity.position.x + entity.width &&
      this.position.x + this.width > entity.position.x &&
      this.position.y < entity.position.y + entity.height &&
      this.position.y + this.height > entity.position.y
    );
  }

  checkHorizontalCollision(entity) {
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
          if (this.size === 'small') {
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

  checkBlockCollision(entity) {
    if (this.checkRectangularCollision(entity)) {
      if (entity.type === FLAG) {
        if (
          this.position.x + this.width >=
          entity.position.x + entity.width / 2
        ) {
          globalObject.level.gameWin = true;
          console.log(globalObject.level.gameWin);
        }
        return;
      }

      if (
        entity.type === PIPE ||
        entity.type === STONE ||
        entity.type === BRICK ||
        entity.type === TREASURE ||
        entity.type === GROUND
      ) {
        if (
          this.position.y > entity.position.y + entity.width / 2 &&
          this.velocity.y < 0
        ) {
          this.position.y = entity.position.y + entity.height;
          this.velocity.y *= -1;
          if (entity.type === TREASURE) {
            globalObject.level.score += 200;
            console.log(globalObject.level.score);
            entity.isOpen = true;
            entity.spriteCoordinates[0] = 16 * 27;
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
          if (this.type === 'goomba' || this.type === 'powerUp') {
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
          if (this.type === 'goomba' || this.type === 'powerUp') {
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
