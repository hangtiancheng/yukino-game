import { describe, expect, it } from "vitest";

import { difficultyOptions } from "@/constants";

describe("difficultyOptions", (): void => {
  it("defines all four tiers", (): void => {
    expect(difficultyOptions).toHaveLength(4);
    expect(difficultyOptions.map((option) => option.difficulty).sort()).toEqual(
      ["hell", "high", "low", "medium"],
    );
  });

  it("raises the start level and multiplier with difficulty", (): void => {
    const sorted = [...difficultyOptions].sort(
      (first, second): number => first.startLevel - second.startLevel,
    );
    for (let index = 1; index < sorted.length; index += 1) {
      const previous = sorted[index - 1];
      const current = sorted[index];
      if (previous === undefined || current === undefined) {
        throw new Error("missing difficulty option.");
      }
      expect(current.startLevel).toBeGreaterThan(previous.startLevel);
      expect(current.multiplier).toBeGreaterThan(previous.multiplier);
    }
  });
});
