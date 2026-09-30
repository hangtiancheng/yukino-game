import { gsap } from "gsap";
import { useEffect, useRef, useState } from "react";
import type { ReactElement } from "react";

import type { GameStats } from "@/types";
import type { Difficulty } from "@/schema";
import { useReducedMotion } from "@/hooks";

interface GameHudProps {
  difficulty: Difficulty;
  stats: GameStats;
}

export function GameHud({ difficulty, stats }: GameHudProps): ReactElement {
  const displayedScore = useAnimatedScore(stats.score);
  return (
    <div className="border-line bg-card flex flex-wrap items-center gap-x-8 gap-y-2 rounded-xl border px-5 py-3">
      <HudItem
        label="Score"
        value={displayedScore.toString().padStart(7, "0")}
      />
      <HudItem label="Lines" value={stats.lines.toString()} />
      <HudItem label="Level" value={stats.level.toString()} />
      <HudItem label={difficulty} value={formatTime(stats.elapsedMs)} />
    </div>
  );
}

function useAnimatedScore(score: number): number {
  const reducedMotion = useReducedMotion();
  const previousScoreRef = useRef<number>(score);
  const [displayedScore, setDisplayedScore] = useState<number>(score);

  useEffect((): (() => void) | undefined => {
    if (reducedMotion) {
      previousScoreRef.current = score;
      return undefined;
    }
    const tweenState = { value: previousScoreRef.current };
    const tween = gsap.to(tweenState, {
      duration: 0.35,
      ease: "power2.out",
      onComplete: (): void => {
        previousScoreRef.current = score;
        setDisplayedScore(score);
      },
      onUpdate: (): void => {
        setDisplayedScore(Math.floor(tweenState.value));
      },
      value: score,
    });
    return (): void => {
      previousScoreRef.current = score;
      tween.kill();
    };
  }, [reducedMotion, score]);

  return reducedMotion ? score : displayedScore;
}

interface HudItemProps {
  label: string;
  value: string;
}

function HudItem({ label, value }: HudItemProps): ReactElement {
  return (
    <span className="flex items-baseline gap-2">
      <span className="text-ink-soft text-xs font-medium">{label}</span>
      <span className="text-ink text-sm font-semibold tabular-nums">
        {value}
      </span>
    </span>
  );
}

function formatTime(elapsedMs: number): string {
  return Math.floor(elapsedMs / 1_000)
    .toString()
    .padStart(3, "0");
}
