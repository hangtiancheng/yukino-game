import { describe, expect, it } from "vitest";

import { BOARD_COLUMNS, BOARD_ROWS } from "@/constants";
import {
  canPlaceCells,
  canPlacePiece,
  clearRows,
  createEmptyBoard,
  createSpawnPiece,
  findFullRows,
  lockCells,
} from "@/utils";

describe("createEmptyBoard", (): void => {
  it("creates a fully empty grid of the right size", (): void => {
    const board = createEmptyBoard();
    expect(board).toHaveLength(BOARD_ROWS);
    for (const row of board) {
      expect(row).toHaveLength(BOARD_COLUMNS);
      expect(row.every((cell): boolean => cell === null)).toBe(true);
    }
  });
});

describe("canPlacePiece", (): void => {
  it("accepts a piece inside the well and rejects overlaps", (): void => {
    const board = createEmptyBoard();
    const piece = createSpawnPiece("T");
    expect(canPlacePiece(board, piece)).toBe(true);
    const locked = lockCells(board, [{ col: 4, row: 1 }], "T");
    expect(canPlacePiece(locked, piece)).toBe(false);
  });

  it("rejects cells outside the well", (): void => {
    const board = createEmptyBoard();
    expect(canPlaceCells(board, [{ col: -1, row: 5 }])).toBe(false);
    expect(canPlaceCells(board, [{ col: BOARD_COLUMNS, row: 5 }])).toBe(false);
    expect(canPlaceCells(board, [{ col: 5, row: BOARD_ROWS }])).toBe(false);
    expect(canPlaceCells(board, [{ col: 5, row: -1 }])).toBe(false);
  });
});

describe("findFullRows and clearRows", (): void => {
  it("detects and removes full rows, adding empty rows on top", (): void => {
    let board = createEmptyBoard();
    for (let col = 0; col < BOARD_COLUMNS; col += 1) {
      board = lockCells(board, [{ col, row: BOARD_ROWS - 1 }], "I");
    }
    expect(findFullRows(board)).toEqual([BOARD_ROWS - 1]);
    const cleared = clearRows(board, [BOARD_ROWS - 1]);
    expect(findFullRows(cleared)).toEqual([]);
    expect(cleared).toHaveLength(BOARD_ROWS);
    expect(cleared[0]?.every((cell): boolean => cell === null)).toBe(true);
  });

  it("drops partial rows down when rows below are cleared", (): void => {
    let board = createEmptyBoard();
    board = lockCells(board, [{ col: 0, row: BOARD_ROWS - 2 }], "J");
    for (let col = 0; col < BOARD_COLUMNS; col += 1) {
      board = lockCells(board, [{ col, row: BOARD_ROWS - 1 }], "I");
    }
    const cleared = clearRows(board, [BOARD_ROWS - 1]);
    expect(cleared[BOARD_ROWS - 1]?.[0]).toBe("J");
  });
});
