import { describe, expect, it } from "vitest";

import { getGravityDelayMs } from "@/utils";

describe("getGravityDelayMs", (): void => {
  it("starts at one second per row", (): void => {
    expect(getGravityDelayMs(1)).toBe(1_000);
  });

  it("decreases monotonically with level and stays positive", (): void => {
    let previous = getGravityDelayMs(1);
    for (let level = 2; level <= 20; level += 1) {
      const current = getGravityDelayMs(level);
      expect(current).toBeLessThanOrEqual(previous);
      expect(current).toBeGreaterThanOrEqual(1);
      previous = current;
    }
  });
});
