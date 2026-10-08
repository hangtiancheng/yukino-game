import type { GameState } from "@/types";

const SIMULATION_ERROR_MESSAGE = "Simulation error. Press R to restart.";

export function safelyUpdateGameState(
  previous: GameState,
  update: () => GameState,
  reportError: (error: unknown) => void,
): GameState {
  try {
    return update();
  } catch (error: unknown) {
    reportError(error);
    return { ...previous, phase: "lost", message: SIMULATION_ERROR_MESSAGE };
  }
}
