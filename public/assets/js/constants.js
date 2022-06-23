export const CANVAS_HEIGHT = 600;
export const CANVAS_WIDTH = 1200;

export const PRESSED = 'PRESSED';
export const RELEASED = 'RELEASED';
export const THRESHOLD_JUMP = 50;
export const GROUND_ID = 1;
export const BRICK_ID = 2;
export const STONE_ID = 3;
export const PIPE_TOP_LEFT_ID = 411;
export const PIPE_TOP_RIGHT_ID = 412;
export const PIPE_BOTTOM_LEFT_ID = 421;
export const PIPE_BOTTOM_RIGHT_ID = 422;
export const TREASURE_ID = 5;
export default {
  CANVAS_HEIGHT: 800,
};
export const map = [
  [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 0, 0, 411, 412, 0, 0, 0],
  [0, 0, 0, 0, 0, 0, 0, 421, 422, 0, 0, 0],
  [0, 0, 0, 0, 0, 0, 0, 421, 422, 0, 0, 0],
  [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
  [0, 0, 0, 2, 2, 2, 5, 0, 0, 0, 0, 0],
  [0, 0, 0, 2, 0, 0, 0, 0, 3, 0, 0, 0],
  [0, 0, 0, 0, 0, 0, 0, 0, 3, 3, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 3, 3, 0, 0],
  [0, 0, 0, 2, 0, 0, 0, 0, 3, 3, 3, 0, 0, 0, 411, 412, 0, 0, 0, 0, 3, 3, 3, 0],
  [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0, 0, 421, 422, 1, 1, 1, 1, 1, 1, 1, 1],
];
