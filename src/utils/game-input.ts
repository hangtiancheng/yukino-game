import type { GameAction, GameInput } from "@/types";

export type GameInputControl = "left" | "restart" | "right" | "softDrop";

export function createIdleInput(): GameInput {
  return {
    left: false,
    right: false,
    softDrop: false,
    restart: false,
    actions: [],
  };
}

export function setGameInputControl(
  current: GameInput,
  control: GameInputControl,
  pressed: boolean,
): GameInput {
  switch (control) {
    case "left":
      return { ...current, left: pressed };
    case "right":
      return { ...current, right: pressed };
    case "softDrop":
      return { ...current, softDrop: pressed };
    case "restart":
      return { ...current, restart: pressed };
  }
}

export function pressGameAction(
  current: GameInput,
  action: GameAction,
): GameInput {
  return { ...current, actions: [...current.actions, action] };
}

export function drainGameActions(current: GameInput): GameInput {
  if (current.actions.length === 0) {
    return current;
  }
  return { ...current, actions: [] };
}
