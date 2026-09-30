import { useCallback } from "react";

import type { Difficulty } from "@/schema";
import type { GameState } from "@/types";
import { useGameAudio } from "./use-game-audio";
import type { GameAudioControls } from "./use-game-audio";
import {
  useGameSimulation,
  useGameSimulationState,
} from "./use-game-simulation";
import type { GameSimulation } from "./use-game-simulation";
import { useKeyboardInput } from "./use-keyboard-input";
import type { KeyboardInputControls } from "./use-keyboard-input";
import { useScoreSubmission } from "./use-score-submission";

export interface GameSession {
  audio: GameAudioControls;
  gameState: GameState;
  keyboard: KeyboardInputControls;
  restartGame: () => void;
  simulation: GameSimulation;
}

export function useGameSession(difficulty: Difficulty): GameSession {
  const keyboard = useKeyboardInput();
  const simulation = useGameSimulation(difficulty, keyboard.inputRef);
  const audio = useGameAudio(simulation);
  useScoreSubmission(simulation);
  const gameState = useGameSimulationState(simulation);

  const restartGame = useCallback((): void => {
    keyboard.reset();
    simulation.restart();
  }, [keyboard, simulation]);

  return { audio, gameState, keyboard, restartGame, simulation };
}
