let eventsInput = {
  // @ mario should be able to jump only once upon persistent key press jump
  jumpable: true,
  pressed: {},
  init() {
    addEventListener('keydown', (e) => {
      this.pressed[e.code] = true;
      if (e.code === 'ArrowUp') {
      }
    });
    addEventListener('keyup', (e) => {
      if (e.code === 'ArrowUp') {
        this.jumpable = true;
      }
      delete this.pressed[e.code];
    });
  },
  update(gameObj) {
    let mario = gameObj.entities.mario;
    if (this.isPressed('ArrowUp')) {
      if (this.jumpable) {
        if (!mario.isJumping) {
          mario.jump();
        }
        this.jumpable = false;
      }
    }
    if (this.isPressed('ArrowRight')) {
      mario.moveRight();
      delete this.pressed.ArrowLeft;
    }
    if (this.isPressed('ArrowDown')) {
      console.log('Arrow Up');
    }
    if (this.isPressed('ArrowLeft')) {
      mario.moveLeft();
      delete this.pressed.ArrowRight;
    }
  },
  isPressed(key) {
    return this.pressed[key];
  },
};
export default eventsInput;
