// Gravity implementation
import {
  BLOCK,
  GAME_PAGE,
  MAP_EDITOR_PAGE,
  NONE,
  SAVED_LEVEL_PAGE,
} from './Constants.js';
import Selectors from './DomSelector.js';
import { globalObject } from './Main.js';
import { HomeScreen, marioImg } from './Main.js';
const useGravity = (entity) => {
  entity.velocity.y += 0.3;
  entity.position.y += entity.velocity.y;
};

const notification = (message) => {
  Selectors.notificationSelector.innerHTML = message;
  Selectors.notificationSelector.style.display = BLOCK;
  setTimeout(() => {
    Selectors.notificationSelector.style.display = NONE;
  }, 3000);
};

const backMenu = () => {
  Selectors.containerSelector.removeChild(Selectors.introSelector);
  if (globalObject.currentPage === GAME_PAGE) {
    Selectors.gameSelector.removeChild(Selectors.gameCanvas);
    cancelAnimationFrame(globalObject.animationFrame);
  } else if (globalObject.currentPage === SAVED_LEVEL_PAGE) {
    console.log('wassabi');
    Selectors.savedLevel.removeChild(Selectors.levelsWrapper);
  } else if (globalObject.currentPage === MAP_EDITOR_PAGE) {
    Selectors.mapEditor.removeChild(Selectors.editorCanvas);
    Selectors.mapEditor.removeChild(Selectors.tileSelector);
  }

  Selectors.mainMenu.removeEventListener('click', backMenu);
  globalObject.homescreen = new HomeScreen(marioImg);
};

export { useGravity, notification, backMenu };
