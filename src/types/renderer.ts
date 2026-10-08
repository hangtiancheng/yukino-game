import type { z } from "zod";

import type { GameSimulation } from "@/hooks/use-game-simulation";
import type { gameRendererKindSchema } from "@/schema/renderer";
import type { GameState } from "./game";

export type GameRendererKind = z.infer<typeof gameRendererKindSchema>;

export interface GameRendererProps {
  reducedMotion: boolean;
  state: GameState;
}

// The Pixi renderer draws a static scene description with no CSS
// transitions, so it has nothing to reduce for prefers-reduced-motion.
export interface PixiGameRendererProps {
  simulation: GameSimulation;
}
