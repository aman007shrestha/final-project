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
  }
  drawBlock = () => {
    switch (this.elementId) {
      case GROUND_ID:
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
