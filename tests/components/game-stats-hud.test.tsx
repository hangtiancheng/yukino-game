import { render, screen } from "@testing-library/react";
import { useRef } from "react";
import type { ReactElement } from "react";
import { describe, expect, it } from "vitest";

import { GameStatsHud } from "@/components/game-stats-hud";
import type { GameSimulation } from "@/hooks";
import type { GameState } from "@/types";
import { createInitialGameState } from "@/utils";

function makeState(): GameState {
  const base = createInitialGameState("medium", 9);
  return {
    ...base,
    stats: {
      ...base.stats,
      score: 4_321,
      lines: 12,
      level: 4,
      elapsedMs: 12_500,
    },
  };
}

function StubHost(): ReactElement {
  const stateRef = useRef<GameState>(makeState());
  const simulation: GameSimulation = {
    getSnapshot: (): GameState => stateRef.current,
    reset: (): void => undefined,
    restart: (): void => undefined,
    stateRef,
    subscribe: (): (() => void) => (): void => undefined,
  };
  return <GameStatsHud simulation={simulation} />;
}

describe("GameStatsHud", (): void => {
  it("renders score, lines, level, and difficulty cards", (): void => {
    render(<StubHost />);
    expect(screen.getByText("Score")).toBeInTheDocument();
    expect(screen.getByText("0004321")).toBeInTheDocument();
    expect(screen.getByText("Lines")).toBeInTheDocument();
    expect(screen.getByText("12")).toBeInTheDocument();
    expect(screen.getByText("medium")).toBeInTheDocument();
  });
});
