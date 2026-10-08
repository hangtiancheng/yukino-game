import {
  BOARD_ORIGIN_X,
  BOARD_ORIGIN_Y,
  CELL_SIZE,
  HOLD_BOX,
  HOLD_CELL_SIZE,
  NEXT_BOX,
  NEXT_BOX_STEP,
  NEXT_CELL_SIZE,
  NEXT_QUEUE_SIZE,
  PREVIEW_BOX_COLUMNS,
  PREVIEW_BOX_ROWS,
  PREVIEW_PADDING,
  PREVIEW_SHAPES,
} from "@/constants";
import type { ActivePiece, GameState, TetrominoType } from "@/types";
import { getPieceCells } from "./tetromino";

export type RenderCellKind = "active" | "ghost" | "hold" | "locked" | "next";

// Shared scene description consumed by both the DOM and Pixi renderers so
// they stay pixel-consistent.
export interface RenderCell {
  key: string;
  kind: RenderCellKind;
  type: TetrominoType;
  x: number;
  y: number;
  size: number;
  dimmed: boolean;
}

export function getRenderCellKey(cell: RenderCell): string {
  return cell.key;
}

export function collectRenderCells(state: GameState): RenderCell[] {
  const cells: RenderCell[] = [];

  state.board.forEach((rowCells, row): void => {
    rowCells.forEach((cell, col): void => {
      if (cell === null) {
        return;
      }
      cells.push({
        key: `b-${row}-${col}`,
        kind: "locked",
        type: cell,
        x: BOARD_ORIGIN_X + col * CELL_SIZE,
        y: BOARD_ORIGIN_Y + row * CELL_SIZE,
        size: CELL_SIZE,
        dimmed: false,
      });
    });
  });

  const active = state.active;
  if (active !== null) {
    if (state.ghostY > active.y) {
      appendPieceCells(cells, { ...active, y: state.ghostY }, "g", "ghost");
    }
    appendPieceCells(cells, active, "a", "active");
  }

  if (state.hold !== null) {
    appendPreviewCells(
      cells,
      state.hold,
      HOLD_BOX.x,
      HOLD_BOX.y,
      HOLD_CELL_SIZE,
      "h",
      "hold",
      state.holdUsed,
    );
  }
  state.nextQueue.slice(0, NEXT_QUEUE_SIZE).forEach((type, index): void => {
    appendPreviewCells(
      cells,
      type,
      NEXT_BOX.x,
      NEXT_BOX.y + index * NEXT_BOX_STEP,
      NEXT_CELL_SIZE,
      `n-${index}`,
      "next",
      false,
    );
  });

  return cells;
}

function appendPieceCells(
  cells: RenderCell[],
  piece: ActivePiece,
  keyPrefix: string,
  kind: RenderCellKind,
): void {
  getPieceCells(piece).forEach(({ col, row }, index): void => {
    cells.push({
      key: `${keyPrefix}-${index}`,
      kind,
      type: piece.type,
      x: BOARD_ORIGIN_X + col * CELL_SIZE,
      y: BOARD_ORIGIN_Y + row * CELL_SIZE,
      size: CELL_SIZE,
      dimmed: false,
    });
  });
}

function appendPreviewCells(
  cells: RenderCell[],
  type: TetrominoType,
  boxX: number,
  boxY: number,
  cellSize: number,
  keyPrefix: string,
  kind: RenderCellKind,
  dimmed: boolean,
): void {
  const shape = PREVIEW_SHAPES[type];
  let width = 0;
  let height = 0;
  for (const [offsetX, offsetY] of shape) {
    width = Math.max(width, offsetX + 1);
    height = Math.max(height, offsetY + 1);
  }
  const marginX = Math.floor((PREVIEW_BOX_COLUMNS - width) / 2);
  const marginY = Math.floor((PREVIEW_BOX_ROWS - height) / 2);
  shape.forEach(([offsetX, offsetY], index): void => {
    cells.push({
      key: `${keyPrefix}-${index}`,
      kind,
      type,
      x: boxX + PREVIEW_PADDING + (marginX + offsetX) * cellSize,
      y: boxY + PREVIEW_PADDING + (marginY + offsetY) * cellSize,
      size: cellSize,
      dimmed,
    });
  });
}
