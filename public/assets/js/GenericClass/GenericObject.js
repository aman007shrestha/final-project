/*  @desc all objects are derived from this generic class.
    create method creates and maps a canvas per name of the object eg: "ground" "pipe"
    draw method draws the created canvas on the main canvas
*/
class GenericObject {
  constructor(spriteImage, width, height) {
    this.spriteImage = spriteImage;
    this.width = width;
    this.height = height;
    this.objects = new Map();
  }
  // source name with source width and height @ source x and y position
  create(name, sx, sy, width, height) {
    const genericCanvas = document.createElement('canvas');
    genericCanvas.width = this.width;
    genericCanvas.height = this.height;
    const genericContext = genericCanvas.getContext('2d');
    console.log(sy);
    genericContext.drawImage(
      this.spriteImage,
      sx,
      sy,
      width,
      height,
      0,
      0,
      width,
      height
    );
    this.objects.set(name, genericCanvas);
  }
  //
  createTile(name, x, y) {
    this.create(name, x * this.width, y * this.height, this.width, this.height);
  }
  // Draw an object
  // call via myObj.draw('brick', context, 100,200)
  // get object from map based on name
  draw(name, context, x, y) {
    const drawObject = this.objects.get(name);
    context.drawImage(drawObject, x, y);
  }
  //
  drawTile(name, context, x, y) {
    this.draw(name, context, x * this.width, y * this.height);
  }
}
window.GenericObject = GenericObject;

export { GenericObject };
