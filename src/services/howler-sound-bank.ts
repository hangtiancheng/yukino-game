import { Howl, Howler } from "howler";

import { getToneProfiles } from "@/utils";
import type { GameAudioEvent } from "@/utils";
import { createWavDataUri } from "./wav-synthesis";

const gameAudioEvents: GameAudioEvent[] = [
  "clear",
  "drop",
  "hold",
  "level",
  "lock",
  "loss",
  "move",
  "pause",
  "rotate",
  "start",
  "tetris",
];

const soundCache = new Map<GameAudioEvent, string>();

export interface HowlerSoundBank {
  play: (event: GameAudioEvent) => void;
  setEnabled: (enabled: boolean) => void;
  unload: () => void;
  unlock: () => void;
}

export function prepareHowlerSoundBank(): void {
  scheduleIdleTask((): void => {
    for (const event of gameAudioEvents) {
      getSoundSource(event);
    }
  });
}

export function createHowlerSoundBank(): HowlerSoundBank {
  const sounds = new Map<GameAudioEvent, Howl>();

  return {
    play(event: GameAudioEvent): void {
      getSound(sounds, event).play();
    },
    setEnabled(enabled: boolean): void {
      Howler.mute(!enabled);
    },
    unload(): void {
      for (const sound of sounds.values()) {
        sound.unload();
      }
      sounds.clear();
    },
    unlock(): void {
      Howler.mute(false);
    },
  };
}

function getSound(
  sounds: Map<GameAudioEvent, Howl>,
  event: GameAudioEvent,
): Howl {
  const existingSound = sounds.get(event);
  if (existingSound !== undefined) {
    return existingSound;
  }

  const sound = new Howl({ src: [getSoundSource(event)], volume: 1 });
  sounds.set(event, sound);
  return sound;
}

function getSoundSource(event: GameAudioEvent): string {
  const cachedSource = soundCache.get(event);
  if (cachedSource !== undefined) {
    return cachedSource;
  }

  const source = createWavDataUri(getToneProfiles(event));
  soundCache.set(event, source);
  return source;
}

function scheduleIdleTask(task: () => void): void {
  if (typeof window.requestIdleCallback === "function") {
    window.requestIdleCallback(task);
    return;
  }
  window.setTimeout(task, 0);
}
