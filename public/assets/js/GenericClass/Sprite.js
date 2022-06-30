/**
 * Class creates sprite object consisting of source properties
 */
class Sprite {
  constructor(image, sourcex, sourcey, sourcew, sourceh) {
    this.image = image;
    this.sx = sourcex;
    this.sy = sourcey;
    this.sw = sourcew;
    this.sh = sourceh;
  }
}
export default Sprite;
