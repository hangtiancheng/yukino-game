import { BOARD_COLUMNS, BOARD_ROWS } from "@/constants";
import type { BoardGrid, Cell, CellPosition, TetrominoType } from "@/types";

export function createEmptyRow(): Cell[] {
  return new Array<Cell>(BOARD_COLUMNS).fill(null);
}

export function createEmptyBoard(): BoardGrid {
  const rows: Cell[][] = [];
  for (let row = 0; row < BOARD_ROWS; row += 1) {
    rows.push(createEmptyRow());
  }
  return rows;
}

export function canPlaceCells(
  board: BoardGrid,
  cells: readonly CellPosition[],
): boolean {
  for (const { col, row } of cells) {
    if (col < 0 || col >= BOARD_COLUMNS || row < 0 || row >= BOARD_ROWS) {
      return false;
    }
    const boardRow = board[row];
    if (boardRow === undefined || boardRow[col] !== null) {
      return false;
    }
  }
  return true;
}

export function lockCells(
  board: BoardGrid,
  cells: readonly CellPosition[],
  type: TetrominoType,
): BoardGrid {
  const nextBoard: Cell[][] = board.map((row): Cell[] => [...row]);
  for (const { col, row } of cells) {
    const boardRow = nextBoard[row];
    if (boardRow === undefined) {
      continue;
    }
    boardRow[col] = type;
  }
  return nextBoard;
}

export function findFullRows(board: BoardGrid): number[] {
  const fullRows: number[] = [];
  board.forEach((row, index): void => {
    if (row.every((cell): boolean => cell !== null)) {
      fullRows.push(index);
    }
  });
  return fullRows;
}

export function clearRows(
  board: BoardGrid,
  rows: readonly number[],
): BoardGrid {
  if (rows.length === 0) {
    return board;
  }
  const clearedRows = new Set(rows);
  const remainingRows: Cell[][] = board
    .filter((_row, index): boolean => !clearedRows.has(index))
    .map((row): Cell[] => [...row]);
  while (remainingRows.length < BOARD_ROWS) {
    remainingRows.unshift(createEmptyRow());
  }
  return remainingRows;
}
