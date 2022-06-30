import { preLoader } from './Preload.js';
import LevelConsumer from './LevelConsumer.js';
import Selectors from './Utilities/DomSelector.js';
import HomeScreen from './Pages/HomeScreen.js';
import GlobalObject from './GlobalObect.js';
import MarioAudio from './Utilities/MarioAudio.js';
let tilesImage;
let assetImage;
let itemsImage;
let marioIntroText;
let marioImg;
let castleImage;

/**
 * level - instance of level consumer
 * @desc global throughout the level
 * globalObject - instance of GlobalObject class
 * @desc global throughout the game
 */
let level;
let globalObject;
/**
 * class creates blueprint for game entry point
 */
class Game {
  /**
   *
   * @param {Array} map 2d array holding position of entities
   * @param {object} customLevel check if not customLevel don't put score in hall of fame
   */
  constructor(map, customLevel) {
    level = new LevelConsumer(map, customLevel);
    Selectors.mainMenu.style.display = 'block';
    globalObject.level = level;
    this.update();
  }
  /**
   * @desc Update game States
   */
  update() {
    function play() {
      globalObject.frame += 1;
      level.update();
      globalObject.animationFrame = requestAnimationFrame(play);
    }
    play();
  }
}

// @desc loads images from promises assigns images to global variable initializes Game
/**
 * @desc resolve entire promises of image
 */
preLoader()
  .then(
    ([
      tilesSprite,
      castleSprite,
      itemSprite,
      introSprite,
      assetsSprite,
      mario,
    ]) => {
      tilesImage = tilesSprite;
      castleImage = castleSprite;
      itemsImage = itemSprite;
      marioIntroText = introSprite;
      assetImage = assetsSprite;
      Selectors.preloaderSelector.style.display = 'none';
      marioImg = mario;
      return marioImg;
    }
  )
  /**
   * @desc instantiate globalObject, sounds object and homescreen object
   */
  .then((marioImg) => {
    globalObject = new GlobalObject();
    globalObject.sounds = new MarioAudio();
    globalObject.homescreen = new HomeScreen(marioImg);
  });

export {
  globalObject,
  tilesImage,
  assetImage,
  HomeScreen,
  Game,
  marioImg,
  marioIntroText,
};
