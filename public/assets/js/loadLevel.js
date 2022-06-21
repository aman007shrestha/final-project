// loads level be it from editor or from saved
// @param: JSON file

import { loadWorldSprite } from './assetLoader.js';

function loadLevel(levelName) {
  return Promise.all([
    fetch(`./assets/js/levels/${levelName}`).then((res) => res.json()),
    loadWorldSprite(),
  ]).then(([levelInfo, worldSprite]) => {
    // call Level class populate with levelInfo and worldSprite to get world
    console.log(levelInfo);
    console.log(worldSprite);
  });
}

export { loadLevel };
