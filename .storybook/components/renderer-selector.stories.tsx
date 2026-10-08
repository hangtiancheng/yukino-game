import type { Meta, StoryObj } from "@storybook/react-vite";

import { RendererSelector } from "@/components/renderer-selector";

function handleRendererChange(): void {}

const meta: Meta<typeof RendererSelector> = {
  args: {
    onChange: handleRendererChange,
    selectedRenderer: "dom",
  },
  component: RendererSelector,
  title: "Controls/RendererSelector",
};

export default meta;

type Story = StoryObj<typeof meta>;

export const DomSelected: Story = {};

export const PixiSelected: Story = {
  args: { selectedRenderer: "pixi" },
};
