import { describe, expect, it } from "vitest";

import {
  getComboBonus,
  getDropScore,
  getLineClearAward,
  getLineClearBaseScore,
} from "@/utils";

describe("getLineClearBaseScore", (): void => {
  it("maps clear counts to guideline base scores", (): void => {
    expect(getLineClearBaseScore(0)).toBe(0);
    expect(getLineClearBaseScore(1)).toBe(100);
    expect(getLineClearBaseScore(2)).toBe(300);
    expect(getLineClearBaseScore(3)).toBe(500);
    expect(getLineClearBaseScore(4)).toBe(800);
  });
});

describe("getLineClearAward", (): void => {
  it("scales by level and difficulty multiplier", (): void => {
    expect(getLineClearAward(4, 3, false, 2)).toBe(800 * 3 * 2);
  });

  it("applies the back-to-back multiplier only to TETRIS", (): void => {
    expect(getLineClearAward(4, 1, true, 1)).toBe(1_200);
    expect(getLineClearAward(2, 1, true, 1)).toBe(300);
  });
});

describe("getComboBonus", (): void => {
  it("starts awarding from the second consecutive clear", (): void => {
    expect(getComboBonus(0, 5, 1)).toBe(0);
    expect(getComboBonus(1, 5, 1)).toBe(0);
    expect(getComboBonus(2, 5, 1)).toBe(50 * 5);
    expect(getComboBonus(3, 5, 2)).toBe(100 * 5 * 2);
  });
});

describe("getDropScore", (): void => {
  it("prices soft and hard drops per cell", (): void => {
    expect(getDropScore(3, "soft")).toBe(3);
    expect(getDropScore(3, "hard")).toBe(6);
  });
});
