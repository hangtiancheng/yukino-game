import { useCallback, useEffect, useMemo, useRef } from "react";
import type { KeyboardEvent, RefObject } from "react";

import type { GameAction, GameInput } from "@/types";
import { createIdleInput, pressGameAction, setGameInputControl } from "@/utils";

export interface KeyboardInputControls {
  inputRef: RefObject<GameInput>;
  onBlur: () => void;
  onKeyDown: (event: KeyboardEvent<HTMLElement>) => void;
  onKeyUp: (event: KeyboardEvent<HTMLElement>) => void;
  press: (action: GameAction) => void;
  reset: () => void;
}

export function useKeyboardInput(): KeyboardInputControls {
  const inputRef = useRef<GameInput>(createIdleInput());

  const onKeyDown = useCallback((event: KeyboardEvent<HTMLElement>): void => {
    if (!isGameKey(event.code)) {
      return;
    }
    event.preventDefault();
    if (event.repeat) {
      return;
    }
    const action = getPressedAction(event.code);
    inputRef.current =
      action === null
        ? updateInput(inputRef.current, event.code, true)
        : pressGameAction(inputRef.current, action);
  }, []);

  const onKeyUp = useCallback((event: KeyboardEvent<HTMLElement>): void => {
    if (isGameKey(event.code)) {
      event.preventDefault();
      inputRef.current = updateInput(inputRef.current, event.code, false);
    }
  }, []);

  const press = useCallback((action: GameAction): void => {
    inputRef.current = pressGameAction(inputRef.current, action);
  }, []);

  const reset = useCallback((): void => {
    inputRef.current = createIdleInput();
  }, []);

  const onBlur = useCallback((): void => {
    inputRef.current = createIdleInput();
  }, []);

  useEffect((): (() => void) => {
    function handleGlobalKeyUp(event: globalThis.KeyboardEvent): void {
      if (isGameKey(event.code)) {
        inputRef.current = updateInput(inputRef.current, event.code, false);
      }
    }
    window.addEventListener("keyup", handleGlobalKeyUp);
    return (): void => {
      window.removeEventListener("keyup", handleGlobalKeyUp);
    };
  }, []);

  return useMemo(
    (): KeyboardInputControls => ({
      inputRef,
      onBlur,
      onKeyDown,
      onKeyUp,
      press,
      reset,
    }),
    [onBlur, onKeyDown, onKeyUp, press, reset],
  );
}

function updateInput(
  current: GameInput,
  code: string,
  pressed: boolean,
): GameInput {
  switch (code) {
    case "ArrowLeft":
    case "KeyA":
      return setGameInputControl(current, "left", pressed);
    case "ArrowRight":
    case "KeyD":
      return setGameInputControl(current, "right", pressed);
    case "ArrowDown":
    case "KeyS":
      return setGameInputControl(current, "softDrop", pressed);
    case "KeyR":
      return setGameInputControl(current, "restart", pressed);
    default:
      return current;
  }
}

function getPressedAction(code: string): GameAction | null {
  switch (code) {
    case "ArrowUp":
    case "KeyW":
    case "KeyX":
      return "rotate-cw";
    case "KeyZ":
      return "rotate-ccw";
    case "Space":
      return "hard-drop";
    case "KeyC":
    case "ShiftLeft":
    case "ShiftRight":
      return "hold";
    case "KeyP":
    case "Escape":
      return "pause";
    default:
      return null;
  }
}

function isGameKey(code: string): boolean {
  return getPressedAction(code) !== null || isHeldKey(code);
}

function isHeldKey(code: string): boolean {
  switch (code) {
    case "ArrowLeft":
    case "ArrowRight":
    case "ArrowDown":
    case "KeyA":
    case "KeyD":
    case "KeyS":
    case "KeyR":
      return true;
    default:
      return false;
  }
}
