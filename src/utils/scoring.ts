import {
  BACK_TO_BACK_MULTIPLIER,
  COMBO_BONUS,
  HARD_DROP_POINT,
  LINE_CLEAR_BASE_SCORES,
  SOFT_DROP_POINT,
} from "@/constants";

export type DropKind = "hard" | "soft";

export function getLineClearBaseScore(clearedRows: number): number {
  return LINE_CLEAR_BASE_SCORES[clearedRows] ?? 0;
}

export function getLineClearAward(
  clearedRows: number,
  level: number,
  backToBackActive: boolean,
  multiplier: number,
): number {
  const base = getLineClearBaseScore(clearedRows);
  const backToBackFactor =
    backToBackActive && clearedRows === 4 ? BACK_TO_BACK_MULTIPLIER : 1;
  return Math.floor(base * level * backToBackFactor * multiplier);
}

export function getComboBonus(
  combo: number,
  level: number,
  multiplier: number,
): number {
  if (combo <= 1) {
    return 0;
  }
  return Math.floor((combo - 1) * COMBO_BONUS * level * multiplier);
}

export function getDropScore(cells: number, kind: DropKind): number {
  return cells * (kind === "hard" ? HARD_DROP_POINT : SOFT_DROP_POINT);
}
