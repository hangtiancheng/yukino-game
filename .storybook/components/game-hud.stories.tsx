import type { Meta, StoryObj } from "@storybook/react-vite";

import { GameHud } from "@/components/game-hud";

const meta: Meta<typeof GameHud> = {
  args: {
    difficulty: "medium",
    stats: {
      score: 1_320,
      lines: 6,
      level: 3,
      piecesLocked: 14,
      tetrises: 0,
      hardDrops: 9,
      holds: 2,
      rotates: 21,
      moves: 34,
      elapsedMs: 42_000,
    },
  },
  component: GameHud,
  title: "Game/GameHud",
};

export default meta;

type Story = StoryObj<typeof meta>;

export const EarlyRun: Story = {};

export const HighScoreRun: Story = {
  args: {
    difficulty: "hell",
    stats: {
      score: 126_400,
      lines: 84,
      level: 18,
      piecesLocked: 210,
      tetrises: 12,
      hardDrops: 160,
      holds: 24,
      rotates: 305,
      moves: 512,
      elapsedMs: 164_000,
    },
  },
};
