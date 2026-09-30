import { useEffect, useId, useRef } from "react";
import type { CSSProperties, ReactElement } from "react";

import { VIEWPORT_HEIGHT, VIEWPORT_WIDTH } from "@/constants";
import { useGameSimulationState, useReducedMotion } from "@/hooks";
import type { GameSimulation, KeyboardInputControls } from "@/hooks";
import type { GameRendererKind } from "@/types";
import { GameRenderer, RunningMessage } from "./game-stage-internals";
import { TransitionOverlay } from "./transition-overlay";

interface GameStageProps {
  input: KeyboardInputControls;
  onRestart: () => void;
  rendererKind?: GameRendererKind;
  simulation: GameSimulation;
}

export function GameStage({
  input,
  onRestart,
  rendererKind = "dom",
  simulation,
}: GameStageProps): ReactElement {
  const descriptionId = useId();
  const stageRef = useRef<HTMLDivElement | null>(null);
  const state = useGameSimulationState(simulation);
  const reducedMotion = useReducedMotion();
  const stageStyle: CSSProperties = {
    height: `${VIEWPORT_HEIGHT}px`,
    width: `${VIEWPORT_WIDTH}px`,
  };

  useEffect((): void => {
    stageRef.current?.focus({ preventScroll: true });
  }, []);

  function handlePointerDown(): void {
    stageRef.current?.focus({ preventScroll: true });
  }

  function handleResume(): void {
    input.press("pause");
  }

  return (
    <div
      aria-describedby={descriptionId}
      aria-label="Yukino Tetris game stage"
      className="border-line focus-visible:ring-clay focus-visible:ring-offset-paper relative max-w-full overflow-hidden rounded-[20px] border bg-linear-to-b from-[#fdfbf6] to-[#f2efe6] shadow-[0_24px_60px_-32px_rgba(32,30,26,0.45)] focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:outline-none"
      onBlur={input.onBlur}
      onKeyDown={input.onKeyDown}
      onKeyUp={input.onKeyUp}
      onPointerDown={handlePointerDown}
      ref={stageRef}
      role="application"
      style={stageStyle}
      tabIndex={0}
    >
      <p className="sr-only" id={descriptionId}>
        Use arrow keys or A and D to move, Up or X to rotate, Z to rotate
        counter-clockwise, Space to hard drop, C to hold, P to pause, and R to
        restart.
      </p>
      <GameRenderer
        reducedMotion={reducedMotion}
        rendererKind={rendererKind}
        simulation={simulation}
        state={state}
      />
      {state.phase === "running" ? (
        <RunningMessage message={state.message} />
      ) : (
        <TransitionOverlay
          message={state.message}
          onRestart={onRestart}
          onResume={handleResume}
          phase={state.phase}
        />
      )}
    </div>
  );
}
