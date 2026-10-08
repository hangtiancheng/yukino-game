import { useSyncExternalStore } from "react";

import { VIEWPORT_HEIGHT, VIEWPORT_WIDTH } from "@/constants";

const FALLBACK_SCALE = 1;

function subscribe(callback: () => void): () => void {
  globalThis.addEventListener("resize", callback);
  globalThis.addEventListener("orientationchange", callback);
  return (): void => {
    globalThis.removeEventListener("resize", callback);
    globalThis.removeEventListener("orientationchange", callback);
  };
}

function getSnapshot(): number {
  const widthScale = globalThis.innerWidth / VIEWPORT_WIDTH;
  const heightScale = globalThis.innerHeight / VIEWPORT_HEIGHT;
  const scale = Math.min(widthScale, heightScale);
  return Number.isFinite(scale) && scale > 0 ? scale : FALLBACK_SCALE;
}

function getServerSnapshot(): number {
  return FALLBACK_SCALE;
}

export function useViewportScale(): number {
  return useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
}
