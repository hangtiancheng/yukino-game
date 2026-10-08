import { NEXT_QUEUE_SIZE, getDifficultyOption } from "@/constants";
import type { Difficulty } from "@/schema";
import type { GameState } from "@/types";
import { createEmptyBoard } from "./board";
import { drawBagPieces } from "./random-bag";
import { createSpawnPiece, getGhostY } from "./tetromino";

export function createInitialGameState(
  difficulty: Difficulty = "medium",
  rngSeed: number = Date.now() >>> 0,
): GameState {
  const option = getDifficultyOption(difficulty);
  const board = createEmptyBoard();
  const draw = drawBagPieces([], rngSeed, NEXT_QUEUE_SIZE + 1);
  const [activeType, ...nextQueue] = draw.pieces;
  if (activeType === undefined) {
    throw new Error("initial piece draw failed.");
  }
  const active = createSpawnPiece(activeType);
  return {
    difficulty,
    phase: "ready",
    board,
    active,
    ghostY: getGhostY(board, active),
    hold: null,
    holdUsed: false,
    nextQueue,
    bag: draw.bag,
    rngSeed: draw.rngSeed,
    fallAccumulatorMs: 0,
    lockTimerMs: 0,
    lockResets: 0,
    dasDirection: 0,
    dasTimerMs: 0,
    arrTimerMs: 0,
    combo: 0,
    backToBack: false,
    stats: {
      score: 0,
      lines: 0,
      level: option.startLevel,
      piecesLocked: 0,
      tetrises: 0,
      hardDrops: 0,
      holds: 0,
      rotates: 0,
      moves: 0,
      elapsedMs: 0,
    },
    message: "Press any control to start stacking.",
    messageTimerMs: 0,
  };
}
