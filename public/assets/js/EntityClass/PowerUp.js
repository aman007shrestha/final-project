import GenericMovableObject from '../GenericClass/GenericMovableObject.js';
import Sprite from '../GenericClass/Sprite.js';
import {
  TILE_WIDTH,
  TILE_HEIGHT,
  POWER_UP_VELOCITY,
  POWER_UP,
} from '../Constants.js';
import { assetImage, globalObject } from '../Main.js';
import { useGravity } from '../Utilities/Utils.js';

/**
 * class creates powerUp object which inherits GenericMovableObject
 */
class PowerUpClass extends GenericMovableObject {
  /**
   * @param {Number} x, y position of powerUp
   */
  constructor({ x, y }) {
    console.log(x, y);
    let powerUpImg = new Sprite(assetImage, 625, 5, 16, 16);
    super(powerUpImg, POWER_UP, x, y, TILE_WIDTH, TILE_HEIGHT);
    this.velocity.set(...POWER_UP_VELOCITY);
    this.type = POWER_UP;
    this.isActive = false;
  }

  // @desc move only when entity appear on screen
  move(blocks) {
    if (
      this.position.x > -TILE_WIDTH &&
      this.position.x < globalObject.canvas.width
    ) {
      useGravity(this);
    }
    this.position.x += this.velocity.x;
    // @desc check powerUp collision with blocks only for within TILE_WIDTH range
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

export { PowerUpClass };
