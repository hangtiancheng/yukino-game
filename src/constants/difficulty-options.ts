import type { Difficulty } from "@/schema";

export interface DifficultyOption {
  difficulty: Difficulty;
  label: string;
  multiplier: number;
  startLevel: number;
  summary: string;
}

const mediumOption: DifficultyOption = {
  difficulty: "medium",
  label: "Medium",
  multiplier: 1.5,
  startLevel: 3,
  summary: "Balanced gravity curve with a 1.5x line-clear multiplier.",
};

export const difficultyOptions: DifficultyOption[] = [
  {
    difficulty: "low",
    label: "Low",
    multiplier: 1,
    startLevel: 1,
    summary: "Slow, forgiving gravity for learning clean stacking.",
  },
  mediumOption,
  {
    difficulty: "high",
    label: "High",
    multiplier: 2,
    startLevel: 6,
    summary: "Fast drops from the first piece. Sharp risk, sharp reward.",
  },
  {
    difficulty: "hell",
    label: "Hell",
    multiplier: 3,
    startLevel: 10,
    summary: "Near kill-screen gravity. One sloppy stack ends everything.",
  },
];

export function getDifficultyOption(difficulty: Difficulty): DifficultyOption {
  for (const option of difficultyOptions) {
    if (option.difficulty === difficulty) {
      return option;
    }
  }
  return mediumOption;
}
