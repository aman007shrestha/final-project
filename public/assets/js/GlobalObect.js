/**
 * Class - holds all the global object throught out the game
 * ctx, frame, level instance
 */
class GlobalObject {
  constructor() {
    this.frame = 0;
  }
  // @desc draws image from sprite to position coordinate input by user
  drawImagesOnCanvasFromSprite = function (
    image,
    sourceX,
    sourceY,
    sourceWidth,
    sourceHeight,
    position_x,
    position_y,
    width,
    height
  ) {
    this.ctx.drawImage(
      image,
      sourceX,
      sourceY,
      sourceWidth,
      sourceHeight,
      position_x,
      position_y,
      width,
      height
    );
  };
}

export default GlobalObject;
