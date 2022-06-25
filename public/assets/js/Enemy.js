import GenericMovableObject from './GenericMovableObject.js';
import Sprite from './Sprite.js';
import { TILE_WIDTH, TILE_HEIGHT } from './Constants.js';
import { assetImage } from './Main.js';

class Enemy extends GenericMovableObject {
  constructor(enemyImg, name, position_x, position_y, width, height) {
    super(enemyImg, name, position_x, position_y, width, height);
  }
}

class Goomba extends Enemy {
  constructor({ x, y }) {
    let goombaImg = new Sprite(assetImage, 115, 5, 16, 16);
    super(goombaImg, 'goomba', x, y, TILE_WIDTH, TILE_HEIGHT);
    this.velocity.set(1.5, 0);
    this.isGrounded = false;
    this.type = 'goomba';
  }
  move(blocks) {
    this.position.x += this.velocity.x;
    blocks.forEach((block) => {
      if (
        block.position.x - this.position < TILE_WIDTH ||
        this.position.x - block.position.x < TILE_WIDTH
      ) {
        if (this.checkRectangularCollision(block)) {
          this.velocity.x *= -1;
        }
      }
    });
  }
  update() {}
}

export { Goomba };
