import { describe, expect, it } from "vitest";

import { TETROMINO_TYPES } from "@/constants";
import { drawBagPieces, nextRandom, shuffleBag } from "@/utils";

describe("nextRandom", (): void => {
  it("is deterministic and stays in [0, 1)", (): void => {
    expect(nextRandom(1_234)).toEqual(nextRandom(1_234));
    const draw = nextRandom(1_234);
    expect(draw.value).toBeGreaterThanOrEqual(0);
    expect(draw.value).toBeLessThan(1);
  });
});

describe("shuffleBag", (): void => {
  it("keeps all seven pieces", (): void => {
    const shuffled = shuffleBag(42);
    expect([...shuffled.pieces].sort()).toEqual([...TETROMINO_TYPES].sort());
  });
});

describe("drawBagPieces", (): void => {
  it("draws complete bags with a bounded remainder", (): void => {
    const draw = drawBagPieces([], 7, 9);
    expect(draw.pieces).toHaveLength(9);
    expect(new Set(draw.pieces.slice(0, 7))).toEqual(new Set(TETROMINO_TYPES));
    expect(draw.bag.length).toBeLessThanOrEqual(7);
  });

  it("is deterministic for identical seeds", (): void => {
    expect(drawBagPieces([], 99, 14).pieces).toEqual(
      drawBagPieces([], 99, 14).pieces,
    );
  });

  it("continues an existing bag before refilling", (): void => {
    const primed = drawBagPieces(["S", "Z"], 5, 1);
    expect(primed.pieces).toEqual(["Z"]);
    expect(primed.bag).toEqual(["S"]);
    expect(primed.rngSeed).toBe(5);
  });
});
