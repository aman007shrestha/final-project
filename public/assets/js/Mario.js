import Entity from './Entity.js';
import Sprite from './Sprite.js';
import { useGravity } from './utils.js';

class Mario extends Entity {
  constructor(spritesheet, position_x, position_y, width, height) {
    let marioImg = new Sprite(spritesheet, 650, 5, 16, 16);
    super(marioImg, 'mario', position_x, position_y, width, height);
    this.velocity.set(0.8, 0);
    console.log(this.velocity);
    this.isJumping = false;
    this.isJumping = false;
    this.isGrounded = true;
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
  draw(ctx) {
    ctx.drawImage(
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
  update(ctx) {
    this.checkCollision(ctx);
    useGravity(this);
    this.draw(ctx);
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
    let THRESHOLD = 30;
    this.isJumping = true;
    this.isGrounded = false;
    this.velocity.y -= 3;
  }
  // @desc check for collision update grounded and jumping boolean
  checkCollision(ctx) {
    if (this.position.y + this.height >= 200 && this.velocity.y > 0) {
      this.velocity.y = 0;
      this.position.y = 184;
      this.isGrounded = true;
      // load anim for standing
      this.isJumping = false;
      return true;
    }
  }
}
export default Mario;
