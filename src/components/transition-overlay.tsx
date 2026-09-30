import type { ReactElement } from "react";

import type { GamePhase } from "@/types";

type TransitionPhase = Exclude<GamePhase, "running">;

interface TransitionOverlayProps {
  phase: TransitionPhase;
  message: string;
  onRestart: () => void;
  onResume: () => void;
}

export function TransitionOverlay({
  phase,
  message,
  onRestart,
  onResume,
}: TransitionOverlayProps): ReactElement {
  return (
    <div
      aria-label={getTitle(phase)}
      aria-modal="true"
      className={`absolute inset-0 grid place-items-center px-6 backdrop-blur-[2px] ${getBackdropClass(phase)}`}
      role="dialog"
    >
      <div className="border-line bg-card w-full max-w-md rounded-2xl border p-8 text-left shadow-[0_28px_64px_-32px_rgba(32,30,26,0.5)]">
        <p className="text-ink-soft flex items-center gap-2 text-sm font-medium">
          <span
            aria-hidden="true"
            className={`h-2.5 w-2.5 rounded-[3px] ${getGlyphClass(phase)}`}
          />
          {getEyebrow(phase)}
        </p>
        <h2 className="font-display text-ink mt-3 text-4xl leading-tight">
          {getTitle(phase)}
        </h2>
        <p className="text-ink-soft mt-3 text-sm leading-relaxed">{message}</p>
        <button
          className="bg-clay-deep text-card hover:bg-clay focus-visible:ring-clay focus-visible:ring-offset-card mt-6 rounded-md px-5 py-2.5 text-sm font-semibold transition-colors focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:outline-none"
          onClick={phase === "paused" ? onResume : onRestart}
          type="button"
        >
          {getActionLabel(phase)}
        </button>
      </div>
    </div>
  );
}

function getBackdropClass(phase: TransitionPhase): string {
  return phase === "lost" ? "bg-[#45231d]/50" : "bg-well/45";
}

function getGlyphClass(phase: TransitionPhase): string {
  switch (phase) {
    case "ready":
      return "bg-clay";
    case "paused":
      return "bg-[#5fa8a0]";
    case "lost":
      return "bg-[#cf6370]";
  }
}

function getEyebrow(phase: TransitionPhase): string {
  switch (phase) {
    case "ready":
      return "Yukino Tetris";
    case "paused":
      return "Stack on hold";
    case "lost":
      return "Top out";
  }
}

function getTitle(phase: TransitionPhase): string {
  switch (phase) {
    case "ready":
      return "Ready?";
    case "paused":
      return "Paused";
    case "lost":
      return "Game Over";
  }
}

function getActionLabel(phase: TransitionPhase): string {
  switch (phase) {
    case "ready":
      return "Reset";
    case "paused":
      return "Resume";
    case "lost":
      return "Play Again";
  }
}
