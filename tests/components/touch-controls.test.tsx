import { fireEvent, render, screen } from "@testing-library/react";
import { useRef } from "react";
import type { ReactElement, RefObject } from "react";
import { beforeAll, describe, expect, it, vi } from "vitest";

import { TouchControls } from "@/components/touch-controls";
import type { GameInput } from "@/types";

const idleInput: GameInput = {
  left: false,
  right: false,
  softDrop: false,
  restart: false,
  actions: [],
};

function Host({
  inputRef,
  onRestart,
}: {
  inputRef: RefObject<GameInput>;
  onRestart: () => void;
}): ReactElement {
  return <TouchControls inputRef={inputRef} onRestart={onRestart} />;
}

function HostWithOwnRef({
  onRestart,
}: {
  onRestart: () => void;
}): ReactElement {
  const inputRef = useRef<GameInput>({ ...idleInput });
  return <Host inputRef={inputRef} onRestart={onRestart} />;
}

beforeAll((): void => {
  // jsdom does not implement pointer capture.
  Object.assign(HTMLElement.prototype, {
    setPointerCapture: (): void => undefined,
    releasePointerCapture: (): void => undefined,
    hasPointerCapture: (): boolean => false,
  });
});

describe("TouchControls", (): void => {
  it("renders directional, restart, and action buttons", (): void => {
    render(<HostWithOwnRef onRestart={(): void => undefined} />);
    expect(screen.getByRole("button", { name: "Left" })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Right" })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Hold" })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Spin" })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Drop" })).toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: /restart run/i }),
    ).toBeInTheDocument();
  });

  it("writes pointer presses into the game input ref", (): void => {
    const inputRef: RefObject<GameInput> = { current: { ...idleInput } };
    render(<Host inputRef={inputRef} onRestart={(): void => undefined} />);
    const leftButton = screen.getByRole("button", { name: "Left" });
    fireEvent.pointerDown(leftButton);
    expect(inputRef.current.left).toBe(true);
    expect(leftButton).toHaveAttribute("aria-pressed", "true");
    fireEvent.pointerUp(leftButton);
    expect(inputRef.current.left).toBe(false);
    expect(leftButton).toHaveAttribute("aria-pressed", "false");
  });

  it("queues one-shot actions from the action buttons", (): void => {
    const inputRef: RefObject<GameInput> = { current: { ...idleInput } };
    render(<Host inputRef={inputRef} onRestart={(): void => undefined} />);
    fireEvent.pointerDown(screen.getByRole("button", { name: "Spin" }));
    expect(inputRef.current.actions).toEqual(["rotate-cw"]);
    fireEvent.pointerDown(screen.getByRole("button", { name: "Drop" }));
    expect(inputRef.current.actions).toEqual(["rotate-cw", "hard-drop"]);
  });

  it("invokes the restart callback", (): void => {
    const onRestart = vi.fn();
    render(<HostWithOwnRef onRestart={onRestart} />);
    fireEvent.click(screen.getByRole("button", { name: /restart run/i }));
    expect(onRestart).toHaveBeenCalledTimes(1);
  });
});
