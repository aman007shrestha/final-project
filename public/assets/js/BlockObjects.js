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
  FLAG_ID,
  FLAGPOLE_ID,
  GOOMBA_ID,
  FLAG,
  TREASURE,
  ENEMY,
  GROUND,
  BRICK,
  PIPE,
  STONE,
  SKYCOLOR,
  GROUND_SPRITE,
  BRICK_SPRITE,
  STONE_SPRITE,
  PIPE_TOP_LEFT_SPRITE,
  PIPE_TOP_RIGHT_SPRITE,
  PIPE_BOTTOM_LEFT_SPRITE,
  PIPE_BOTTOM_RIGHT_SPRITE,
  FLAG_SPRITE,
  FLAGPOLE_SPRITE,
  GOOMBA_SPRITE,
  POWER_UP,
  POWER_UP_ID,
  MUSHROOM_SPRITE,
} from './Constants.js';
import { assetImage, tilesImage } from './Main.js';

class BlockObject {
  constructor({ position, elementId, size }) {
    this.position = position;
    this.elementId = elementId;
    this.width = size ? size : TILE_WIDTH;
    this.height = size ? size : TILE_HEIGHT;
    this.frame = 0;
  }

  initBlock = (ctx) => {
    switch (this.elementId) {
      case 0:
        this.drawBlock(ctx, this.elementId);
        break;

      case GROUND_ID:
        this.type = GROUND;
        this.spriteCoordinates = GROUND_SPRITE;
        this.drawBlock(ctx);
        break;

      case BRICK_ID:
        this.type = BRICK;
        this.spriteCoordinates = BRICK_SPRITE;
        this.drawBlock(ctx);
        break;

      case STONE_ID:
        this.type = STONE;
        this.spriteCoordinates = STONE_SPRITE;
        this.drawBlock(ctx);
        break;

      case PIPE_TOP_LEFT_ID:
        this.type = PIPE;
        this.spriteCoordinates = PIPE_TOP_LEFT_SPRITE;
        this.drawBlock(ctx);
        break;

      case PIPE_TOP_RIGHT_ID:
        this.type = PIPE;
        this.spriteCoordinates = PIPE_TOP_RIGHT_SPRITE;
        this.drawBlock(ctx);
        break;

      case PIPE_BOTTOM_LEFT_ID:
        this.type = PIPE;
        this.spriteCoordinates = PIPE_BOTTOM_LEFT_SPRITE;
        this.drawBlock(ctx);
        break;

      case PIPE_BOTTOM_RIGHT_ID:
        this.type = PIPE;
        this.spriteCoordinates = PIPE_BOTTOM_RIGHT_SPRITE;
        this.drawBlock(ctx);
        break;

      case TREASURE_ID:
        this.type = TREASURE;
        this.isOpen = false;
        this.spriteCoordinates = [16 * 24, 0, 16, 16];
        this.drawBlock(ctx);
        break;

      case FLAG_ID:
        this.type = FLAG;
        this.spriteCoordinates = FLAG_SPRITE;
        this.drawBlock(ctx);
        break;

      case FLAGPOLE_ID:
        this.type = FLAG;
        this.spriteCoordinates = FLAGPOLE_SPRITE;
        this.drawBlock(ctx);
        break;

      case GOOMBA_ID:
        this.type = ENEMY;
        this.spriteCoordinates = GOOMBA_SPRITE;
        this.drawBlock(ctx, this.elementId);
        break;

      case POWER_UP_ID:
        this.type = POWER_UP;
        this.spriteCoordinates = MUSHROOM_SPRITE;
        this.active = false;
        this.drawBlock(ctx, this.elementId);
    }
  };

  drawBlock(ctx, element) {
    this.frame += 1;
    if (element === 0) {
      ctx.fillStyle = SKYCOLOR;
      ctx.fillRect(
        this.position.x + 1,
        this.position.y + 1,
        this.width - 1,
        this.height - 1
      );
      return;
    }

    if (element === GOOMBA_ID) {
      ctx.drawImage(
        assetImage,
        ...this.spriteCoordinates,
        this.position.x,
        this.position.y,
        this.width,
        this.height
      );
      return;
    }

    if (element === POWER_UP_ID) {
      ctx.drawImage(
        assetImage,
        ...this.spriteCoordinates,
        this.position.x,
        this.position.y,
        this.width,
        this.height
      );
      return;
    }

    if (this.type === TREASURE) {
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
