// @desc returns promise of loaded image
import { GenericObject } from './GenericClass/GenericObject.js';
const loadImage = (url) =>
  new Promise((resolve, reject) => {
    const loadedImage = new Image();
    loadedImage.addEventListener('load', () => resolve(loadedImage));
    loadedImage.addEventListener('error', () => reject(error));
    loadedImage.src = url;
  });

// @desc load background assets image
const loadMarioSprite = () => {
  return loadImage('./assets/image/player.png').then((marioImage) => {
    const marioSprite = new GenericObject(marioImage, 16, 16);
    marioSprite.create('idle', 80, 32, 16, 16);
    return marioSprite;
  });
};
const loadWorldSprite = () => {
  return loadImage('./assets/image/tiles.png').then((tilesImage) => {
    const worldSprite = new GenericObject(tilesImage, 16, 16);
    worldSprite.createTile('sky', 3, 23);
    worldSprite.createTile('ground', 0, 0);
    return worldSprite;
  });
};

export { loadMarioSprite, loadWorldSprite };
