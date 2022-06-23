import GenericObject from './GenericObject.js';
import Sprite from './Sprite.js';
import { useGravity } from './utils.js';
import { globalObject } from './main.js';

class Mario extends GenericObject {
  constructor(spritesheet, position_x, position_y, width, height) {
    let marioImg = new Sprite(spritesheet, 650, 5, 16, 16);
    console.log('ma', marioImg);
    super(marioImg, 'mario', position_x, position_y, width, height);
    this.velocity.set(2, 0);
    console.log(this.velocity);
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

  update(ctx) {
    this.checkCollision(globalObject.ctx);
    if (!this.isGrounded) {
      useGravity(this);
    }

    this.draw(globalObject.ctx);
  }
  //@desc Responses to event listeners
  moveRight() {
    let currentFrame = 0;
    this.position.x += this.velocity.x;
  }
  moveLeft() {
    let currentFrame = 0;
    this.position.x -= this.velocity.x;
  }
  jump() {
    let currentFrame = 0;
    this.isJumping = true;
    this.isGrounded = false;
    this.velocity.y -= 10;
  }
  // @desc check for collision update grounded and jumping boolean
  checkCollision(ctx) {
    if (
      this.position.y + this.height >= globalObject.canvas.height &&
      this.velocity.y > 0
    ) {
      this.velocity.y = 0;
      this.position.y = globalObject.canvas.height - this.height;
      this.isGrounded = true;
      // load anim for standing
      this.isJumping = false;
      return true;
    }
  }
  checkBlockCollision(entity) {
    if (
      this.position.x <= entity.position.x + 60 &&
      this.position.x + this.width >= entity.position.x &&
      this.position.y <= entity.position.y + 60 &&
      this.position.y + this.height >= entity.position.y
    ) {
      // alert('co');
      this.isGrounded = true;
      this.isJumping = false;
      this.velocity.y = 0;
      this.position.y = entity.position.y - 60 - 1;
      // this.velocity.x = 0;
      // this.position.x = entity.position.x - 1;
    } else {
      // this.isGrounded = false;
      // this.isJumping = true;
    }
  }
}
export default Mario;
