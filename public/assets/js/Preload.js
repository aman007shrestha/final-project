import { IMAGE_SOURCE } from './Constants.js';
/**
 *
 * @param {String} url url belonging to particular image
 * @returns Promise to the particular image
 */
const loadImage = (url) =>
  new Promise((resolve, reject) => {
    const loadedImage = new Image();
    loadedImage.addEventListener('load', () => resolve(loadedImage));
    loadedImage.addEventListener('error', () => reject(error));
    loadedImage.src = url;
  });

/**
 * @desc initializes all the promises associated to image prior to loading
 * @returns combined promised which is either resolved or rejected
 */
const preLoader = () => {
  const imagesSource = IMAGE_SOURCE;
  // creates src based on just name of image
  let imageSrc = imagesSource.map((image) => `./assets/image/${image}.png`);
  const loadTiles = loadImage(imageSrc[0]);
  const loadClouds = loadImage(imageSrc[1]);
  const loadItems = loadImage(imageSrc[2]);
  const loadIntroText = loadImage(imageSrc[3]);
  const loadSpriteSheet = loadImage(imageSrc[4]);
  const marioImg = loadImage(imageSrc[5]);
  return Promise.all([
    loadTiles,
    loadClouds,
    loadItems,
    loadIntroText,
    loadSpriteSheet,
    marioImg,
  ]);
};
export { preLoader };
