// @param accepts 2d array of entities id
import BlockObject from './BlockObjects.js';
class LevelConsumer {
  constructor(levelMap) {
    this.entities = [];
    this.lives = 5;
    this.levelMap = levelMap;
    this.initObjects();
  }
  // mario enemy
  initObjects() {
    this.entities = [];
    this.levelMap.forEach((row, i) => {
      row.forEach((elementId, j) => {
        this.entities.push(
          new BlockObject({
            position: {
              x: 60 * j,
              y: 60 * i,
            },
            elementId,
          })
        );
      });
    });
  }
  update() {
    this.entities.forEach((entity) => {
      entity.drawBlock();
    });
  }
}
export default LevelConsumer;
