import type { Meta, StoryObj } from "@storybook/react-vite";

import type { GameState } from "@/types";
import { createIdleInput, createInitialGameState } from "@/utils";
import type { GameSimulation, KeyboardInputControls } from "@/hooks";
import { GameStage } from "@/components/game-stage";

function handleRestart(): void {}

function handleKeyboardEvent(): void {}

function handlePress(): void {}

const runningState: GameState = {
  ...createInitialGameState("medium", 7),
  message: "Stack the falling tetrominoes. Clear full rows to score.",
  phase: "running",
};

const input: KeyboardInputControls = {
  inputRef: { current: createIdleInput() },
  onBlur: handleKeyboardEvent,
  onKeyDown: handleKeyboardEvent,
  onKeyUp: handleKeyboardEvent,
  press: handlePress,
  reset: handleKeyboardEvent,
};

const simulation: GameSimulation = createStaticSimulation(runningState);

const meta: Meta<typeof GameStage> = {
  args: {
    input,
    onRestart: handleRestart,
    rendererKind: "dom",
    simulation,
  },
  component: GameStage,
  title: "Game/GameStage",
};

export default meta;

type Story = StoryObj<typeof meta>;

export const Running: Story = {};

function createStaticSimulation(state: GameState): GameSimulation {
  const listeners = new Set<() => void>();
  return {
    getSnapshot: (): GameState => state,
    reset: (): void => undefined,
    restart: handleRestart,
    stateRef: { current: state },
    subscribe(listener: () => void): () => void {
      listeners.add(listener);
      return (): void => {
        listeners.delete(listener);
      };
    },
  };
}
