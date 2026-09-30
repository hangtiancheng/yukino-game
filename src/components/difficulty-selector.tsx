import clsx from "clsx";
import type { ReactElement } from "react";

import { difficultyOptions } from "@/constants";
import type { DifficultyOption } from "@/constants";
import type { Difficulty } from "@/schema";

interface DifficultySelectorProps {
  difficulty: Difficulty;
  onChange: (difficulty: Difficulty) => void;
}

export function DifficultySelector({
  difficulty,
  onChange,
}: DifficultySelectorProps): ReactElement {
  return (
    <div className="border-line bg-card rounded-xl border p-4">
      <p className="text-ink text-sm font-medium">Difficulty</p>
      <div className="mt-3 grid grid-cols-2 gap-2">
        {difficultyOptions.map((option: DifficultyOption): ReactElement => (
          <button
            aria-pressed={option.difficulty === difficulty}
            className={getButtonClass(option.difficulty === difficulty)}
            key={option.difficulty}
            onClick={(): void => onChange(option.difficulty)}
            type="button"
          >
            <span className="text-sm font-semibold">{option.label}</span>
            <span className="text-ink-soft ml-1.5 text-xs">
              ×{option.multiplier} &middot; Lv{option.startLevel}
            </span>
          </button>
        ))}
      </div>
    </div>
  );
}

function getButtonClass(active: boolean): string {
  return clsx(
    "rounded-md border px-3 py-2 text-left transition-colors",
    active
      ? "border-clay bg-clay/10 text-ink"
      : "border-line bg-paper text-ink hover:border-clay/60",
  );
}
