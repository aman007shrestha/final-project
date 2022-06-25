import { Vector } from './Maths.js';
import { globalObject } from './main.js';
// @desc takes image off the spriteSheet along with name of object and the location of where to draw the image
class GenericObject {
  constructor(sprite, name, position_x, position_y, width, height) {
    this.velocity = new Vector(0, 0);
    this.position = new Vector(position_x, position_y);
    this.sprite = sprite;
    this.name = name;
    this.width = width;
    this.height = height;
  }
  draw() {
    globalObject.drawImagesOnCanvasFromSprite(
      this.sprite.image,
      this.sprite.sx,
      this.sprite.sy,
      this.sprite.sw,
      this.sprite.sh,
      this.position.x,
      this.position.y,
      this.width,
      this.height
    );
  }
}
export default GenericObject;
