import { CANVAS_WIDTH, CANVAS_HEIGHT } from './Constants.js';

let globalObject;
const canvas = document.getElementById('main-game');
canvas.height = CANVAS_HEIGHT;
canvas.width = CANVAS_WIDTH;
const ctx = canvas.getContext('2d');
globalObject = {
  ctx,
  canvas,
  frame: 0,
};
globalObject.ctx.imageSmoothingEnabled = false;
globalObject.drawImagesOnCanvasFromSprite = function (
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
  globalObject.ctx.drawImage(
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
export default globalObject;
