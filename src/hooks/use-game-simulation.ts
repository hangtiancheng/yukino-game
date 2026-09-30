import {
  useCallback,
  useMemo,
  useRef,
  useState,
  useSyncExternalStore,
} from "react";
import type { RefObject } from "react";

import type { Difficulty } from "@/schema";
import { captureException } from "@/services";
import type { GameInput, GameState } from "@/types";
import {
  createInitialGameState,
  drainGameActions,
  safelyUpdateGameState,
  updateGameState,
} from "@/utils";
import { useGameLoop } from "./use-game-loop";

export interface GameSimulation {
  getSnapshot: () => GameState;
  reset: (difficulty: Difficulty) => void;
  restart: () => void;
  stateRef: RefObject<GameState>;
  subscribe: (listener: () => void) => () => void;
}

export function useGameSimulation(
  initialDifficulty: Difficulty,
  inputRef: RefObject<GameInput>,
): GameSimulation {
  const listenersRef = useRef<Set<() => void>>(new Set());
  const [stateRef] = useState((): RefObject<GameState> => ({
    current: createInitialGameState(initialDifficulty),
  }));

  const publish = useCallback((): void => {
    for (const listener of listenersRef.current) {
      listener();
    }
  }, []);

  const replaceState = useCallback(
    (nextState: GameState): void => {
      if (Object.is(stateRef.current, nextState)) {
        return;
      }
      stateRef.current = nextState;
      publish();
    },
    [publish, stateRef],
  );

  const getSnapshot = useCallback(
    (): GameState => stateRef.current,
    [stateRef],
  );

  const subscribe = useCallback((listener: () => void): (() => void) => {
    listenersRef.current.add(listener);
    return (): void => {
      listenersRef.current.delete(listener);
    };
  }, []);

  const reset = useCallback(
    (difficulty: Difficulty): void => {
      replaceState(createInitialGameState(difficulty));
    },
    [replaceState],
  );

  const restart = useCallback((): void => {
    reset(stateRef.current.difficulty);
  }, [reset, stateRef]);

  const advance = useCallback(
    (deltaMs: number): void => {
      if (deltaMs <= 0) {
        return;
      }
      const previousState = stateRef.current;
      const input = inputRef.current;
      replaceState(
        safelyUpdateGameState(
          previousState,
          (): GameState => updateGameState(previousState, input, deltaMs),
          captureException,
        ),
      );
      inputRef.current = drainGameActions(input);
    },
    [inputRef, replaceState, stateRef],
  );

  useGameLoop(advance, true);

  return useMemo(
    (): GameSimulation => ({
      getSnapshot,
      reset,
      restart,
      stateRef,
      subscribe,
    }),
    [getSnapshot, reset, restart, stateRef, subscribe],
  );
}

export function useGameSimulationState(simulation: GameSimulation): GameState {
  return useSyncExternalStore(
    simulation.subscribe,
    simulation.getSnapshot,
    simulation.getSnapshot,
  );
}
