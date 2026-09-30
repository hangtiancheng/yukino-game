import {
  LINES_PER_LEVEL,
  MAX_LOCK_RESETS,
  MESSAGE_HOLD_MS,
  NEXT_QUEUE_SIZE,
  getDifficultyOption,
} from "@/constants";
import type {
  GameState,
  GameInput,
  HorizontalDirection,
  TetrominoType,
} from "@/types";
import { clearRows, findFullRows, lockCells } from "./board";
import { drawBagPieces } from "./random-bag";
import { getComboBonus, getDropScore, getLineClearAward } from "./scoring";
import {
  canPlacePiece,
  createSpawnPiece,
  getGhostY,
  getPieceCells,
  movePiece,
  tryRotate,
} from "./tetromino";

export const IDLE_MESSAGE = "Clear lines to score. Space hard drops.";

const LINE_CLEAR_LABELS: readonly string[] = [
  "",
  "Single.",
  "Double!",
  "Triple!",
  "TETRIS!",
];

// ---------------------------------------------------------------------------
// Phase transitions
// ---------------------------------------------------------------------------

export function startGame(state: GameState): GameState {
  return {
    ...state,
    phase: "running",
    message: "Stack the falling tetrominoes. Clear full rows to score.",
    messageTimerMs: MESSAGE_HOLD_MS,
  };
}

export function pauseGame(state: GameState): GameState {
  return {
    ...state,
    phase: "paused",
    message: "Paused. Press P to resume.",
    messageTimerMs: 0,
  };
}

export function resumeGame(state: GameState): GameState {
  return {
    ...state,
    phase: "running",
    message: "Back to the stack.",
    messageTimerMs: MESSAGE_HOLD_MS,
  };
}

export function topOut(state: GameState): GameState {
  return {
    ...state,
    phase: "lost",
    message: "Top out. Press R to restart.",
    messageTimerMs: 0,
  };
}

export function hasStartInput(input: GameInput): boolean {
  return (
    input.left ||
    input.right ||
    input.softDrop ||
    input.actions.some((action): boolean => action !== "pause")
  );
}

export function getLineClearMessage(
  clearedRows: number,
  backToBackApplied: boolean,
  combo: number,
): string {
  let message = LINE_CLEAR_LABELS[clearedRows] ?? "Lines cleared.";
  if (clearedRows === 4 && backToBackApplied) {
    message = "Back-to-back TETRIS!";
  }
  if (combo > 1) {
    message += ` Combo x${combo}.`;
  }
  return message;
}

// ---------------------------------------------------------------------------
// Piece movement. Every transition is a pure GameState -> GameState function
// guarded by phase, so callers never need to null-check the active piece.
// ---------------------------------------------------------------------------

export function tryShift(
  state: GameState,
  direction: HorizontalDirection,
): GameState {
  const active = state.active;
  if (state.phase !== "running" || active === null || direction === 0) {
    return state;
  }
  const shifted = movePiece(active, direction, 0);
  if (!canPlacePiece(state.board, shifted)) {
    return state;
  }
  return afterPieceMoved({
    ...state,
    active: shifted,
    stats: { ...state.stats, moves: state.stats.moves + 1 },
  });
}

export function rotateActive(state: GameState, direction: -1 | 1): GameState {
  const active = state.active;
  if (state.phase !== "running" || active === null) {
    return state;
  }
  const rotated = tryRotate(state.board, active, direction);
  if (rotated === null) {
    return state;
  }
  return afterPieceMoved({
    ...state,
    active: rotated,
    stats: { ...state.stats, rotates: state.stats.rotates + 1 },
  });
}

export function hardDrop(state: GameState): GameState {
  const active = state.active;
  if (state.phase !== "running" || active === null) {
    return state;
  }
  const ghostY = getGhostY(state.board, active);
  const distance = Math.max(ghostY - active.y, 0);
  return lockActivePiece({
    ...state,
    active: { ...active, y: ghostY },
    stats: {
      ...state.stats,
      hardDrops: state.stats.hardDrops + 1,
      score: state.stats.score + getDropScore(distance, "hard"),
    },
  });
}

