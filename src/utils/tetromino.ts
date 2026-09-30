import { TETROMINO_ROTATIONS, getKickOffsets } from "@/constants";
import type {
  ActivePiece,
  BoardGrid,
  CellPosition,
  RotationState,
  TetrominoType,
} from "@/types";
import { canPlaceCells } from "./board";

export function getPieceCells(piece: ActivePiece): CellPosition[] {
  const rotations = TETROMINO_ROTATIONS[piece.type];
  const offsets = rotations[piece.rotation] ?? [];
  return offsets.map(([offsetX, offsetY]): CellPosition => ({
    col: piece.x + offsetX,
    row: piece.y + offsetY,
  }));
}

// SRS spawn: 3-wide boxes enter at column 3 (cols 3-5), the I piece at
// column 3 (cols 3-6), and the O piece at column 4 (cols 4-5).
export function createSpawnPiece(type: TetrominoType): ActivePiece {
  return { type, rotation: 0, x: type === "O" ? 4 : 3, y: 0 };
}

export function canPlacePiece(board: BoardGrid, piece: ActivePiece): boolean {
  return canPlaceCells(board, getPieceCells(piece));
}

export function movePiece(
  piece: ActivePiece,
  deltaX: number,
  deltaY: number,
): ActivePiece {
  return { ...piece, x: piece.x + deltaX, y: piece.y + deltaY };
}

export function tryRotate(
  board: BoardGrid,
  piece: ActivePiece,
  direction: -1 | 1,
): ActivePiece | null {
  if (piece.type === "O") {
    return null;
  }
  const from = piece.rotation;
  const to = ((((from + direction) % 4) + 4) % 4) as RotationState;
  const kicks = getKickOffsets(piece.type, from, to);
  for (const [kickX, kickY] of kicks) {
    const candidate = movePiece({ ...piece, rotation: to }, kickX, kickY);
    if (canPlacePiece(board, candidate)) {
      return candidate;
    }
  }
  return null;
}

export function getGhostY(board: BoardGrid, piece: ActivePiece): number {
  let ghostY = piece.y;
  while (canPlacePiece(board, { ...piece, y: ghostY + 1 })) {
    ghostY += 1;
  }
  return ghostY;
}
