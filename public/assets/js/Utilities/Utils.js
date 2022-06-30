import {
  BLOCK,
  CLICK_EVENT,
  GAME_PAGE,
  GRAVITY,
  MAP_EDITOR_PAGE,
  NONE,
  NOTIFICATION_DURATION,
  SAVED_LEVEL_PAGE,
} from '../Constants.js';
import Selectors from './DomSelector.js';
import { globalObject } from '../Main.js';
import { HomeScreen, marioImg } from '../Main.js';

/**
 *
 * @param {object} entity an object which is subject to gravity
 * @desc Gravity implementation
 */
const useGravity = (entity) => {
  entity.velocity.y += GRAVITY;
  entity.position.y += entity.velocity.y;
};

/**
 *
 * @param {String} message the message which is to be displayed as notification
 * @desc popup notification with argument string for notification duration interval
 */
const notification = (message) => {
  Selectors.notificationSelector.innerHTML = message;
  Selectors.notificationSelector.style.display = BLOCK;
  setTimeout(() => {
    Selectors.notificationSelector.style.display = NONE;
  }, NOTIFICATION_DURATION);
};

/**
 * @desc decides what child to remove based on current page
 * Navigates back to homescreen
 */
const backMenu = () => {
  Selectors.containerSelector.removeChild(Selectors.introSelector);
  if (globalObject.currentPage === GAME_PAGE) {
    Selectors.gameSelector.removeChild(Selectors.gameCanvas);
    cancelAnimationFrame(globalObject.animationFrame);
  } else if (globalObject.currentPage === SAVED_LEVEL_PAGE) {
    Selectors.savedLevel.removeChild(Selectors.levelsWrapper);
  } else if (globalObject.currentPage === MAP_EDITOR_PAGE) {
    Selectors.mapEditor.removeChild(Selectors.editorCanvas);
    Selectors.mapEditor.removeChild(Selectors.tileSelector);
  }
  Selectors.mainMenu.removeEventListener(CLICK_EVENT, backMenu);
  globalObject.homescreen = new HomeScreen(marioImg);
};

export { useGravity, notification, backMenu };
