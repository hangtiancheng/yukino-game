import type { Difficulty } from "@/schema";
import type { GameStats } from "./stats";

export type GamePhase = "lost" | "paused" | "ready" | "running";

export type TetrominoType = "I" | "J" | "L" | "O" | "S" | "T" | "Z";

export type RotationState = 0 | 1 | 2 | 3;

export type HorizontalDirection = -1 | 0 | 1;

// A board cell holds the tetromino type that locked into it, or null.
export type Cell = TetrominoType | null;

// Rows are stored top to bottom; row 0 is the visible top of the well.
export type BoardGrid = readonly (readonly Cell[])[];

export interface ActivePiece {
  type: TetrominoType;
  rotation: RotationState;
  // Column/row of the piece bounding-box origin (SRS boxes: I is 4x4,
  // O is 2x2, the rest are 3x3).
  x: number;
  y: number;
}

export interface CellPosition {
  col: number;
  row: number;
}

// One-shot commands queued by input devices between simulation steps.
export type GameAction =
  "hard-drop" | "hold" | "pause" | "rotate-ccw" | "rotate-cw";

export interface GameInput {
  left: boolean;
  right: boolean;
  softDrop: boolean;
  restart: boolean;
  // Mutated only by replacing the whole GameInput object; the simulation
  // reads it without mutating and the caller drains it after each step.
  actions: readonly GameAction[];
}

export interface GameState {
  difficulty: Difficulty;
  phase: GamePhase;
  board: BoardGrid;
  active: ActivePiece | null;
  ghostY: number;
  hold: TetrominoType | null;
  holdUsed: boolean;
  nextQueue: readonly TetrominoType[];
  bag: readonly TetrominoType[];
  rngSeed: number;
  fallAccumulatorMs: number;
  lockTimerMs: number;
  lockResets: number;
  dasDirection: HorizontalDirection;
  dasTimerMs: number;
  arrTimerMs: number;
  combo: number;
  backToBack: boolean;
  stats: GameStats;
  message: string;
  messageTimerMs: number;
}
