import { Vector } from './Maths.js';
import { globalObject, marioImg, tilesImage } from './Main.js';

import {
  BOUNCE_BACK,
  BRICK,
  DEAD_JUMP,
  FLAG,
  GOOMBA,
  GROUND,
  PIPE,
  STONE,
  TILE_HEIGHT,
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
          this.velocity.x = 0;
          this.velocity.y = DEAD_JUMP;
          entity.velocity.x = 0;
          this.isJumping = true;
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
        console.log('vertical');
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
        )
          // Win Animation
          alert('win case');
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
          this.position.y > entity.position.y &&
          this.velocity.y < 0 &&
          this.position.x + this.width > entity.position.x &&
          entity.position.x + entity.position.y > entity.position.x
        ) {
          this.position.y = entity.position.y + entity.height;
          this.velocity.y *= -1;
          if (entity.type === TREASURE) {
            entity.isOpen = true;
            entity.spriteCoordinates[0] = 16 * 27;
            console.log(entity.position.x);
            globalObject.level.powerUps.forEach((powerUp) => {
              console.log(powerUp);
              if (
                powerUp.position.x < entity.position.x + entity.width &&
                powerUp.position.x + powerUp.width > entity.position.x
              ) {
                console.log('po');
                console.log(powerUp);
                powerUp.active = true;
              }
            });
          }
          return;
        }
        // left
        if (
          this.position.x < entity.position.x &&
          this.position.y >= entity.position.y
        ) {
          this.position.x = entity.position.x - this.width;
          return;
        }
        // right
        if (
          this.position.x > entity.position.x &&
          this.position.y >= entity.position.y
        ) {
          this.position.x = entity.position.x + entity.width;
          return;
        }
        // top
        if (
          this.position.y < entity.position.y &&
          this.velocity.y >= 0 &&
          this.position.x + this.width > entity.position.x &&
          entity.position.x + entity.position.y > this.position.x
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
