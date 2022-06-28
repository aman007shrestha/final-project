import { Vector } from './Maths.js';
import { globalObject, marioImg } from './Main.js';

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
      if (entity.type === 'goomba') {
        if (
          this.position.x >= entity.position.x &&
          this.position.y + this.height > entity.position.y + entity.height / 2
        ) {
          console.log('left collisions');
          console.log(entity.position.y);
          console.log(this.position.y);
          this.position.x = entity.position.x + entity.width;
          this.velocity.y = -5;
          entity.velocity.x = 0;
          return true;
        } else if (
          this.position.x <= entity.position.x &&
          this.position.y + this.height > entity.position.y + entity.height / 2
        ) {
          console.log('Right collisions');
          this.position.x = entity.position.x - this.width;
          this.velocity.x = 0;
          this.velocity.y = -5;
          entity.velocity.x = 0;
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
        this.velocity.y = -3;

        return true;
      }
    }
  }
  checkBlockCollision(entity) {
    if (this.checkRectangularCollision(entity)) {
      if (
        entity.type === 'pipe' ||
        entity.type === 'stone' ||
        entity.type === 'brick' ||
        entity.type === 'treasure' ||
        entity.type === 'ground'
      ) {
        if (
          this.position.y > entity.position.y &&
          this.velocity.y < 0 &&
          this.position.x + this.width > entity.position.x
        ) {
          this.position.y = entity.position.y + entity.height;
          this.velocity.y *= -1;
          if (entity.type === 'treasure') {
            entity.isOpen = true;
            entity.spriteCoordinates[0] = 16 * 27;
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
          this.position.x + this.width > entity.position.x
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
