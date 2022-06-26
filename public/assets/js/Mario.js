import GenericMovableObject from './GenericMovableObject.js';
import Sprite from './Sprite.js';
import { useGravity } from './Utils.js';
import { globalObject } from './Main.js';
import { SPRITE_WIDTH, SPRITE_HEIGHT } from './Constants.js';

class Mario extends GenericMovableObject {
  constructor(spritesheet, position_x, position_y, width, height) {
    let marioImg = new Sprite(spritesheet, 650, 5, 16, 16);
    super(marioImg, 'mario', position_x, position_y, width, height);
    this.velocity.set(2, 0);
    this.isSpawning = false;
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
    if (this.position.y > globalObject.canvas.height) {
      console.log(this.position.y);
      console.log(globalObject.canvas.height);
      globalObject.level.lives -= 1;
      if (globalObject.level.lives <= 0) {
        alert('Game Over');
      }
      globalObject.level.initObjects();
    }
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
    this.velocity.y -= 12;
    this.isJumping = true;
    this.isGrounded = false;
  }
}
export default Mario;