export function holdPiece(state: GameState): GameState {
  const active = state.active;
  if (state.phase !== "running" || active === null || state.holdUsed) {
    return state;
  }
  let base = state;
  let incoming = state.hold;
  if (incoming === null) {
    const popped = popNextPiece(state);
    if (popped.type === null) {
      return state;
    }
    base = popped.state;
    incoming = popped.type;
  }
  return spawnPieceOfType(
    {
      ...base,
      hold: active.type,
      holdUsed: true,
      stats: { ...base.stats, holds: base.stats.holds + 1 },
    },
    incoming,
  );
}

// ---------------------------------------------------------------------------
// Locking, clearing and spawning
// ---------------------------------------------------------------------------

export function lockActivePiece(state: GameState): GameState {
  const active = state.active;
  if (state.phase !== "running" || active === null) {
    return state;
  }
  const option = getDifficultyOption(state.difficulty);
  const lockedBoard = lockCells(
    state.board,
    getPieceCells(active),
    active.type,
  );
  const fullRows = findFullRows(lockedBoard);
  const clearedRows = fullRows.length;
  const combo = clearedRows > 0 ? state.combo + 1 : 0;

  let board = lockedBoard;
  let award = 0;
  let backToBackApplied = false;
  if (clearedRows > 0) {
    backToBackApplied = state.backToBack && clearedRows === 4;
    // Awards scale with the level reached before this clear, matching the
    // guideline: the level-up from these lines applies to future clears.
    award += getLineClearAward(
      clearedRows,
      state.stats.level,
      backToBackApplied,
      option.multiplier,
    );
    award += getComboBonus(combo, state.stats.level, option.multiplier);
    board = clearRows(lockedBoard, fullRows);
  }

  const lines = state.stats.lines + clearedRows;
  const level = option.startLevel + Math.floor(lines / LINES_PER_LEVEL);
  let message = state.message;
  let messageTimerMs = state.messageTimerMs;
  if (clearedRows > 0) {
    message = getLineClearMessage(clearedRows, backToBackApplied, combo);
    if (level > state.stats.level) {
      message += ` Level ${level}.`;
    }
    messageTimerMs = MESSAGE_HOLD_MS;
  }

  return spawnNextPiece({
    ...state,
    backToBack: clearedRows > 0 ? clearedRows === 4 : state.backToBack,
    board,
    combo,
    holdUsed: false,
    message,
    messageTimerMs,
    stats: {
      ...state.stats,
      level,
      lines,
      piecesLocked: state.stats.piecesLocked + 1,
      score: state.stats.score + award,
      tetrises: state.stats.tetrises + (clearedRows === 4 ? 1 : 0),
    },
  });
}

export function spawnNextPiece(state: GameState): GameState {
  const popped = popNextPiece(state);
  if (popped.type === null) {
    return topOut({ ...state, active: null });
  }
  return spawnPieceOfType(popped.state, popped.type);
}

// ---------------------------------------------------------------------------
// Shared helpers
// ---------------------------------------------------------------------------

/**
 * Move/rotate resets the lock delay while the piece is grounded, capped at
 * MAX_LOCK_RESETS so a piece resting on the stack always locks eventually.
 */
function afterPieceMoved(state: GameState): GameState {
  const active = state.active;
  if (active === null) {
    return state;
  }
  const grounded = !canPlacePiece(state.board, movePiece(active, 0, 1));
  if (!grounded || state.lockResets >= MAX_LOCK_RESETS) {
    return state;
  }
  return { ...state, lockResets: state.lockResets + 1, lockTimerMs: 0 };
}

/** Takes the head of the preview queue and refills it from the 7-bag. */
function popNextPiece(state: GameState): {
  state: GameState;
  type: TetrominoType | null;
} {
  const [type, ...rest] = state.nextQueue;
  if (type === undefined) {
    return { state, type: null };
  }
  const draw = drawBagPieces(
    state.bag,
    state.rngSeed,
    NEXT_QUEUE_SIZE - rest.length,
  );
  return {
    state: {
      ...state,
      bag: draw.bag,
      nextQueue: [...rest, ...draw.pieces],
      rngSeed: draw.rngSeed,
    },
    type,
  };
}

function spawnPieceOfType(state: GameState, type: TetrominoType): GameState {
  const spawned = createSpawnPiece(type);
  if (!canPlacePiece(state.board, spawned)) {
    return topOut({ ...state, active: null });
  }
  return {
    ...state,
    active: spawned,
    arrTimerMs: 0,
    dasTimerMs: 0,
    fallAccumulatorMs: 0,
    lockResets: 0,
    lockTimerMs: 0,
  };
}
