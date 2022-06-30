import GenericMovableObject from '../GenericClass/GenericMovableObject.js';
import Sprite from '../GenericClass/Sprite.js';
import {
  TILE_WIDTH,
  TILE_HEIGHT,
  GOOMBA,
  GOOMBA_COORDINATES,
  GOOMBA_VELOCITY,
  GOOMBA_ANIMATION_SOURCE,
  GOOMBA_DEAD_SX,
  GOOMBA_ANIMATION_INTERVAL,
  GOOMBA_ANIMATION_CHANGE_INTERVAL,
} from '../Constants.js';
import { assetImage, globalObject } from '../Main.js';
import { useGravity } from '../Utilities/Utils.js';

/**
 * class inherits GenericMovableObject
 * returns enemy Object
 */
class Enemy extends GenericMovableObject {
  /**
   * @param {img} enemyImg - entity image from sprite
   * @param {String} name - name of enemy
   * @param {Number} position- position of enemy in canvas
   * @param {Number} width, height - width and height of enemy in canvas
   */
  constructor(enemyImg, name, position_x, position_y, width, height) {
    super(enemyImg, name, position_x, position_y, width, height);
  }
}

/**
 * Goomba inherits from Enemy
 * created goomba object
 */
class Goomba extends Enemy {
  /**
   *
   * @param {Number} x, y - position of enemy in canvas
   */
  constructor({ x, y }) {
    let goombaImg = new Sprite(assetImage, ...GOOMBA_COORDINATES);
    super(goombaImg, GOOMBA, x, y, TILE_WIDTH, TILE_HEIGHT);
    this.velocity.set(...GOOMBA_VELOCITY);
    this.type = GOOMBA;
    this.isGrounded = false;
    this.isAlive = true;
    this.spriteSource = GOOMBA_ANIMATION_SOURCE;
  }
  // @desc Goomba checks block and move accordingly
  move(blocks) {
    // renders dead animation frame for goomba
    if (!this.isAlive) {
      this.sprite.sx = GOOMBA_DEAD_SX;
      return;
    }
    // Apply Gravity and move Goomba only when goomba appears on screen
    if (
      this.position.x > -TILE_WIDTH &&
      this.position.x < globalObject.canvas.width
    ) {
      useGravity(this);
      this.position.x += this.velocity.x;
    }
    // Apply sprite change on each animation interval
    if (globalObject.frame % GOOMBA_ANIMATION_INTERVAL === 0) {
      let currentSx =
        (globalObject.frame / GOOMBA_ANIMATION_CHANGE_INTERVAL) %
        this.spriteSource.length;
      this.sprite.sx = this.spriteSource[currentSx];
    }
    // check Block Collision only when block entity is within the distance of tile width range
    blocks.forEach((block) => {
      if (
        block.position.x - this.position < TILE_WIDTH ||
        this.position.x - block.position.x < TILE_WIDTH
      ) {
        this.checkBlockCollision(block);
      }
    });
  }
}

export { Goomba };
