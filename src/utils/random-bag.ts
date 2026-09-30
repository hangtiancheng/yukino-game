import { TETROMINO_TYPES } from "@/constants";
import type { TetrominoType } from "@/types";

export interface RandomDraw {
  seed: number;
  value: number;
}

// Mulberry32: deterministic 32-bit PRNG advanced one step at a time so the
// seed can travel inside the immutable game state.
export function nextRandom(seed: number): RandomDraw {
  const nextSeed = (seed + 0x6d2b79f5) >>> 0;
  let value = nextSeed;
  value = Math.imul(value ^ (value >>> 15), value | 1);
  value ^= value + Math.imul(value ^ (value >>> 7), value | 61);
  return {
    seed: nextSeed,
    value: ((value ^ (value >>> 14)) >>> 0) / 4_294_967_296,
  };
}

export interface ShuffledBag {
  pieces: TetrominoType[];
  rngSeed: number;
}

export function shuffleBag(rngSeed: number): ShuffledBag {
  const pieces: TetrominoType[] = [...TETROMINO_TYPES];
  let seed = rngSeed;
  for (let index = pieces.length - 1; index > 0; index -= 1) {
    const draw = nextRandom(seed);
    seed = draw.seed;
    const swapIndex = Math.floor(draw.value * (index + 1));
    const current = pieces[index];
    const swap = pieces[swapIndex];
    if (current === undefined || swap === undefined) {
      continue;
    }
    pieces[index] = swap;
    pieces[swapIndex] = current;
  }
  return { pieces, rngSeed: seed };
}

export interface BagDraw {
  pieces: TetrominoType[];
  bag: readonly TetrominoType[];
  rngSeed: number;
}

// Draws pieces from the 7-bag, refilling with a seeded Fisher-Yates shuffle
// whenever the bag runs dry.
export function drawBagPieces(
  bag: readonly TetrominoType[],
  rngSeed: number,
  count: number,
): BagDraw {
  const pieces: TetrominoType[] = [];
  let currentBag: TetrominoType[] = [...bag];
  let seed = rngSeed;

  while (pieces.length < count) {
    if (currentBag.length === 0) {
      const shuffled = shuffleBag(seed);
      currentBag = shuffled.pieces;
      seed = shuffled.rngSeed;
    }
    const nextPiece = currentBag.pop();
    if (nextPiece === undefined) {
      break;
    }
    pieces.push(nextPiece);
  }

  return { pieces, bag: currentBag, rngSeed: seed };
}
