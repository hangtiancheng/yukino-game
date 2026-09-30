import type { ReactElement } from "react";

import type { GameAudioControls } from "@/hooks";

interface GameHeaderProps {
  audio: GameAudioControls;
}

interface HintProps {
  keys: string;
  label: string;
}

export function GameHeader({ audio }: GameHeaderProps): ReactElement {
  return (
    <header className="border-line flex flex-wrap items-end justify-between gap-x-6 gap-y-4 border-b pb-5">
      <div>
        <h1 className="font-display text-ink text-4xl leading-none sm:text-5xl">
          Yukino Tetris
        </h1>
        <p className="text-ink-soft mt-2 text-sm">
          Original falling-block prototype. Stack, clear, and hold the line.
        </p>
      </div>
      <div className="flex flex-wrap items-center gap-x-4 gap-y-2">
        <div className="hidden items-center gap-3 sm:flex">
          <Hint keys="←/→" label="move" />
          <Hint keys="↑" label="rotate" />
          <Hint keys="Space" label="drop" />
          <Hint keys="C" label="hold" />
          <Hint keys="P" label="pause" />
          <Hint keys="R" label="restart" />
        </div>
        <button
          className="border-line bg-card text-ink hover:border-clay hover:text-clay-deep rounded-md border px-3 py-1.5 text-xs font-semibold transition-colors"
          onClick={audio.toggleEnabled}
          type="button"
        >
          {audio.statusLabel}
        </button>
      </div>
    </header>
  );
}

function Hint({ keys, label }: HintProps): ReactElement {
  return (
    <span className="text-ink-soft flex items-center gap-1.5 text-xs">
      <kbd className="border-line bg-card text-ink rounded-[5px] border px-1.5 py-0.5 text-[11px] font-semibold shadow-[0_1px_0_var(--color-line)]">
        {keys}
      </kbd>{" "}
      {label}
    </span>
  );
}
