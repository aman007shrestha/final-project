import {
  ARROWLEFT,
  ARROWRIGHT,
  ARROWUP,
  KEYDOWN,
  KEYUP,
} from '../Constants.js';

/**
 * @desc checks key event puts it in pressed object, checks on pressed  object to call mario move methods
 */
let eventsInput = {
  /**
   * @desc jumpable: boolean - mario should only jump once even during continous jump press
   */
  jumpable: true,
  pressed: {},
  /**
   *
   * @param {object} mario  mario object passed to update state of moving - used during animation
   * @desc creates event Listeners
   */
  init(mario) {
    /**
     * @desc for keydown event
     */
    addEventListener(KEYDOWN, (e) => {
      this.pressed[e.code] = true;
      mario.isMoving = true;
    });
    /**
     * @desc for keyup event
     */
    addEventListener(KEYUP, (e) => {
      if (e.code === ARROWUP) {
        this.jumpable = true;
      }
      mario.isMoving = false;
      delete this.pressed[e.code];
    });
  },
  /**
   *
   * @param {object} mario
   * @desc call methods of mario based on key pressed
   */
  update(mario) {
    if (this.isPressed(ARROWUP)) {
      if (this.jumpable) {
        if (!mario.isJumping) {
          mario.jump();
        }
        this.jumpable = false;
      }
    }
    // Move right
    if (this.isPressed(ARROWRIGHT)) {
      mario.moveRight();
      delete this.pressed.ArrowLeft;
    }
    // Move left
    if (this.isPressed(ARROWLEFT)) {
      mario.moveLeft();
      delete this.pressed.ArrowRight;
    }
  },
  /**
   *
   * @param {Number} key keycode
   * @returns Boolean
   */
  isPressed(key) {
    return this.pressed[key];
  },
};

export default eventsInput;
