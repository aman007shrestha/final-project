let eventsInput = {
  // @ mario should be able to jump only once upon persistent key press jump
  jumpable: true,
  pressed: {},
  init(mario) {
    addEventListener('keydown', (e) => {
      this.pressed[e.code] = true;
      mario.isMoving = true;
    });
    addEventListener('keyup', (e) => {
      if (e.code === 'ArrowUp') {
        this.jumpable = true;
      }
      mario.isMoving = false;
      console.log(mario);
      delete this.pressed[e.code];
    });
  },
  update(marioObject) {
    let mario = marioObject;
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
    }
    if (this.isPressed('ArrowLeft')) {
      mario.moveLeft();
      delete this.pressed.ArrowRight;
    }
  },
  isPressed(key) {
    return this.pressed[key];
  },
  remove() {
    removeEventListener('keydown', (e) => {
      this.pressed[e.code] = true;
      if (e.code === 'ArrowUp') {
      }
    });
    removeEventListener('keyup', (e) => {
      if (e.code === 'ArrowUp') {
        this.jumpable = true;
      }
      delete this.pressed[e.code];
    });
  },
};
export default eventsInput;
