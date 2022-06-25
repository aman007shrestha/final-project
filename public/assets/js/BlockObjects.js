import {
  PIPE_BOTTOM_LEFT_ID,
  PIPE_BOTTOM_RIGHT_ID,
  PIPE_TOP_LEFT_ID,
  PIPE_TOP_RIGHT_ID,
  GROUND_ID,
  STONE_ID,
  BRICK_ID,
  TREASURE_ID,
} from './constants.js';
import { globalObject, tilesImage } from './main.js';

class BlockObject {
  constructor({ position, elementId }) {
    this.position = position;
    this.elementId = elementId;
    this.width = 60;
    this.height = 60;
    this.tileIndex = [
      Math.floor(this.position.x / 60),
      Math.floor(this.position.y / 60),
    ];
  }
  drawBlock = () => {
    switch (this.elementId) {
      case GROUND_ID:
        this.type = 'ground';
        globalObject.drawImagesOnCanvasFromSprite(
          tilesImage,
          0,
          0,
          16,
          16,
          this.position.x,
          this.position.y,
          60,
          60
        );
        break;
      case BRICK_ID:
        this.type = 'brick';
        globalObject.drawImagesOnCanvasFromSprite(
          tilesImage,
          16 * 22,
          0,
          16,
          16,
          this.position.x,
          this.position.y,
          60,
          60
        );
        break;
      case STONE_ID:
        this.type = 'stone';
        globalObject.drawImagesOnCanvasFromSprite(
          tilesImage,
          0,
          16,
          16,
          16,
          this.position.x,
          this.position.y,
          60,
          60
        );
        break;
      case PIPE_TOP_LEFT_ID:
        this.type = 'pipe';
        globalObject.drawImagesOnCanvasFromSprite(
          tilesImage,
          0,
          16 * 10,
          16,
          16,
          this.position.x,
          this.position.y,
          60,
          60
        );
        break;
      case PIPE_TOP_RIGHT_ID:
        this.type = 'pipe';
        globalObject.drawImagesOnCanvasFromSprite(
          tilesImage,
          16,
          16 * 10,
          16,
          16,
          this.position.x,
          this.position.y,
          60,
          60
        );
        break;
      case PIPE_BOTTOM_LEFT_ID:
        this.type = 'pipe';
        globalObject.drawImagesOnCanvasFromSprite(
          tilesImage,
          0,
          16 * 11,
          16,
          16,
          this.position.x,
          this.position.y,
          60,
          60
        );
        break;
      case PIPE_BOTTOM_RIGHT_ID:
        this.type = 'pipe';
        globalObject.drawImagesOnCanvasFromSprite(
          tilesImage,
          16,
          16 * 11,
          16,
          16,
          this.position.x,
          this.position.y,
          60,
          60
        );
        break;
      case TREASURE_ID:
        this.type = 'treasure';
        // console.log(this.tileIndex);
        globalObject.drawImagesOnCanvasFromSprite(
          tilesImage,
          16 * 24,
          0,
          16,
          16,
          this.position.x,
          this.position.y,
          60,
          60
        );
        break;
    }
  };
}
export default BlockObject;
