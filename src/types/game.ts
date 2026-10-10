import type { Difficulty } from "@/schema";
import type { GameStats } from "./stats";

export type GamePhase = "lost" | "paused" | "ready" | "running";

export type TetrominoType = "I" | "J" | "L" | "O" | "S" | "T" | "Z";

export type RotationState = 0 | 1 | 2 | 3;

export type HorizontalDirection = -1 | 0 | 1;

export type Cell = TetrominoType | null;

export type BoardGrid = readonly (readonly Cell[])[];

export interface ActivePiece {
  type: TetrominoType;
  rotation: RotationState;
  x: number;
  y: number;
}

export interface CellPosition {
  col: number;
  row: number;
}

export type GameAction =
  "hard-drop" | "hold" | "pause" | "rotate-ccw" | "rotate-cw";

export interface GameInput {
  left: boolean;
  right: boolean;
  softDrop: boolean;
  restart: boolean;
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
