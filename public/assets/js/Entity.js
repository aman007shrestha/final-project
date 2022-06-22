import { Vector } from './Maths.js';

class Entity {
  constructor(sprite, type, posX, posY, width, height) {
    this.velocity = new Vector(0, 0);
    this.position = new Vector(posX, posY);
    this.sprite = sprite;
    this.type = type;
    this.width = width;
    this.height = height;
  }
}
export default Entity;
