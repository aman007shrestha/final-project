import { preLoader } from './preload.js';
// import BackGroundEntities from './backgroundLayers.js';
import { CANVAS_WIDTH, CANVAS_HEIGHT, map } from './constants.js';

import LevelConsumer from './LevelConsumer.js';
let globalObject;
let tilesImage;
let castleImage;
let assetImage;
let cloudImage;
let mountainImage;

let level;

class Game {
  constructor() {}
  init() {
    const canvas = document.getElementById('main-game');
    canvas.height = CANVAS_HEIGHT;
    canvas.width = CANVAS_WIDTH;
    const ctx = canvas.getContext('2d');
    let entities = {};
    globalObject = {
      ctx,
      canvas,
      entities,
    };
    globalObject.ctx.fillStyle = '#64acfc';
    globalObject.ctx.fillRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);
    ctx.imageSmoothingEnabled = false;

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
    level = new LevelConsumer(map);
    globalObject.level = level;
    this.update();
  }
  update() {
    function play() {
      level.update();
      requestAnimationFrame(play);
    }
    play();
  }
  reset() {
    location.reload();
  }
}

// @desc loads images from promises assigns images to global variable initializes Game
preLoader().then(
  ([tilesSprite, castleSprite, cloudSprite, mountainSprite, assetsSprite]) => {
    tilesImage = tilesSprite;
    castleImage = castleSprite;
    cloudImage = cloudSprite;
    mountainImage = mountainSprite;
    assetImage = assetsSprite;
    const game = new Game();
    game.init();
  }
);

export { globalObject, tilesImage, assetImage };
