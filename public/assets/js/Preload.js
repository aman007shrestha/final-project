const loadImage = (url) =>
  new Promise((resolve, reject) => {
    const loadedImage = new Image();
    loadedImage.addEventListener('load', () => resolve(loadedImage));
    loadedImage.addEventListener('error', () => reject(error));
    loadedImage.src = url;
  });
// @param: loads image prior to game init
const preLoader = () => {
  const imagesSource = [
    'tiles',
    'castle',
    'clouds',
    'marioIntro',
    'spritesheet',
    'mario1',
  ];
  let imageSrc = imagesSource.map((image) => `./assets/image/${image}.png`);
  const loadTiles = loadImage(imageSrc[0]);
  const loadCastle = loadImage(imageSrc[1]);
  const loadCloud = loadImage(imageSrc[2]);
  const loadIntroText = loadImage(imageSrc[3]);
  const loadSpriteSheet = loadImage(imageSrc[4]);
  const marioImg = loadImage(imageSrc[5]);
  return Promise.all([
    loadTiles,
    loadCastle,
    loadCloud,
    loadIntroText,
    loadSpriteSheet,
    marioImg,
  ]);
};
export { preLoader };
