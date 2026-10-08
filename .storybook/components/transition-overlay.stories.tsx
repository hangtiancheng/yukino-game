import type { Meta, StoryObj } from "@storybook/react-vite";
import type { ReactElement } from "react";

import { TransitionOverlay } from "@/components/transition-overlay";

function handleRestart(): void {}

function handleResume(): void {}

const meta: Meta<typeof TransitionOverlay> = {
  args: {
    message: "Press any control to start stacking.",
    onRestart: handleRestart,
    onResume: handleResume,
    phase: "ready",
  },
  component: TransitionOverlay,
  decorators: [
    (Story): ReactElement => (
      <div className="border-line relative h-135 w-240 max-w-full overflow-hidden rounded-[20px] border bg-linear-to-b from-[#fdfbf6] to-[#f2efe6]">
        <Story />
      </div>
    ),
  ],
  title: "Game/TransitionOverlay",
};

export default meta;

type Story = StoryObj<typeof meta>;

export const Ready: Story = {};

export const Paused: Story = {
  args: { message: "Paused. Press P to resume.", phase: "paused" },
};

export const Lost: Story = {
  args: { message: "Top out. Press R to restart.", phase: "lost" },
};
