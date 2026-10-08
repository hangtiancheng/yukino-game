import { describe, expect, it } from "vitest";

import { BOARD_COLUMNS, BOARD_ROWS } from "@/constants";
import type { GameAction, GameInput, GameState } from "@/types";
import {
  createEmptyBoard,
  createInitialGameState,
  findFullRows,
  lockCells,
  updateGameState,
} from "@/utils";

const STEP_MS = 1_000 / 60;

const idleInput: GameInput = {
  left: false,
  right: false,
  softDrop: false,
  restart: false,
  actions: [],
};

function makeState(): GameState {
  return { ...createInitialGameState("low", 1_234), phase: "running" };
}

function pressAction(state: GameState, action: GameAction): GameState {
  return updateGameState(state, { ...idleInput, actions: [action] }, STEP_MS);
}

describe("updateGameState basics", (): void => {
  it("restarts to a fresh ready state", (): void => {
    const next = updateGameState(
      makeState(),
      { ...idleInput, restart: true },
      STEP_MS,
    );
    expect(next.phase).toBe("ready");
    expect(next.stats.score).toBe(0);
    expect(next.board).toEqual(createEmptyBoard());
  });

  it("waits in ready until a control is used", (): void => {
    const ready = createInitialGameState("low", 1);
    expect(updateGameState(ready, idleInput, STEP_MS)).toBe(ready);
    const started = updateGameState(
      ready,
      { ...idleInput, left: true },
      STEP_MS,
    );
    expect(started.phase).toBe("running");
  });

  it("pauses and resumes through the pause action", (): void => {
    const paused = pressAction(makeState(), "pause");
    expect(paused.phase).toBe("paused");
    const stillPaused = updateGameState(
      paused,
      { ...idleInput, left: true },
      STEP_MS,
    );
    expect(stillPaused).toBe(paused);
    const resumed = pressAction(paused, "pause");
    expect(resumed.phase).toBe("running");
  });

  it("lets gravity drop the piece one row at level 1", (): void => {
    let state = makeState();
    const startY = state.active?.y ?? -1;
    for (let index = 0; index < 62; index += 1) {
      state = updateGameState(state, idleInput, STEP_MS);
    }
    expect(state.active?.y).toBe(startY + 1);
  });

  it("soft-drops faster than gravity", (): void => {
    let state = makeState();
    const startY = state.active?.y ?? -1;
    for (let index = 0; index < 10; index += 1) {
      state = updateGameState(state, { ...idleInput, softDrop: true }, STEP_MS);
    }
    expect((state.active?.y ?? -1) - startY).toBeGreaterThanOrEqual(2);
  });

  it("moves sideways on press and repeats after the DAS delay", (): void => {
    let state = makeState();
    const startX = state.active?.x ?? -1;
    state = updateGameState(state, { ...idleInput, right: true }, STEP_MS);
    expect(state.active?.x).toBe(startX + 1);
    for (let index = 0; index < 5; index += 1) {
      state = updateGameState(state, { ...idleInput, right: true }, STEP_MS);
    }
    expect(state.active?.x).toBe(startX + 1);
    for (let index = 0; index < 10; index += 1) {
      state = updateGameState(state, { ...idleInput, right: true }, STEP_MS);
    }
    expect(state.active?.x ?? -1).toBeGreaterThan(startX + 1);
  });
});

describe("locking and clearing", (): void => {
  it("locks the piece on hard drop and spawns the next one", (): void => {
    const state = makeState();
    const next = pressAction(state, "hard-drop");
    expect(next.stats.piecesLocked).toBe(1);
    expect(next.stats.hardDrops).toBe(1);
    expect(next.stats.score).toBeGreaterThan(0);
    expect(next.active?.type).toBe(state.nextQueue[0]);
    expect(next.nextQueue).toHaveLength(5);
  });

  it("rotates the active piece and counts the rotation", (): void => {
    const state: GameState = {
      ...makeState(),
      active: { type: "T", rotation: 0, x: 3, y: 0 },
    };
    const next = pressAction(state, "rotate-cw");
    expect(next.active?.rotation).toBe(1);
    expect(next.stats.rotates).toBe(1);
  });

  it("holds the active piece once per lock", (): void => {
    const state = makeState();
    const activeType = state.active?.type;
    expect(activeType).toBeDefined();
    const next = pressAction(state, "hold");
    expect(next.hold).toBe(activeType);
    expect(next.holdUsed).toBe(true);
    expect(next.stats.holds).toBe(1);
    expect(next.active?.type).toBe(state.nextQueue[0]);
    const denied = pressAction(next, "hold");
    expect(denied.hold).toBe(activeType);
    expect(denied.stats.holds).toBe(1);
  });

  it("clears full rows and scores the double", (): void => {
    let board = createEmptyBoard();
    for (let row = BOARD_ROWS - 2; row < BOARD_ROWS; row += 1) {
      for (let col = 0; col < BOARD_COLUMNS; col += 1) {
        if (col === 4 || col === 5) {
          continue;
        }
        board = lockCells(board, [{ col, row }], "I");
      }
    }
    const state: GameState = {
      ...makeState(),
      board,
      active: { type: "O", rotation: 0, x: 4, y: 0 },
      ghostY: BOARD_ROWS - 2,
    };
    const next = pressAction(state, "hard-drop");
    expect(next.stats.lines).toBe(2);
    expect(next.stats.piecesLocked).toBe(1);
    expect(next.stats.score).toBe(300 + (BOARD_ROWS - 2) * 2);
    expect(findFullRows(next.board)).toEqual([]);
    expect(next.message).toMatch(/double/i);
  });

  it("locks a grounded piece after the lock delay", (): void => {
    let board = createEmptyBoard();
    for (let col = 0; col < BOARD_COLUMNS; col += 1) {
      if (col === 4 || col === 5) {
        continue;
      }
      board = lockCells(board, [{ col, row: BOARD_ROWS - 1 }], "I");
    }
    let state: GameState = {
      ...makeState(),
      board,
      active: { type: "O", rotation: 0, x: 4, y: BOARD_ROWS - 2 },
    };
    for (let index = 0; index < 31; index += 1) {
      state = updateGameState(state, idleInput, STEP_MS);
    }
    expect(state.stats.piecesLocked).toBe(1);
    expect(state.stats.lines).toBe(1);
    expect(state.message).toMatch(/single/i);
  });

  it("tops out when the next piece cannot spawn", (): void => {
    let board = createEmptyBoard();
    for (let row = 0; row < 4; row += 1) {
      for (let col = 0; col < BOARD_COLUMNS; col += 1) {
        if (col === 9) {
          // Leave one gap so the rows are not full and never clear.
          continue;
        }
        board = lockCells(board, [{ col, row }], "Z");
      }
    }
    const state: GameState = {
      ...makeState(),
      board,
      active: { type: "O", rotation: 0, x: 4, y: 5 },
      ghostY: BOARD_ROWS - 2,
    };
    const next = pressAction(state, "hard-drop");
    expect(next.phase).toBe("lost");
    expect(next.message).toMatch(/top out/i);
    expect(next.active).toBeNull();
  });
});
