import { Suspense, lazy } from "react";
import type { ReactElement } from "react";

import type { GameSimulation } from "@/hooks";
import type { GameRendererKind, GameState } from "@/types";
import { DomGameRenderer } from "./renderers";

const LazyPixiGameRenderer = lazy(() =>
  import("./renderers/pixi-game-renderer").then((module) => ({
    default: module.PixiGameRenderer,
  })),
);

interface GameRendererProps {
  reducedMotion: boolean;
  rendererKind: GameRendererKind;
  simulation: GameSimulation;
  state: GameState;
}

export function GameRenderer({
  reducedMotion,
  rendererKind,
  simulation,
  state,
}: GameRendererProps): ReactElement {
  switch (rendererKind) {
    case "dom":
      return <DomGameRenderer reducedMotion={reducedMotion} state={state} />;
    case "pixi":
      return (
        <Suspense fallback={<RendererFallback />}>
          <LazyPixiGameRenderer simulation={simulation} />
        </Suspense>
      );
  }
}

export function RunningMessage({ message }: { message: string }): ReactElement {
  return (
    <p
      aria-live="polite"
      className="border-line bg-card/95 text-ink absolute top-5 left-5 rounded-md border px-3 py-1.5 text-xs font-semibold shadow-[0_6px_16px_-8px_rgba(32,30,26,0.35)]"
      role="status"
    >
      {message}
    </p>
  );
}

function RendererFallback(): ReactElement {
  return (
    <div className="bg-paper text-ink-soft absolute inset-0 grid place-items-center text-sm font-medium">
      Loading Pixi renderer
    </div>
  );
}
