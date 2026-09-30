export const VIEWPORT_WIDTH: number = 960;
export const VIEWPORT_HEIGHT: number = 540;
export const MAX_FRAME_MS: number = 32;
export const FIXED_STEP_MS: number = 1_000 / 60;

// Well geometry. The board is centered in the 960x540 stage; the hold box
// sits on the left and the next queue on the right.
export const BOARD_COLUMNS: number = 10;
export const BOARD_ROWS: number = 20;
export const CELL_SIZE: number = 24;
export const BOARD_WIDTH: number = BOARD_COLUMNS * CELL_SIZE;
export const BOARD_HEIGHT: number = BOARD_ROWS * CELL_SIZE;
export const BOARD_ORIGIN_X: number = (VIEWPORT_WIDTH - BOARD_WIDTH) / 2;
export const BOARD_ORIGIN_Y: number = (VIEWPORT_HEIGHT - BOARD_HEIGHT) / 2;

export interface StageBox {
  x: number;
  y: number;
  width: number;
  height: number;
}

export interface StagePoint {
  x: number;
  y: number;
}

export const HOLD_CELL_SIZE: number = 24;
export const NEXT_CELL_SIZE: number = 18;
export const PREVIEW_PADDING: number = 8;
export const PREVIEW_BOX_COLUMNS: number = 4;
export const PREVIEW_BOX_ROWS: number = 2;
export const HOLD_BOX: StageBox = {
  x: 124,
  y: 110,
  width: PREVIEW_BOX_COLUMNS * HOLD_CELL_SIZE + PREVIEW_PADDING * 2,
  height: PREVIEW_BOX_ROWS * HOLD_CELL_SIZE + PREVIEW_PADDING * 2,
};
export const HOLD_LABEL_POSITION: StagePoint = { x: 124, y: 84 };
export const NEXT_BOX: StageBox = {
  x: 736,
  y: 110,
  width: PREVIEW_BOX_COLUMNS * NEXT_CELL_SIZE + PREVIEW_PADDING * 2,
  height: PREVIEW_BOX_ROWS * NEXT_CELL_SIZE + PREVIEW_PADDING * 2,
};
export const NEXT_BOX_STEP: number = 78;
export const NEXT_LABEL_POSITION: StagePoint = { x: 736, y: 84 };

// Input tuning (guideline-style DAS/ARR).
export const DAS_DELAY_MS: number = 150;
export const ARR_REPEAT_MS: number = 30;
export const SOFT_DROP_FACTOR: number = 20;

// Lock delay with capped move resets.
export const LOCK_DELAY_MS: number = 500;
export const MAX_LOCK_RESETS: number = 15;

// Gravity: seconds per row = (0.8 - (level - 1) * 0.007)^(level - 1).
export const MIN_GRAVITY_MS: number = 1;

// Scoring (guideline values; line awards scale by level and difficulty).
export const LINE_CLEAR_BASE_SCORES: readonly number[] = [
  0, 100, 300, 500, 800,
];
export const SOFT_DROP_POINT: number = 1;
export const HARD_DROP_POINT: number = 2;
export const COMBO_BONUS: number = 50;
export const BACK_TO_BACK_MULTIPLIER: number = 1.5;
export const LINES_PER_LEVEL: number = 10;

export const NEXT_QUEUE_SIZE: number = 5;
export const MESSAGE_HOLD_MS: number = 2_400;
