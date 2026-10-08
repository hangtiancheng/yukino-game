import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { LeaderboardPanel } from "@/components/leaderboard-panel";
import type { LeaderboardEntry } from "@/schema";

const entries: LeaderboardEntry[] = [
  {
    createdAt: "2026-05-15T00:00:00.000Z",
    difficulty: "hell",
    id: "run-one",
    level: 14,
    lines: 84,
    playerName: "Stacker",
    score: 10_260,
  },
  {
    createdAt: "2026-05-15T00:05:00.000Z",
    difficulty: "high",
    id: "run-two",
    level: 8,
    lines: 22,
    playerName: "Stacker",
    score: 4_480,
  },
];

describe("LeaderboardPanel", (): void => {
  it("renders an empty state when no entries", (): void => {
    render(<LeaderboardPanel entries={[]} />);
    expect(screen.getByText(/no runs recorded/i)).toBeInTheDocument();
  });

  it("renders rows for provided entries", (): void => {
    render(<LeaderboardPanel entries={entries} />);
    expect(screen.getByText("hell")).toBeInTheDocument();
    expect(screen.getByText("high")).toBeInTheDocument();
    expect(screen.getByText(/10,260/)).toBeInTheDocument();
    expect(screen.getByText(/84 lines/i)).toBeInTheDocument();
  });
});
