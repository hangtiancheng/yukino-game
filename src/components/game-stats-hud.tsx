import type { ReactElement } from "react";

import { useGameSimulationState } from "@/hooks";
import type { GameSimulation } from "@/hooks";
import { GameHud } from "./game-hud";

interface GameStatsHudProps {
  simulation: GameSimulation;
}

export function GameStatsHud({ simulation }: GameStatsHudProps): ReactElement {
  const state = useGameSimulationState(simulation);
  return <GameHud difficulty={state.difficulty} stats={state.stats} />;
}
