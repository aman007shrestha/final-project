import { preLoader } from './Preload.js';
import { map } from './Constants.js';
import LevelConsumer from './LevelConsumer.js';
import Selectors from './DomSelector.js';
import globalObject from './GlobalObect.js';
import MapEditor from './MapEditor.js';
let tilesImage;
let castleImage;
let assetImage;
let cloudImage;
let mountainImage;
let level;
let playerName;

class HomeScreen {
  constructor(marioImg) {
    this.handlePlayerInfo();
    globalObject.canvas.style.display = 'none';
    this.intro = document.createElement('div');
    this.intro.classList.add('intro');
    const introImg = document.createElement('img');
    introImg.src = marioImg.src;
    introImg.classList.add('intro--img');
    this.intro.appendChild(introImg);
    const buttonsWrapper = document.createElement('div');
    buttonsWrapper.classList.add('intro--buttons');
    buttonsWrapper.style.display = 'flex';
    this.playButton = document.createElement('button');
    this.playButton.innerHTML = 'Play';
    buttonsWrapper.appendChild(this.playButton);
    this.savedLevels = document.createElement('button');
    this.savedLevels.innerHTML = 'Saved Level';
    buttonsWrapper.appendChild(this.savedLevels);
    this.createMap = document.createElement('button');
    this.createMap.innerHTML = 'create map';
    buttonsWrapper.appendChild(this.createMap);
    this.intro.appendChild(buttonsWrapper);
    Selectors.containerSelector.appendChild(this.intro);
    this.defineEvents();
  }
  defineEvents() {
    this.playButton.addEventListener('click', () => {
      if (!globalObject.playerName) {
        Selectors.notificationSelector.innerHTML = 'Input Player Name first';
        Selectors.notificationSelector.style.display = 'block';
        setTimeout(() => {
          Selectors.notificationSelector.style.display = 'none';
        }, 3000);
        return;
      }

      this.intro.style.display = 'none';
      globalObject.canvas.style.display = 'block';
      const game = new Game();
      game.init();
    });
    this.createMap.addEventListener('click', () => {
      if (!globalObject.playerName) {
        Selectors.notificationSelector.innerHTML = 'Input Player Name first';
        Selectors.notificationSelector.style.display = 'block';
        setTimeout(() => {
          Selectors.notificationSelector.style.display = 'none';
        }, 3000);
        return;
      }
      this.intro.style.display = 'none';
      // globalObject.canvas.style.display = 'block';
      Selectors.mapEditor.style.display = 'flex';
      new MapEditor();
    });
  }
  handlePlayerInfo() {
    Selectors.nameSubmitSelector.addEventListener('click', (e) => {
      e.preventDefault();
      const playerName = Selectors.playerNameSelector.value;
      if (playerName.length < 3) {
        Selectors.notificationSelector.innerHTML =
          'Name cannot be less than 3 character';
        Selectors.notificationSelector.style.display = 'block';
        setTimeout(() => {
          Selectors.notificationSelector.style.display = 'none';
        }, 3000);
        return;
      }
      this.intro.style.filter = 'blur(0px)';
      globalObject.playerName = playerName;
      console.log(globalObject.playerName);
      Selectors.nameFormSelector.style.display = 'none';
    });
  }
}

class Game {
  constructor() {}
  init() {
    level = new LevelConsumer(map);
    globalObject.level = level;
    this.update();
  }
  update() {
    function play() {
      globalObject.frame += 1;
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
  ([
    tilesSprite,
    castleSprite,
    cloudSprite,
    mountainSprite,
    assetsSprite,
    marioImg,
  ]) => {
    tilesImage = tilesSprite;
    castleImage = castleSprite;
    cloudImage = cloudSprite;
    mountainImage = mountainSprite;
    assetImage = assetsSprite;
    Selectors.preloaderSelector.style.display = 'none';
    new HomeScreen(marioImg);
  }
);

export { globalObject, tilesImage, assetImage };
