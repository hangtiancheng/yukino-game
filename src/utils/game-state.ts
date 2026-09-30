import {
  ARR_REPEAT_MS,
  DAS_DELAY_MS,
  LOCK_DELAY_MS,
  MAX_FRAME_MS,
  SOFT_DROP_FACTOR,
} from "@/constants";
import type {
  GameAction,
  GameInput,
  GameState,
  HorizontalDirection,
} from "@/types";
import {
  IDLE_MESSAGE,
  hardDrop,
  hasStartInput,
  holdPiece,
  lockActivePiece,
  pauseGame,
  resumeGame,
  rotateActive,
  startGame,
  tryShift,
} from "./game-flow";
import { getGravityDelayMs } from "./gravity";
import { createInitialGameState } from "./initial-game-state";
import { getDropScore } from "./scoring";
import { canPlacePiece, getGhostY, movePiece } from "./tetromino";

/**
 * Advances the simulation by one frame. The update is a pipeline of pure
 * GameState -> GameState steps: buffered actions first, then DAS/ARR
 * auto-shift, gravity, and lock delay. Each step guards on phase and the
 * active piece, so no step needs to know how the previous one mutated.
 */
export function updateGameState(
  previous: GameState,
  input: GameInput,
  deltaMs: number,
): GameState {
  if (input.restart) {
    return createInitialGameState(previous.difficulty);
  }

  if (previous.phase === "lost") {
    return previous;
  }

  if (previous.phase === "paused") {
    return input.actions.includes("pause") ? resumeGame(previous) : previous;
  }

  if (previous.phase === "ready" && !hasStartInput(input)) {
    return previous;
  }

  const frameMs = Math.min(deltaMs, MAX_FRAME_MS);
  const startedFromReady = previous.phase === "ready";
  let state = startedFromReady ? startGame(previous) : previous;
  state = tickTimers(state, frameMs);

  const actions: readonly GameAction[] = startedFromReady
    ? input.actions.filter((action): boolean => action !== "pause")
    : input.actions;
  const lockedBefore = state.stats.piecesLocked;
  for (const action of actions) {
    if (action === "pause") {
      return finalizeFrame(pauseGame(state));
    }
    state = applyAction(state, action);
    if (state.phase !== "running") {
      return finalizeFrame(state);
    }
    if (state.stats.piecesLocked !== lockedBefore) {
      // A hard drop locked the piece; the spawned successor waits for the
      // next frame, and any remaining buffered actions go with it.
      break;
    }
  }

  if (state.stats.piecesLocked === lockedBefore) {
    state = updateDas(state, input, frameMs);
    state = updateGravity(state, input, frameMs);
    state = updateLockDelay(state, frameMs);
  }
  return finalizeFrame(applyIdleMessage(state));
}

function applyAction(state: GameState, action: GameAction): GameState {
  switch (action) {
    case "hard-drop":
      return hardDrop(state);
    case "hold":
      return holdPiece(state);
    case "pause":
      // Drained by updateGameState before reaching this point.
      return state;
    case "rotate-ccw":
      return rotateActive(state, -1);
    case "rotate-cw":
      return rotateActive(state, 1);
  }
}

function tickTimers(state: GameState, frameMs: number): GameState {
  return {
    ...state,
    messageTimerMs: Math.max(state.messageTimerMs - frameMs, 0),
    stats: { ...state.stats, elapsedMs: state.stats.elapsedMs + frameMs },
  };
}

/**
 * DAS/ARR horizontal auto-shift: an initial move on press, then repeats once
 * the delayed auto-shift delay has charged, at the auto-repeat rate.
 */
function updateDas(
  state: GameState,
  input: GameInput,
  frameMs: number,
): GameState {
  if (state.active === null) {
    return state;
  }
  const direction: HorizontalDirection =
    input.left === input.right ? 0 : input.right ? 1 : -1;

  if (direction === 0) {
    if (
      state.dasDirection === 0 &&
      state.dasTimerMs === 0 &&
      state.arrTimerMs === 0
    ) {
      return state;
    }
    return { ...state, arrTimerMs: 0, dasDirection: 0, dasTimerMs: 0 };
  }

  if (direction !== state.dasDirection) {
    return tryShift(
      { ...state, arrTimerMs: 0, dasDirection: direction, dasTimerMs: 0 },
      direction,
    );
  }

  const dasTimerMs = state.dasTimerMs + frameMs;
  if (dasTimerMs < DAS_DELAY_MS) {
    return { ...state, dasTimerMs };
  }

  let arrTimerMs = state.arrTimerMs + frameMs;
  let shifted = state;
  while (arrTimerMs >= ARR_REPEAT_MS) {
    arrTimerMs -= ARR_REPEAT_MS;
    const next = tryShift(shifted, direction);
    if (next === shifted) {
      // Blocked by wall or stack; stop consuming repeat time.
      arrTimerMs = 0;
      break;
    }
    shifted = next;
  }
  return { ...shifted, arrTimerMs, dasTimerMs };
}

/**
 * Gravity, accumulated against the level's delay. Soft drop divides the
 * delay and scores one point per dropped cell as the cells are earned.
 */
function updateGravity(
  state: GameState,
  input: GameInput,
  frameMs: number,
): GameState {
  if (state.active === null) {
    return state;
  }
  const delayMs =
    getGravityDelayMs(state.stats.level) /
    (input.softDrop ? SOFT_DROP_FACTOR : 1);

  let fallAccumulatorMs = state.fallAccumulatorMs + frameMs;
  let current = state;
  while (fallAccumulatorMs >= delayMs) {
    const piece = current.active;
    if (piece === null) {
      break;
    }
    const dropped = movePiece(piece, 0, 1);
    if (!canPlacePiece(current.board, dropped)) {
      break;
    }
    current = {
      ...current,
      active: dropped,
      stats: input.softDrop
        ? {
            ...current.stats,
            score: current.stats.score + getDropScore(1, "soft"),
          }
        : current.stats,
    };
    fallAccumulatorMs -= delayMs;
  }

  if (
    current.active !== null &&
    !canPlacePiece(current.board, movePiece(current.active, 0, 1))
  ) {
    // Grounded: leftover credit must not carry into the next fall.
    fallAccumulatorMs = 0;
  }
  return { ...current, fallAccumulatorMs };
}

/**
 * Lock delay: a grounded piece locks after LOCK_DELAY_MS. Successful moves
 * and rotations reset the timer (capped by MAX_LOCK_RESETS upstream in
 * afterPieceMoved), so sliding along the stack buys time but never forever.
 */
function updateLockDelay(state: GameState, frameMs: number): GameState {
  const active = state.active;
  if (active === null) {
    return state;
  }
  const grounded = !canPlacePiece(state.board, movePiece(active, 0, 1));
  if (!grounded) {
    return state.lockTimerMs === 0 ? state : { ...state, lockTimerMs: 0 };
  }
  const lockTimerMs = state.lockTimerMs + frameMs;
  if (lockTimerMs >= LOCK_DELAY_MS) {
    return lockActivePiece(state);
  }
  return { ...state, lockTimerMs };
}

function applyIdleMessage(state: GameState): GameState {
  if (state.phase !== "running" || state.messageTimerMs > 0) {
    return state;
  }
  if (state.message === IDLE_MESSAGE) {
    return state;
  }
  return { ...state, message: IDLE_MESSAGE };
}

/** Keeps the cached ghost projection in sync with board and piece. */
function finalizeFrame(state: GameState): GameState {
  const ghostY =
    state.active === null ? 0 : getGhostY(state.board, state.active);
  return state.ghostY === ghostY ? state : { ...state, ghostY };
}
