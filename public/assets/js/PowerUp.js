import GenericMovableObject from './GenericMovableObject.js';
import Sprite from './Sprite.js';
import { TILE_WIDTH, TILE_HEIGHT } from './Constants.js';
import { assetImage, globalObject } from './Main.js';
import { useGravity } from './Utils.js';

class PowerUpClass extends GenericMovableObject {
  constructor({ x, y }) {
    console.log(x, y);
    let powerUpImg = new Sprite(assetImage, 625, 5, 16, 16);
    super(powerUpImg, 'powerUp', x, y, TILE_WIDTH, TILE_HEIGHT);
    this.velocity.set(1.5, 0);
    this.type = 'powerUp';
    this.isActive = false;
  }

  move(blocks) {
    if (
      this.position.x > -TILE_WIDTH &&
      this.position.x < globalObject.canvas.width
    ) {
      useGravity(this);
    }
    this.position.x += this.velocity.x;

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
