import { describe, expect, it } from "vitest";

import {
  createIdleInput,
  drainGameActions,
  pressGameAction,
  setGameInputControl,
} from "@/utils";

describe("game input helpers", (): void => {
  it("starts idle with no queued actions", (): void => {
    expect(createIdleInput()).toEqual({
      left: false,
      right: false,
      softDrop: false,
      restart: false,
      actions: [],
    });
  });

  it("keeps held controls independent of queued actions", (): void => {
    const input = pressGameAction(createIdleInput(), "rotate-cw");
    const pressed = setGameInputControl(input, "left", true);
    expect(pressed.left).toBe(true);
    expect(pressed.actions).toEqual(["rotate-cw"]);
  });

  it("drains queued actions without touching held controls", (): void => {
    const input = setGameInputControl(
      pressGameAction(createIdleInput(), "hard-drop"),
      "right",
      true,
    );
    const drained = drainGameActions(input);
    expect(drained.actions).toEqual([]);
    expect(drained.right).toBe(true);
    expect(drainGameActions(drained)).toBe(drained);
  });
});
