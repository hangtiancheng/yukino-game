import type { Meta, StoryObj } from "@storybook/react-vite";

import { DifficultySelector } from "@/components/difficulty-selector";

function handleDifficultyChange(): void {}

const meta: Meta<typeof DifficultySelector> = {
  args: {
    difficulty: "medium",
    onChange: handleDifficultyChange,
  },
  component: DifficultySelector,
  title: "Controls/DifficultySelector",
};

export default meta;

type Story = StoryObj<typeof meta>;

export const MediumSelected: Story = {};

export const LowSelected: Story = {
  args: { difficulty: "low" },
};

export const HellSelected: Story = {
  args: { difficulty: "hell" },
};
