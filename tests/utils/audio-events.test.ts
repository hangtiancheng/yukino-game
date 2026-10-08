import { describe, expect, it } from "vitest";

import type { GameState } from "@/types";
import {
  createInitialGameState,
  getAudioEvent,
  getToneProfiles,
  startGame,
} from "@/utils";
import type { GameAudioEvent } from "@/utils";

function makeRunning(): GameState {
  return startGame(createInitialGameState("medium", 5));
}

describe("getAudioEvent", (): void => {
  it("plays loss when the run ends", (): void => {
    expect(
      getAudioEvent(makeRunning(), { ...makeRunning(), phase: "lost" }),
    ).toBe("loss");
  });

  it("plays pause when pausing", (): void => {
    expect(
      getAudioEvent(makeRunning(), { ...makeRunning(), phase: "paused" }),
    ).toBe("pause");
  });

  it("plays start when leaving the ready phase", (): void => {
    const previous = createInitialGameState("medium", 5);
    expect(getAudioEvent(previous, makeRunning())).toBe("start");
  });

  it("prioritises level-up over line clears", (): void => {
    const base = makeRunning();
    const current: GameState = {
      ...base,
      stats: { ...base.stats, level: 4, lines: 10 },
    };
    expect(getAudioEvent(base, current)).toBe("level");
  });

  it("plays tetris for a four-line clear", (): void => {
    const base = makeRunning();
    const current: GameState = {
      ...base,
      stats: { ...base.stats, lines: 4, tetrises: 1 },
    };
    expect(getAudioEvent(base, current)).toBe("tetris");
  });

  it("plays clear for smaller line clears", (): void => {
    const base = makeRunning();
    const current: GameState = {
      ...base,
      stats: { ...base.stats, lines: 2 },
    };
    expect(getAudioEvent(base, current)).toBe("clear");
  });

  it("plays drop for hard drops even when the piece locks", (): void => {
    const base = makeRunning();
    const current: GameState = {
      ...base,
      stats: { ...base.stats, hardDrops: 1, piecesLocked: 1 },
    };
    expect(getAudioEvent(base, current)).toBe("drop");
  });

  it("plays hold when a piece is held", (): void => {
    const base = makeRunning();
    const current: GameState = {
      ...base,
      stats: { ...base.stats, holds: 1 },
    };
    expect(getAudioEvent(base, current)).toBe("hold");
  });

  it("plays lock when a piece lands", (): void => {
    const base = makeRunning();
    const current: GameState = {
      ...base,
      stats: { ...base.stats, piecesLocked: 1 },
    };
    expect(getAudioEvent(base, current)).toBe("lock");
  });

  it("plays rotate over move when both happen", (): void => {
    const base = makeRunning();
    const current: GameState = {
      ...base,
      stats: { ...base.stats, moves: 1, rotates: 1 },
    };
    expect(getAudioEvent(base, current)).toBe("rotate");
  });

  it("returns null when nothing happened", (): void => {
    expect(getAudioEvent(makeRunning(), makeRunning())).toBeNull();
  });
});

describe("getToneProfiles", (): void => {
  const events: readonly GameAudioEvent[] = [
    "clear",
    "drop",
    "hold",
    "level",
    "lock",
    "loss",
    "move",
    "pause",
    "rotate",
    "start",
    "tetris",
  ];

  it("provides profiles for every event", (): void => {
    for (const event of events) {
      expect(getToneProfiles(event).length).toBeGreaterThan(0);
    }
  });
});
