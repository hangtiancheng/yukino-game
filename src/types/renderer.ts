import type { z } from "zod";

import type { GameSimulation } from "@/hooks/use-game-simulation";
import type { gameRendererKindSchema } from "@/schema/renderer";
import type { GameState } from "./game";

export type GameRendererKind = z.infer<typeof gameRendererKindSchema>;

export interface GameRendererProps {
  reducedMotion: boolean;
  state: GameState;
}

export interface PixiGameRendererProps {
  simulation: GameSimulation;
}
