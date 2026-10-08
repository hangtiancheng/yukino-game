import type { Meta, StoryObj } from "@storybook/react-vite";

import type { LeaderboardEntry } from "@/schema";
import { LeaderboardPanel } from "@/components/leaderboard-panel";

const entries: LeaderboardEntry[] = [
  {
    createdAt: "2026-05-15T00:00:00.000Z",
    difficulty: "hell",
    id: "run-one",
    level: 14,
    lines: 84,
    playerName: "Stacker",
    score: 126_400,
  },
  {
    createdAt: "2026-05-15T00:05:00.000Z",
    difficulty: "high",
    id: "run-two",
    level: 9,
    lines: 32,
    playerName: "Stacker",
    score: 44_800,
  },
  {
    createdAt: "2026-05-15T00:10:00.000Z",
    difficulty: "medium",
    id: "run-three",
    level: 5,
    lines: 21,
    playerName: "Stacker",
    score: 12_775,
  },
];

const meta: Meta<typeof LeaderboardPanel> = {
  args: { entries: [] },
  component: LeaderboardPanel,
  title: "Panels/LeaderboardPanel",
};

export default meta;

type Story = StoryObj<typeof meta>;

export const Empty: Story = {};

export const WithEntries: Story = {
  args: { entries },
};
