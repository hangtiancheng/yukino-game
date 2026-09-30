import { useSyncExternalStore } from "react";

const reducedMotionQuery: string = "(prefers-reduced-motion: reduce)";

export function useReducedMotion(): boolean {
  return useSyncExternalStore(
    subscribeReducedMotion,
    getReducedMotionSnapshot,
    getReducedMotionServerSnapshot,
  );
}

function subscribeReducedMotion(onChange: () => void): () => void {
  if (typeof window.matchMedia !== "function") {
    return (): void => {};
  }
  const mediaQuery = window.matchMedia(reducedMotionQuery);
  mediaQuery.addEventListener("change", onChange);
  return (): void => {
    mediaQuery.removeEventListener("change", onChange);
  };
}

function getReducedMotionSnapshot(): boolean {
  if (typeof window.matchMedia !== "function") {
    return false;
  }
  return window.matchMedia(reducedMotionQuery).matches;
}

function getReducedMotionServerSnapshot(): boolean {
  return false;
}
