import GenericMovableObject from '../GenericClass/GenericMovableObject.js';
import Sprite from '../GenericClass/Sprite.js';
import { useGravity } from '../Utilities/Utils.js';
import { globalObject } from '../Main.js';
import {
  MARIO_SPRITE,
  MARIO_INITIAL_COORDINATES,
  MARIO_INTIAL_VELOCITY,
  MARIO,
  MARIO_SMALL,
  MARIO_RESPAWN_INTERVAL,
  MARIO_FRAME_REPEATING_INTERVAL,
  MARIO_NUMBER_OF_FRAMES,
  RIGHT,
  LEFT,
  JUMP_VELOCITY,
} from '../Constants.js';

/**
 * Class Mario creates mario object
 */
class Mario extends GenericMovableObject {
  /**
   *
   * @param {Img} spritesheet  Sprite Image containing mario
   * @param {Number} position_x x position of mario entity in canvas
   * @param {Number} position_y y position of mario entity in canvas
   * @param {Number} width width of mario in canvas
   * @param {Number} height height of mario in canvas
   */
  constructor(spritesheet, position_x, position_y, width, height) {
    let marioImg = new Sprite(spritesheet, ...MARIO_INITIAL_COORDINATES);
    super(marioImg, MARIO, position_x, position_y, width, height);
    this.velocity.set(...MARIO_INTIAL_VELOCITY);
    this.movingDirection = RIGHT;
    this.size = MARIO_SMALL;
    this.isSpawning = false;
    this.isJumping = false;
    this.isMoving = false;
    this.hasStar = false;
    this.isGrounded = false;
    this.isDead = false;
    this.isControllable = true;
  }

  // @desc updates mario in canvas accordingly (Gravity Implementation, frames manipulation, falling logic)
  update() {
    if (!this.isGrounded) {
      useGravity(this);
    }
    // update frame for each animation
    const frame = Math.floor(
      (globalObject.frame % MARIO_FRAME_REPEATING_INTERVAL) /
        (MARIO_FRAME_REPEATING_INTERVAL / MARIO_NUMBER_OF_FRAMES)
    );
    // Animation of dead mario
    if (this.isDead) {
      [this.sprite.sx, this.sprite.sy, this.sprite.sw, this.sprite.sh] =
        MARIO_SPRITE.small.dead;
      this.draw(globalObject.ctx);
      return;
    }
    // Movement animation, if jumping No movement animation
    if (this.isMoving && !this.isJumping) {
      [this.sprite.sx, this.sprite.sy, this.sprite.sw, this.sprite.sh] =
        MARIO_SPRITE[this.size][this.movingDirection][frame];
    } else {
      if (!this.isJumping) {
        [this.sprite.sx, this.sprite.sy, this.sprite.sw, this.sprite.sh] =
          MARIO_SPRITE[this.size].stand[this.movingDirection];
      }
      if (this.isJumping) {
        [this.sprite.sx, this.sprite.sy, this.sprite.sw, this.sprite.sh] =
          MARIO_SPRITE[this.size].jump[this.movingDirection];
      }
    }
    // reduce lives if mario falls , play sound and init Level after interval
    if (this.position.y > globalObject.canvas.height) {
      if (!this.isDead) {
        globalObject.level.lives -= 1;
      }
      clearInterval(globalObject.level.timerInterval);
      this.isDead = true;
      this.isControllable = false;
      globalObject.sounds.marioDeath.play();
      setTimeout(() => {
        globalObject.level.initObjects();
      }, MARIO_RESPAWN_INTERVAL);
    }
    this.draw(globalObject.ctx);
  }

  //@desc Based on events, update right positioning if controllable
  moveRight() {
    if (!this.isControllable) {
      return;
    }
    this.movingDirection = RIGHT;
    this.isMoving = true;
    this.position.x += this.velocity.x;
  }

  // @desc Based on events, update left positioning if controllable and mario is within canvas
  moveLeft() {
    if (!this.isControllable) {
      return;
    }
    this.isMoving = true;
    if (this.position.x <= 1) {
      return;
    }
    this.movingDirection = LEFT;
    this.position.x -= this.velocity.x;
  }

  // @desc Jump if controllabe, play sound for jump
  jump() {
    if (!this.isControllable) {
      return;
    }
    globalObject.sounds.jump.play();
    this.isMoving = false;
    this.velocity.y -= JUMP_VELOCITY;
    this.isJumping = true;
    this.isGrounded = false;
  }
}
export default Mario;
