import { useAtomValue } from "jotai";
import { Link } from "react-router";
import type { CSSProperties, ReactElement } from "react";

import { VIEWPORT_HEIGHT, VIEWPORT_WIDTH } from "@/constants";
import { useFullscreen, useGameSession, useViewportScale } from "@/hooks";
import { difficultyAtom, rendererKindAtom } from "@/stores";
import { GameStage } from "./game-stage";
import { TouchControls } from "./touch-controls";

export function ImmersiveGame(): ReactElement {
  const difficulty = useAtomValue(difficultyAtom);
  const rendererKind = useAtomValue(rendererKindAtom);
  const { gameState, keyboard, restartGame, simulation } =
    useGameSession(difficulty);
  const fullscreen = useFullscreen();

  const scale = useViewportScale();
  const stageWrapperStyle: CSSProperties = {
    height: `${VIEWPORT_HEIGHT}px`,
    transform: `translate(-50%, -50%) scale(${scale})`,
    width: `${VIEWPORT_WIDTH}px`,
  };

  function handleExit(): void {
    if (fullscreen.active) {
      fullscreen.toggleFullscreen();
    }
  }

  return (
    <div className="fixed inset-0 z-0 flex h-screen w-screen items-center justify-center overflow-hidden bg-[#1c1915]">
      <div
        className="absolute top-1/2 left-1/2 origin-center"
        style={stageWrapperStyle}
      >
        <GameStage
          input={keyboard}
          onRestart={restartGame}
          rendererKind={rendererKind}
          simulation={simulation}
        />
      </div>
      <TouchControls
        inputRef={keyboard.inputRef}
        onRestart={restartGame}
        visible={gameState.phase === "running"}
      />
      <div className="fixed top-4 right-4 z-30 flex flex-wrap gap-3">
        <button
          className="hover:border-clay focus-visible:ring-clay rounded-md border border-[#3d382f] bg-[#26221d] px-4 py-2 text-xs font-semibold text-[#f2eee3] transition-colors focus-visible:ring-2 focus-visible:outline-none disabled:opacity-50"
          disabled={!fullscreen.supported}
          onClick={fullscreen.toggleFullscreen}
          type="button"
        >
          {fullscreen.active ? "Exit browser fullscreen" : "Browser fullscreen"}
        </button>
        <Link
          aria-label="Exit fullscreen game and return home"
          className="bg-clay-deep hover:bg-clay focus-visible:ring-clay rounded-md px-4 py-2 text-xs font-semibold text-[#fdf9f2] transition-colors focus-visible:ring-2 focus-visible:outline-none"
          onClick={handleExit}
          to="/"
        >
          Exit fullscreen
        </Link>
      </div>
    </div>
  );
}
