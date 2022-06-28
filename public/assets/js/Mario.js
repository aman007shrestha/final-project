import GenericMovableObject from './GenericMovableObject.js';
import Sprite from './Sprite.js';
import { useGravity } from './Utils.js';
import { globalObject, assetImage } from './Main.js';
import {
  SPRITE_WIDTH,
  SPRITE_HEIGHT,
  marioSprite,
  RIGHT,
  LEFT,
} from './Constants.js';
let movingDirection;

class Mario extends GenericMovableObject {
  constructor(spritesheet, position_x, position_y, width, height) {
    let marioImg = new Sprite(spritesheet, 650, 5, 16, 16);
    super(marioImg, 'mario', position_x, position_y, width, height);
    this.velocity.set(2, 0);
    this.isSpawning = false;
    this.isJumping = false;
    this.isMoving = false;
    this.isBig = false;
    this.hasStar = false;
    this.isGrounded = false;
    this.isDead = false;
    // Load sprites for animation
    movingDirection = 'right';
    // Update sx and sy
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
    console.log(this);
  }

  update() {
    if (!this.isGrounded) {
      useGravity(this);
    }
    if (this.isDead) {
      console.log('hey');
      [this.sprite.sx, this.sprite.sy, this.sprite.sw, this.sprite.sh] =
        marioSprite.small.dead;
      this.draw(globalObject.ctx);
      return;
    }
    const frame = Math.floor((globalObject.frame % 24) / 8);
    if (this.isMoving && !this.isJumping) {
      [this.sprite.sx, this.sprite.sy, this.sprite.sw, this.sprite.sh] =
        marioSprite.small[movingDirection][frame];
    } else {
      if (!this.isJumping) {
        [this.sprite.sx, this.sprite.sy, this.sprite.sw, this.sprite.sh] =
          marioSprite.small.stand[movingDirection];
      }
      if (this.isJumping) {
        [this.sprite.sx, this.sprite.sy, this.sprite.sw, this.sprite.sh] =
          marioSprite.small.jump[movingDirection];
      }
    }

    if (this.position.y > globalObject.canvas.height) {
      globalObject.level.lives -= 1;
      globalObject.level.initObjects();
    }
    this.draw(globalObject.ctx);
  }
  //@desc Responses to event listeners
  moveRight() {
    movingDirection = RIGHT;
    this.isMoving = true;
    this.position.x += this.velocity.x;
  }
  moveLeft() {
    this.isMoving = true;
    if (this.position.x <= 1) {
      return;
    }

    movingDirection = LEFT;
    this.position.x -= this.velocity.x;
  }
  jump() {
    this.isMoving = false;
    this.velocity.y -= 10;
    this.isJumping = true;
    this.isGrounded = false;
  }
}
export default Mario;
