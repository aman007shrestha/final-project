// Gravity implementation
import Selectors from './DomSelector.js';
import { globalObject } from './Main.js';
import { HomeScreen, marioImg } from './Main.js';
const useGravity = (entity) => {
  entity.velocity.y += 0.18;
  entity.position.y += entity.velocity.y;
};

const notification = (message) => {
  Selectors.notificationSelector.innerHTML = message;
  Selectors.notificationSelector.style.display = 'block';
  setTimeout(() => {
    Selectors.notificationSelector.style.display = 'none';
  }, 3000);
};

const backMenu = () => {
  Selectors.containerSelector.removeChild(Selectors.introSelector);
  if (globalObject.currentPage === 'game') {
    Selectors.gameSelector.removeChild(Selectors.gameCanvas);
    cancelAnimationFrame(globalObject.animationFrame);
  } else if (globalObject.currentPage === 'savedLevel') {
    Selectors.savedLevel.removeChild(Selectors.levelsWrapper);
  } else if (globalObject.currentPage === 'mapEditor') {
    Selectors.mapEditor.removeChild(Selectors.editorCanvas);
    Selectors.mapEditor.removeChild(Selectors.tileSelector);
  }

  Selectors.mainMenu.removeEventListener('click', backMenu);

  globalObject.homescreen = new HomeScreen(marioImg);
};

export { useGravity, notification, backMenu };
