import GenericObject from './GenericObject.js';
import Sprite from './Sprite.js';
import { useGravity } from './utils.js';
import { globalObject } from './main.js';

class Mario extends GenericObject {
  constructor(spritesheet, position_x, position_y, width, height) {
    let marioImg = new Sprite(spritesheet, 650, 5, 16, 16);
    super(marioImg, 'mario', position_x, position_y, width, height);
    this.velocity.set(2, 0);
    this.width = 50;
    this.tiles = [
      Math.floor(this.position.x / 60),
      Math.floor(this.position.y / 60),
    ];
    this.isJumping = false;
    this.isBig = false;
    this.isGrounded = false;
    // Load sprites for animation
    this.movingDirection = 'rightWalk';
    // this.animation = {
    //   small: {
    //     leftWalk: {
    //       [new Sprite(marioImg)]
    //     },
    //     rightWalk: {},
    //     standRight: {},
    //     standLeft: {},
    //     jumpLeft: {},
    //     jumpRight: {},
    //   },
    // };
  }

  update() {
    if (!this.isGrounded) {
      useGravity(this);
    }
    this.tiles = [
      Math.floor(this.position.x / 60),
      Math.floor(this.position.y / 60),
    ];
    this.draw(globalObject.ctx);
  }
  //@desc Responses to event listeners
  moveRight() {
    let currentFrame = 0;
    this.position.x += this.velocity.x;
  }
  moveLeft() {
    if (this.position.x <= 1) {
      return;
    }
    let currentFrame = 0;
    this.position.x -= this.velocity.x;
  }
  jump() {
    let currentFrame = 0;
    this.velocity.y -= 11;
    this.isJumping = true;
    this.isGrounded = false;
  }
  checkRectangularCollision(entity) {
    return (
      this.position.x < entity.position.x + entity.width &&
      this.position.x + this.width > entity.position.x &&
      this.position.y < entity.position.y + entity.height &&
      this.position.y + this.height > entity.position.y
    );
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
        // bottom
        if (
          this.position.y > entity.position.y &&
          this.velocity.y < 0 &&
          this.position.x + this.width > entity.position.x
        ) {
          this.position.y = entity.position.y + entity.height;
          this.velocity.y *= -1;
          console.log('bottom called');
          return;
        }
        // top
        if (
          this.position.y < entity.position.y &&
          this.velocity.y >= 0 &&
          this.position.x + this.width > entity.position.x
        ) {
          console.log('top called');
          this.position.y = entity.position.y - this.height - 1;
          this.velocity.y = 1;
          this.isJumping = false;
        }
        // left
        if (
          this.position.x < entity.position.x &&
          this.position.y >= entity.position.y
        ) {
          console.log('right  called');
          this.position.x = entity.position.x - this.width;
        }
        // right
        if (
          this.position.x > entity.position.x &&
          this.position.y >= entity.position.y
        ) {
          console.log('left');
          this.position.x = entity.position.x + entity.width;
        }
      }
    }
  }
}
export default Mario;
