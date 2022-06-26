import {
  PIPE_BOTTOM_LEFT_ID,
  PIPE_BOTTOM_RIGHT_ID,
  PIPE_TOP_LEFT_ID,
  PIPE_TOP_RIGHT_ID,
  GROUND_ID,
  STONE_ID,
  BRICK_ID,
  TREASURE_ID,
  TILE_HEIGHT,
  TILE_WIDTH,
  SPRITE_HEIGHT,
  SPRITE_WIDTH,
} from './Constants.js';
import { globalObject, tilesImage } from './Main.js';

class BlockObject {
  constructor({ position, elementId, size }) {
    this.position = position;
    this.elementId = elementId;
    this.width = size ? size : TILE_WIDTH;
    this.height = size ? size : TILE_HEIGHT;
    this.frame = 0;
    this.tileIndex = [
      Math.floor(this.position.x / TILE_WIDTH),
      Math.floor(this.position.y / TILE_HEIGHT),
    ];
  }
  initBlock = (ctx) => {
    switch (this.elementId) {
      case GROUND_ID:
        this.type = 'ground';
        this.spriteCoordinates = [0, 0, SPRITE_WIDTH, SPRITE_HEIGHT];
        this.drawBlock(ctx);
        break;
      case BRICK_ID:
        this.type = 'brick';
        this.spriteCoordinates = [16 * 22, 0, SPRITE_WIDTH, SPRITE_HEIGHT];
        this.drawBlock(ctx);
        break;
      case STONE_ID:
        this.type = 'stone';
        this.spriteCoordinates = [0, 16, SPRITE_WIDTH, SPRITE_HEIGHT];
        this.drawBlock(ctx);
        break;
      case PIPE_TOP_LEFT_ID:
        this.type = 'pipe';
        this.spriteCoordinates = [0, 16 * 10, SPRITE_WIDTH, SPRITE_HEIGHT];
        this.drawBlock(ctx);
        break;
      case PIPE_TOP_RIGHT_ID:
        this.type = 'pipe';
        this.spriteCoordinates = [16, 16 * 10, SPRITE_WIDTH, SPRITE_HEIGHT];
        this.drawBlock(ctx);
        break;
      case PIPE_BOTTOM_LEFT_ID:
        this.type = 'pipe';
        this.spriteCoordinates = [0, 16 * 11, SPRITE_WIDTH, SPRITE_HEIGHT];
        this.drawBlock(ctx);
        break;
      case PIPE_BOTTOM_RIGHT_ID:
        this.type = 'pipe';
        this.spriteCoordinates = [16, 16 * 11, SPRITE_WIDTH, SPRITE_HEIGHT];
        this.drawBlock(ctx);
        break;
      case TREASURE_ID:
        this.type = 'treasure';
        this.isOpen = false;
        this.spriteCoordinates = [16 * 24, 0, SPRITE_WIDTH, SPRITE_HEIGHT];
        this.drawBlock(ctx);
        break;
    }
  };
  drawBlock(ctx) {
    this.frame += 1;
    if (this.type === 'treasure') {
      if (!this.isOpen) {
        if (this.frame % 20 === 0) {
          let treasureSprite = [16 * 24, 16 * 25, 16 * 26];
          let currentFrame = (this.frame / 10) % treasureSprite.length;
          this.spriteCoordinates[0] = treasureSprite[currentFrame];
        }
      }
    }
    ctx.drawImage(
      tilesImage,
      ...this.spriteCoordinates,
      this.position.x,
      this.position.y,
      this.width,
      this.height
    );
  }
}
export default BlockObject;
