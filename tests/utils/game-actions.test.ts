import { describe, expect, it } from "vitest";

import { BOARD_COLUMNS, BOARD_ROWS, MAX_LOCK_RESETS } from "@/constants";
import type { GameState, TetrominoType } from "@/types";
import {
  createEmptyBoard,
  createInitialGameState,
  hardDrop,
  holdPiece,
  lockActivePiece,
  lockCells,
  rotateActive,
  spawnNextPiece,
  startGame,
  tryShift,
} from "@/utils";

function running(seed = 7): GameState {
  return startGame(createInitialGameState("low", seed));
}

function fillRowExcept(board: GameState["board"], row: number, gap: number[]) {
  let next = board;
  for (let col = 0; col < BOARD_COLUMNS; col += 1) {
    if (gap.includes(col)) {
      continue;
    }
    next = lockCells(next, [{ col, row }], "I");
  }
  return next;
}

describe("tryShift", (): void => {
  it("moves the piece and counts the move", (): void => {
    const state = running();
    const moved = tryShift(state, -1);
    expect(moved.active?.x).toBe((state.active?.x ?? 0) - 1);
    expect(moved.stats.moves).toBe(1);
  });

  it("refuses to move through the wall", (): void => {
    const state: GameState = {
      ...running(),
      active: { type: "O", rotation: 0, x: 0, y: 10 },
    };
    expect(tryShift(state, -1)).toBe(state);
  });

  it("is a no-op while paused", (): void => {
    const state: GameState = { ...running(), phase: "paused" };
    expect(tryShift(state, 1)).toBe(state);
  });
});

describe("rotateActive", (): void => {
  it("rotates with the SRS kick and counts the rotation", (): void => {
    const state: GameState = {
      ...running(),
      active: { type: "T", rotation: 0, x: 3, y: 5 },
    };
    const rotated = rotateActive(state, 1);
    expect(rotated.active?.rotation).toBe(1);
    expect(rotated.stats.rotates).toBe(1);
  });

  it("keeps the state when nothing can rotate", (): void => {
    const state: GameState = {
      ...running(),
      active: { type: "O", rotation: 0, x: 4, y: 5 },
    };
    expect(rotateActive(state, 1)).toBe(state);
  });
});

describe("hardDrop", (): void => {
  it("locks instantly, scores two per cell and spawns the successor", (): void => {
    const state = running();
    const expectedType = state.nextQueue[0];
    const dropped = hardDrop(state);
    expect(dropped.stats.piecesLocked).toBe(1);
    expect(dropped.stats.hardDrops).toBe(1);
    expect(dropped.stats.score).toBeGreaterThan(0);
    expect(dropped.stats.score % 2).toBe(0);
    expect(dropped.active?.type).toBe(expectedType);
    expect(dropped.active?.y).toBe(0);
  });

  it("is a no-op while paused", (): void => {
    const state: GameState = { ...running(), phase: "paused" };
    expect(hardDrop(state)).toBe(state);
  });
});

describe("holdPiece", (): void => {
  it("banks the active piece and spawns from the queue", (): void => {
    const state = running();
    const held = holdPiece(state);
    expect(held.hold).toBe(state.active?.type);
    expect(held.holdUsed).toBe(true);
    expect(held.stats.holds).toBe(1);
    expect(held.active?.type).toBe(state.nextQueue[0]);
  });

  it("denies a second hold before the piece locks", (): void => {
    const held = holdPiece(running());
    expect(holdPiece(held)).toBe(held);
  });

  it("swaps the held piece back once holdUsed resets on lock", (): void => {
    const first = holdPiece(running());
    const locked = hardDrop(first);
    expect(locked.holdUsed).toBe(false);
    const successorKind = locked.active?.type;
    const swapped = holdPiece(locked);
    expect(swapped.hold).toBe(successorKind);
    expect(swapped.active?.type).toBe(first.hold);
    expect(swapped.stats.holds).toBe(2);
  });
});

