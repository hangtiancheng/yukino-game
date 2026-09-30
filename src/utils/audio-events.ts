import type { GameState } from "@/types";

export type GameAudioEvent =
  | "clear"
  | "drop"
  | "hold"
  | "level"
  | "lock"
  | "loss"
  | "move"
  | "pause"
  | "rotate"
  | "start"
  | "tetris";

export interface ToneProfile {
  delay: number;
  duration: number;
  frequency: number;
  gain: number;
  type: OscillatorType;
}

export function getAudioEvent(
  previous: GameState,
  current: GameState,
): GameAudioEvent | null {
  if (current.phase === "lost" && previous.phase !== "lost") {
    return "loss";
  }
  if (current.phase === "paused" && previous.phase !== "paused") {
    return "pause";
  }
  if (previous.phase === "ready" && current.phase === "running") {
    return "start";
  }
  if (current.stats.level > previous.stats.level) {
    return "level";
  }
  if (current.stats.tetrises > previous.stats.tetrises) {
    return "tetris";
  }
  if (current.stats.lines > previous.stats.lines) {
    return "clear";
  }
  if (current.stats.hardDrops > previous.stats.hardDrops) {
    return "drop";
  }
  if (current.stats.holds > previous.stats.holds) {
    return "hold";
  }
  if (current.stats.piecesLocked > previous.stats.piecesLocked) {
    return "lock";
  }
  if (current.stats.rotates > previous.stats.rotates) {
    return "rotate";
  }
  if (current.stats.moves > previous.stats.moves) {
    return "move";
  }
  return null;
}

export function getToneProfiles(event: GameAudioEvent): ToneProfile[] {
  switch (event) {
    case "move":
      return [
        {
          delay: 0,
          duration: 0.05,
          frequency: 240,
          gain: 0.05,
          type: "square",
        },
      ];
    case "rotate":
      return [
        {
          delay: 0,
          duration: 0.07,
          frequency: 480,
          gain: 0.07,
          type: "triangle",
        },
      ];
    case "lock":
      return [
        { delay: 0, duration: 0.1, frequency: 150, gain: 0.1, type: "square" },
      ];
    case "drop":
      return [
        {
          delay: 0,
          duration: 0.08,
          frequency: 95,
          gain: 0.12,
          type: "sawtooth",
        },
      ];
    case "hold":
      return [
        {
          delay: 0,
          duration: 0.08,
          frequency: 320,
          gain: 0.07,
          type: "triangle",
        },
      ];
    case "clear":
      return arpeggio([523, 784], "triangle", 0.08);
    case "tetris":
      return arpeggio([523, 659, 784, 1_046], "triangle", 0.08);
    case "level":
      return arpeggio([392, 523, 659], "sine", 0.07);
    case "start":
      return [
        { delay: 0, duration: 0.12, frequency: 440, gain: 0.07, type: "sine" },
      ];
    case "pause":
      return [
        { delay: 0, duration: 0.08, frequency: 260, gain: 0.07, type: "sine" },
      ];
    case "loss":
      return [
        {
          delay: 0,
          duration: 0.18,
          frequency: 220,
          gain: 0.1,
          type: "sawtooth",
        },
        {
          delay: 0.14,
          duration: 0.24,
          frequency: 110,
          gain: 0.11,
          type: "sawtooth",
        },
      ];
  }
}

function arpeggio(
  frequencies: readonly number[],
  type: OscillatorType,
  gain: number,
): ToneProfile[] {
  return frequencies.map((frequency, index): ToneProfile => ({
    delay: index * 0.06,
    duration: 0.09,
    frequency,
    gain,
    type,
  }));
}
