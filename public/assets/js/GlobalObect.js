import { CANVAS_WIDTH, CANVAS_HEIGHT } from './Constants.js';
import Selectors from './DomSelector.js';
import { HomeScreen, marioImg } from './Main.js';

class GlobalObject {
  constructor() {
    // this.canvas = document.getElementById('main-game');
    // this.canvas.height = CANVAS_HEIGHT;
    // this.canvas.width = CANVAS_WIDTH;
    // this.ctx = this.canvas.getContext('2d');
    this.frame = 0;
    // this.ctx.imageSmoothingEnabled = false;
  }
  drawImagesOnCanvasFromSprite = function (
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
    this.ctx.drawImage(
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
  // backMenu() {
  //   Selectors.containerSelector.removeChild(Selectors.introSelector);
  //   if (this.currentPage === 'game') {
  //     console.log("game apage");
  //     Selectors.gameSelector.removeChild(Selectors.gameCanvas);
  //     cancelAnimationFrame(this.animationFrame);
  //   } else if (this.currentPage === 'savedLevel') {
  //     Selectors.savedLevel.removeChild(Selectors.levelsWrapper);
  //   } else if (this.currentPage === 'mapEditor') {
  //     Selectors.mapEditor.removeChild(Selectors.editorCanvas);
  //     Selectors.mapEditor.removeChild(Selectors.tileSelector);
  //   }

  //   Selectors.mainMenu.removeEventListener('click', this.backMenu);

  //   this.homescreen = new HomeScreen(marioImg);
  // }
}

export default GlobalObject;
