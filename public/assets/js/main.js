import { preLoader } from './preload.js';
import Mario from './Mario.js';
import eventsInput from './events.js';
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
const render = {
  init() {
    globalObject.ctx.fillStyle = '#64acfc';
    globalObject.ctx.fillRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);
    let mario = globalObject.entities.mario;
    mario.draw(globalObject.ctx);
  },
  update() {
    globalObject.ctx.clearRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);
    globalObject.ctx.fillStyle = '#64acfc';
    globalObject.ctx.fillRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);
    level.update();
    globalObject.entities.mario.update(globalObject.ctx);
    eventsInput.update(globalObject);
  },
  reset() {},
};

class Game {
  constructor() {}
  init() {
    const canvas = document.getElementById('main-game');
    canvas.height = CANVAS_HEIGHT;
    canvas.width = CANVAS_WIDTH;
    const ctx = canvas.getContext('2d');
    ctx.imageSmoothingEnabled = false;
    let entities = {};
    globalObject = {
      ctx,
      canvas,
      entities,
    };
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
    console.log(globalObject);
    // ctx.scale(2, 2);
    level = new LevelConsumer(map);
    globalObject.entities.mario = new Mario(assetImage, 175, 0, 60, 60);
    render.init();
    eventsInput.init();
    this.update();
  }
  update() {
    function play() {
      render.update();
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

export { globalObject, tilesImage };
