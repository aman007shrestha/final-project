import { GenericObject } from './GenericClass/GenericObject.js';
import { loadLevel } from './loadLevel.js';
import { loadMarioSprite, loadWorldSprite } from './assetLoader.js';
const canvas = document.getElementById('main-game');
const context = canvas.getContext('2d');
Promise.all([loadMarioSprite(), loadLevel('1.1.json')]).then(
  ([marioSprite, level]) => {
    // marioSprite.draw('idle', context, 50, 50);
    // console.log(worldSprite, 'world');
    // worldSprite.draw('sky', context, 10, 12);
  }
);
