import { describe, expect, it } from "vitest";

import { BOARD_ROWS, TETROMINO_TYPES } from "@/constants";
import type { ActivePiece, RotationState } from "@/types";
import {
  createEmptyBoard,
  createSpawnPiece,
  getGhostY,
  getPieceCells,
  tryRotate,
} from "@/utils";

describe("getPieceCells", (): void => {
  it("returns four cells per rotation for every piece", (): void => {
    for (const type of TETROMINO_TYPES) {
      for (let rotation = 0; rotation < 4; rotation += 1) {
        const cells = getPieceCells({
          type,
          rotation: rotation as RotationState,
          x: 3,
          y: 0,
        });
        expect(cells).toHaveLength(4);
      }
    }
  });
});

describe("createSpawnPiece", (): void => {
  it("spawns the I piece across columns 3-6", (): void => {
    const cells = getPieceCells(createSpawnPiece("I"));
    expect(cells.map((cell): number => cell.col).sort()).toEqual([3, 4, 5, 6]);
  });

  it("spawns the O piece across columns 4-5", (): void => {
    const cells = getPieceCells(createSpawnPiece("O"));
    expect(cells.map((cell): number => cell.col).sort()).toEqual([4, 4, 5, 5]);
  });
});

describe("tryRotate", (): void => {
  it("does not rotate the O piece", (): void => {
    const board = createEmptyBoard();
    expect(tryRotate(board, createSpawnPiece("O"), 1)).toBeNull();
  });

  it("cycles the T piece clockwise and back", (): void => {
    const board = createEmptyBoard();
    const clockwise = tryRotate(board, createSpawnPiece("T"), 1);
    expect(clockwise?.rotation).toBe(1);
    if (clockwise === null) {
      throw new Error("expected a clockwise rotation.");
    }
    const back = tryRotate(board, clockwise, -1);
    expect(back).toEqual(createSpawnPiece("T"));
  });

  it("kicks the vertical I piece away from the left wall", (): void => {
    const board = createEmptyBoard();
    const piece: ActivePiece = { type: "I", rotation: 1, x: -2, y: 4 };
    const rotated = tryRotate(board, piece, 1);
    expect(rotated).toEqual({ type: "I", rotation: 2, x: 0, y: 4 });
  });

  it("uses SRS floor kicks when rotating the I piece on the ground", (): void => {
    const board = createEmptyBoard();
    const piece: ActivePiece = {
      type: "I",
      rotation: 0,
      x: 0,
      y: BOARD_ROWS - 2,
    };
    const rotated = tryRotate(board, piece, 1);
    expect(rotated?.rotation).toBe(1);
    expect(rotated?.x).toBe(1);
    expect(rotated?.y).toBe(BOARD_ROWS - 4);
  });
});

describe("getGhostY", (): void => {
  it("drops the ghost to the lowest valid row", (): void => {
    const board = createEmptyBoard();
    expect(getGhostY(board, createSpawnPiece("O"))).toBe(BOARD_ROWS - 2);
  });
});
