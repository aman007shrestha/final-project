class GlobalObject {
  constructor() {
    this.frame = 0;
  }
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