describe("lockActivePiece", (): void => {
  it("clears a full row, scores the single and raises the combo", (): void => {
    const board = fillRowExcept(createEmptyBoard(), BOARD_ROWS - 1, [4, 5]);
    const state: GameState = {
      ...running(),
      active: { type: "O", rotation: 0, x: 4, y: BOARD_ROWS - 2 },
      board,
    };
    const locked = lockActivePiece(state);
    expect(locked.stats.lines).toBe(1);
    expect(locked.stats.score).toBe(100);
    expect(locked.combo).toBe(1);
    expect(locked.message).toMatch(/single/i);
    expect(locked.active).not.toBeNull();
  });

  it("scores a tetris, sets back-to-back and counts it", (): void => {
    let board = createEmptyBoard();
    for (let row = BOARD_ROWS - 4; row < BOARD_ROWS; row += 1) {
      board = fillRowExcept(board, row, [0]);
    }
    const state: GameState = {
      ...running(),
      active: { type: "I", rotation: 1, x: -2, y: BOARD_ROWS - 4 },
      board,
    };
    const locked = lockActivePiece(state);
    expect(locked.stats.lines).toBe(4);
    expect(locked.stats.score).toBe(800);
    expect(locked.stats.tetrises).toBe(1);
    expect(locked.backToBack).toBe(true);
    expect(locked.message).toMatch(/tetris/i);
  });

  it("resets back-to-back when a non-tetris clears", (): void => {
    const board = fillRowExcept(createEmptyBoard(), BOARD_ROWS - 1, [4, 5]);
    const state: GameState = {
      ...running(),
      active: { type: "O", rotation: 0, x: 4, y: BOARD_ROWS - 2 },
      backToBack: true,
      board,
    };
    expect(lockActivePiece(state).backToBack).toBe(false);
  });

  it("keeps the stack when nothing clears", (): void => {
    const state = running();
    const locked = lockActivePiece(state);
    expect(locked.stats.lines).toBe(0);
    expect(locked.stats.piecesLocked).toBe(1);
    expect(locked.combo).toBe(0);
    const occupied = locked.board.flat().filter(Boolean);
    expect(occupied).toHaveLength(4);
  });
});

describe("spawnNextPiece", (): void => {
  it("tops out when the spawn cells are blocked", (): void => {
    let board = createEmptyBoard();
    for (let row = 0; row < 4; row += 1) {
      board = fillRowExcept(board, row, [9]);
    }
    const spawned = spawnNextPiece({ ...running(), board });
    expect(spawned.phase).toBe("lost");
    expect(spawned.active).toBeNull();
    expect(spawned.message).toMatch(/top out/i);
  });

  it("keeps the queue stocked at five previews", (): void => {
    const spawned = spawnNextPiece(running());
    expect(spawned.nextQueue).toHaveLength(5);
    expect(spawned.active).not.toBeNull();
  });
});

describe("lock-delay move resets", (): void => {
  function groundedO(): GameState {
    const board = fillRowExcept(
      createEmptyBoard(),
      BOARD_ROWS - 1,
      [2, 3, 4, 5, 6, 7],
    );
    return {
      ...running(),
      active: { type: "O", rotation: 0, x: 4, y: BOARD_ROWS - 2 },
      board,
      lockTimerMs: 300,
    };
  }

  it("resets the lock timer when a grounded piece moves", (): void => {
    const moved = tryShift(groundedO(), -1);
    expect(moved.stats.moves).toBe(1);
    expect(moved.lockTimerMs).toBe(0);
    expect(moved.lockResets).toBe(1);
  });

  it("stops granting resets once the cap is reached", (): void => {
    const exhausted: GameState = {
      ...groundedO(),
      lockResets: MAX_LOCK_RESETS,
    };
    const moved = tryShift(exhausted, -1);
    expect(moved.stats.moves).toBe(1);
    expect(moved.lockTimerMs).toBe(300);
    expect(moved.lockResets).toBe(MAX_LOCK_RESETS);
  });

  it("does not consume resets while the piece is airborne", (): void => {
    const airborne: GameState = {
      ...running(),
      active: { type: "O", rotation: 0, x: 4, y: 2 },
      lockTimerMs: 120,
    };
    const moved = tryShift(airborne, -1);
    expect(moved.lockTimerMs).toBe(120);
    expect(moved.lockResets).toBe(0);
  });
});

describe("piece queue determinism", (): void => {
  it("draws the same sequence for the same seed", (): void => {
    const seen: TetrominoType[][] = [0, 0].map((): TetrominoType[] => {
      let state = running(99);
      const types: TetrominoType[] = [];
      for (let index = 0; index < 5; index += 1) {
        types.push(state.active?.type ?? "O");
        state = hardDrop(state);
      }
      return types;
    });
    expect(seen[0]).toEqual(seen[1]);
  });
});
