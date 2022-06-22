import { preLoader } from './preload.js';
import Mario from './Mario.js';
import eventsInput from './events.js';

let tilesImage;
let castleImage;
let assetImage;
let cloudImage;
let mountainImage;

const render = {
  init(gameObj) {
    gameObj.ctx.fillStyle = '#64acfc';
    gameObj.ctx.fillRect(0, 0, 1600, 600);
    let mario = gameObj.entities.mario;
    mario.draw(gameObj.ctx);
  },
  update(gameObj) {
    gameObj.ctx.clearRect(0, 0, window.innerWidth, window.innerHeight);
    gameObj.ctx.fillStyle = '#64acfc';
    gameObj.ctx.fillRect(0, 0, window.innerWidth, window.innerHeight);
    gameObj.ctx.fillStyle = '#eee';
    gameObj.ctx.fillRect(
      0,
      200,
      gameObj.canvas.width,
      gameObj.canvas.height - 200
    );
    gameObj.entities.mario.update(gameObj.ctx);
    eventsInput.update(gameObj);
  },
  reset() {},
};

class Game {
  init() {
    const canvas = document.getElementById('main-game');
    canvas.height = window.innerHeight;
    canvas.width = window.innerWidth;
    const ctx = canvas.getContext('2d');
    let entities = {};
    let gameObj = {
      ctx,
      canvas,
      entities,
    };
    ctx.scale(2, 2);
    gameObj.entities.mario = new Mario(assetImage, 175, 0, 16, 16);
    render.init(gameObj);
    eventsInput.init();

    // eventsInput.init(gameObj.entities.mario);
    this.update(gameObj);
  }
  update(gameObj) {
    // game execution

    function play() {
      render.update(gameObj);

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
