import { MIN_GRAVITY_MS } from "@/constants";

// Guideline gravity curve: (0.8 - (level - 1) * 0.007)^(level - 1) seconds
// per row, clamped so the accumulator loop always terminates.
export function getGravityDelayMs(level: number): number {
  const safeLevel = Math.max(level, 1);
  const delaySeconds = Math.pow(0.8 - (safeLevel - 1) * 0.007, safeLevel - 1);
  return Math.max(delaySeconds * 1_000, MIN_GRAVITY_MS);
}
