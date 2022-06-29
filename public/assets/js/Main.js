import { preLoader } from './Preload.js';
import { map } from './Constants.js';
import LevelConsumer from './LevelConsumer.js';
import Selectors from './DomSelector.js';
// import globalObject from './GlobalObect.js';
import MapEditor from './MapEditor.js';
import SavedLevel from './SavedLevels.js';
import { notification } from './Utils.js';
import GlobalObject from './GlobalObect.js';
let tilesImage;
let castleImage;
let assetImage;
let cloudImage;
let mountainImage;
let level;
let playerName;
let globalObject;
let marioImg;

class HomeScreen {
  constructor(marioImg) {
    this.handlePlayerInfo();
    // globalObject.canvas.style.display = 'none';
    Selectors.mapEditor.style.display = 'none';
    Selectors.mainMenu.style.display = 'none';

    this.intro = document.createElement('div');
    this.intro.classList.add('intro');
    Selectors.introSelector = this.intro;
    this.intro.style.display = 'flex';
    if (globalObject.playerName) {
      this.intro.style.filter = 'blur(0px)';
    }
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
    console.log('Home screen');
  }

  defineEvents() {
    this.playButton.addEventListener('click', () => {
      if (!globalObject.playerName) {
        notification('Input Player Name first');
        return;
      }
      console.log('Play clicked');
      this.intro.style.display = 'none';
      // globalObject.canvas.style.display = 'block';
      globalObject.game = new Game(map);
    });

    this.createMap.addEventListener('click', () => {
      if (!globalObject.playerName) {
        notification('Input Player Name first');
        return;
      }
      this.intro.style.display = 'none';
      Selectors.mapEditor.style.display = 'flex';
      globalObject.editor = new MapEditor();
    });

    this.savedLevels.addEventListener('click', () => {
      if (!globalObject.playerName) {
        notification('Input Player Name first');
        return;
      }
      this.intro.style.display = 'none';
      Selectors.savedLevel.style.display = 'flex';
      globalObject.savedLevel = new SavedLevel();
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
  constructor(map) {
    // globalObject.canvas.style.display = 'block';
    level = new LevelConsumer(map);
    Selectors.mainMenu.style.display = 'block';
    globalObject.level = level;
    this.update();
    console.log('Globbball', globalObject);
  }
  update() {
    function play() {
      globalObject.frame += 1;
      level.update();
      globalObject.animationFrame = requestAnimationFrame(play);
    }
    play();
  }
  reset() {
    location.reload();
  }
}

// @desc loads images from promises assigns images to global variable initializes Game
preLoader()
  .then(
    ([
      tilesSprite,
      castleSprite,
      cloudSprite,
      mountainSprite,
      assetsSprite,
      mario,
    ]) => {
      tilesImage = tilesSprite;
      castleImage = castleSprite;
      cloudImage = cloudSprite;
      mountainImage = mountainSprite;
      assetImage = assetsSprite;
      Selectors.preloaderSelector.style.display = 'none';
      marioImg = mario;
      Selectors.nameFormSelector.style.display = 'flex';
      return marioImg;
    }
  )
  .then((marioImg) => {
    globalObject = new GlobalObject();
    globalObject.homescreen = new HomeScreen(marioImg);
  });

export { globalObject, tilesImage, assetImage, HomeScreen, Game, marioImg };
