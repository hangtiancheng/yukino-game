import { describe, expect, it } from "vitest";

import { createInitialGameState, safelyUpdateGameState } from "@/utils";

describe("safelyUpdateGameState", (): void => {
  it("returns updated state when the update succeeds", (): void => {
    const previous = createInitialGameState("medium", 3);
    const next = { ...previous, message: "Updated" };
    const errors: unknown[] = [];
    expect(
      safelyUpdateGameState(previous, (): typeof next => next, errors.push),
    ).toBe(next);
    expect(errors).toHaveLength(0);
  });

  it("reports unexpected errors and stops the broken simulation state", (): void => {
    const previous = createInitialGameState("medium", 3);
    const error = new Error("boom");
    const errors: unknown[] = [];
    const next = safelyUpdateGameState(
      previous,
      (): never => {
        throw error;
      },
      (reportedError: unknown): void => {
        errors.push(reportedError);
      },
    );
    expect(errors).toEqual([error]);
    expect(next.board).toBe(previous.board);
    expect(next.phase).toBe("lost");
    expect(next.message).toBe("Simulation error. Press R to restart.");
  });
});
