import { useAtomValue, useSetAtom } from "jotai";
import { useEffect, useRef } from "react";

import {
  createLeaderboardEntry,
  insertLeaderboardEntry,
  leaderboardAtom,
  playerNameAtom,
} from "@/stores";
import type { GameState } from "@/types";
import type { GameSimulation } from "./use-game-simulation";

export function useScoreSubmission(simulation: GameSimulation): void {
  const setLeaderboard = useSetAtom(leaderboardAtom);
  const playerName = useAtomValue(playerNameAtom);
  const submittedStateRef = useRef<GameState | null>(null);

  useEffect((): (() => void) => {
    function handleStateChange(): void {
      const gameState = simulation.getSnapshot();
      if (
        gameState.phase !== "lost" ||
        submittedStateRef.current === gameState
      ) {
        return;
      }

      submittedStateRef.current = gameState;
      const entry = createLeaderboardEntry(
        playerName,
        gameState.stats.score,
        gameState.stats.lines,
        gameState.stats.level,
        gameState.difficulty,
      );
      setLeaderboard((entries) => insertLeaderboardEntry(entries, entry));
    }

    return simulation.subscribe(handleStateChange);
  }, [playerName, setLeaderboard, simulation]);
}
