import clsx from "clsx";
import { useState } from "react";
import type { PointerEvent, ReactElement, RefObject } from "react";

import type { GameAction, GameInput } from "@/types";
import { pressGameAction, setGameInputControl } from "@/utils";
import type { GameInputControl } from "@/utils";

interface TouchControlsProps {
  inputRef: RefObject<GameInput>;
  onRestart: () => void;
  visible?: boolean;
}

export function TouchControls({
  inputRef,
  onRestart,
  visible = true,
}: TouchControlsProps): ReactElement {
  return (
    <div
      className={clsx(
        "pointer-events-none fixed inset-x-0 bottom-4 z-20 flex items-end justify-between px-4 transition-opacity sm:hidden",
        visible ? "opacity-100" : "pointer-events-none opacity-0",
      )}
    >
      <div className="pointer-events-auto flex gap-3">
        <TouchButton control="left" inputRef={inputRef} label="Left" />
        <TouchButton control="right" inputRef={inputRef} label="Right" />
      </div>
      <div className="pointer-events-auto flex gap-3">
        <button
          aria-label="Restart run"
          className={buttonClass("border-line bg-card text-ink")}
          onClick={onRestart}
          type="button"
        >
          R
        </button>
        <ActionButton action="hold" inputRef={inputRef} label="Hold" />
        <ActionButton action="rotate-cw" inputRef={inputRef} label="Spin" />
        <ActionButton
          action="hard-drop"
          inputRef={inputRef}
          label="Drop"
          prominent
        />
      </div>
    </div>
  );
}

function TouchButton({
  control,
  inputRef,
  label,
}: TouchButtonProps): ReactElement {
  const [pressed, setPressedState] = useState<boolean>(false);

  function setPressed(
    event: PointerEvent<HTMLButtonElement>,
    nextPressed: boolean,
  ): void {
    event.preventDefault();
    if (nextPressed) {
      event.currentTarget.setPointerCapture(event.pointerId);
    } else if (event.currentTarget.hasPointerCapture(event.pointerId)) {
      event.currentTarget.releasePointerCapture(event.pointerId);
    }
    inputRef.current = setGameInputControl(
      inputRef.current,
      control,
      nextPressed,
    );
    setPressedState(nextPressed);
  }

  return (
    <button
      aria-label={label}
      aria-pressed={pressed}
      className={buttonClass("border-line bg-card text-ink")}
      onPointerCancel={(event: PointerEvent<HTMLButtonElement>): void =>
        setPressed(event, false)
      }
      onPointerDown={(event: PointerEvent<HTMLButtonElement>): void =>
        setPressed(event, true)
      }
      onPointerLeave={(event: PointerEvent<HTMLButtonElement>): void =>
        setPressed(event, false)
      }
      onPointerUp={(event: PointerEvent<HTMLButtonElement>): void =>
        setPressed(event, false)
      }
      type="button"
    >
      {label}
    </button>
  );
}

function ActionButton({
  action,
  inputRef,
  label,
  prominent = false,
}: ActionButtonProps): ReactElement {
  function handlePointerDown(event: PointerEvent<HTMLButtonElement>): void {
    event.preventDefault();
    inputRef.current = pressGameAction(inputRef.current, action);
  }

  return (
    <button
      aria-label={label}
      className={buttonClass(
        prominent
          ? "border-clay-deep bg-clay-deep text-[#fdf9f2]"
          : "border-line bg-card text-ink",
      )}
      onPointerDown={handlePointerDown}
      type="button"
    >
      {label}
    </button>
  );
}

interface TouchButtonProps {
  control: GameInputControl;
  inputRef: RefObject<GameInput>;
  label: string;
}

interface ActionButtonProps {
  action: GameAction;
  inputRef: RefObject<GameInput>;
  label: string;
  prominent?: boolean;
}

function buttonClass(tone: string): string {
  return clsx(
    "h-14 min-w-14 touch-none rounded-xl border px-3 text-sm font-semibold shadow-[0_3px_10px_-4px_rgba(32,30,26,0.35)] focus-visible:ring-2 focus-visible:ring-clay focus-visible:outline-none",
    tone,
  );
}
