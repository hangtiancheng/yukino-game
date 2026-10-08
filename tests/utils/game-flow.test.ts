import { describe, expect, it } from "vitest";

import type { GameInput } from "@/types";
import {
  createInitialGameState,
  getLineClearMessage,
  hasStartInput,
  pauseGame,
  resumeGame,
  startGame,
  topOut,
} from "@/utils";

const idleInput: GameInput = {
  left: false,
  right: false,
  softDrop: false,
  restart: false,
  actions: [],
};

describe("phase transitions", (): void => {
  it("starts the run with a guiding message", (): void => {
    const state = startGame(createInitialGameState("medium", 1));
    expect(state.phase).toBe("running");
    expect(state.message).toMatch(/stack/i);
    expect(state.messageTimerMs).toBe(2_400);
  });

  it("pauses and resumes", (): void => {
    const running = startGame(createInitialGameState("medium", 1));
    const paused = pauseGame(running);
    expect(paused.phase).toBe("paused");
    expect(resumeGame(paused).phase).toBe("running");
  });

  it("marks a top out as lost", (): void => {
    const lost = topOut(startGame(createInitialGameState("medium", 1)));
    expect(lost.phase).toBe("lost");
    expect(lost.message).toMatch(/top out/i);
  });
});

describe("hasStartInput", (): void => {
  it("requires movement or a non-pause action", (): void => {
    expect(hasStartInput(idleInput)).toBe(false);
    expect(hasStartInput({ ...idleInput, actions: ["pause"] })).toBe(false);
    expect(hasStartInput({ ...idleInput, actions: ["rotate-cw"] })).toBe(true);
    expect(hasStartInput({ ...idleInput, left: true })).toBe(true);
  });
});

describe("getLineClearMessage", (): void => {
  it("labels each clear size", (): void => {
    expect(getLineClearMessage(1, false, 1)).toBe("Single.");
    expect(getLineClearMessage(2, false, 1)).toBe("Double!");
    expect(getLineClearMessage(3, false, 1)).toBe("Triple!");
    expect(getLineClearMessage(4, false, 1)).toBe("TETRIS!");
  });

  it("flags back-to-back TETRIS and combos", (): void => {
    expect(getLineClearMessage(4, true, 1)).toBe("Back-to-back TETRIS!");
    expect(getLineClearMessage(2, false, 3)).toBe("Double! Combo x3.");
  });
});
