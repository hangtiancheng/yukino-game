import { useEffect, useRef } from "react";

import { FIXED_STEP_MS, MAX_FRAME_MS } from "@/constants";

export function useGameLoop(
  onFrame: (deltaMs: number) => void,
  active: boolean,
): void {
  const accumulatorRef = useRef<number>(0);
  const frameRef = useRef<number>(0);
  const previousTimeRef = useRef<number>(0);

  useEffect((): (() => void) | undefined => {
    if (!active) {
      return undefined;
    }

    function tick(time: number): void {
      const previousTime = previousTimeRef.current || time;
      const deltaMs = Math.min(time - previousTime, MAX_FRAME_MS);
      previousTimeRef.current = time;
      accumulatorRef.current += deltaMs;

      while (accumulatorRef.current >= FIXED_STEP_MS) {
        onFrame(FIXED_STEP_MS);
        accumulatorRef.current -= FIXED_STEP_MS;
      }

      frameRef.current = requestAnimationFrame(tick);
    }

    frameRef.current = requestAnimationFrame(tick);

    return (): void => {
      cancelAnimationFrame(frameRef.current);
      accumulatorRef.current = 0;
      previousTimeRef.current = 0;
    };
  }, [active, onFrame]);
}
