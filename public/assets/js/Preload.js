const loadImage = (url) =>
  new Promise((resolve, reject) => {
    const loadedImage = new Image();
    loadedImage.addEventListener('load', () => resolve(loadedImage));
    loadedImage.addEventListener('error', () => reject(error));
    loadedImage.src = url;
  });
// @param: loads image prior to game init
const preLoader = () => {
  const imagesSource = ['tiles', 'castle', 'clouds', 'mountain', 'spritesheet'];
  let imageSrc = imagesSource.map((image) => `./assets/image/${image}.png`);
  const loadTiles = loadImage(imageSrc[0]);
  const loadCastle = loadImage(imageSrc[1]);
  const loadCloud = loadImage(imageSrc[2]);
  const loadMountain = loadImage(imageSrc[3]);
  const loadSpriteSheet = loadImage(imageSrc[4]);
  return Promise.all([
    loadTiles,
    loadCastle,
    loadCloud,
    loadMountain,
    loadSpriteSheet,
  ]);
};
export { preLoader };
