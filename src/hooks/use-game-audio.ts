import { useCallback, useEffect, useRef, useState } from "react";
import type { RefObject } from "react";

import {
  createHowlerSoundBank,
  playBgm,
  prepareHowlerSoundBank,
} from "@/services";
import type { HowlerSoundBank } from "@/services";
import type { GameState } from "@/types";
import { getAudioEvent } from "@/utils";
import type { GameAudioEvent } from "@/utils";
import type { GameSimulation } from "./use-game-simulation";

export interface GameAudioControls {
  enabled: boolean;
  statusLabel: string;
  toggleEnabled: () => void;
}

export function useGameAudio(simulation: GameSimulation): GameAudioControls {
  const [enabled, setEnabled] = useState<boolean>(true);
  const [unlocked, setUnlocked] = useState<boolean>(false);
  const enabledRef = useRef<boolean>(enabled);
  const previousStateRef = useRef<GameState>(simulation.getSnapshot());
  const soundBankRef = useRef<HowlerSoundBank | null>(null);

  useEffect((): void => {
    enabledRef.current = enabled;
  }, [enabled]);

  const unlockAudio = useCallback((): void => {
    const soundBank = getSoundBank(soundBankRef);
    soundBank.unlock();
    soundBank.setEnabled(enabledRef.current);
    playBgm();
    setUnlocked(true);
  }, []);

  useEffect((): (() => void) => {
    prepareHowlerSoundBank();
    return (): void => {
      soundBankRef.current?.unload();
      soundBankRef.current = null;
    };
  }, []);

  const toggleEnabled = useCallback((): void => {
    setEnabled((current: boolean): boolean => {
      const nextEnabled = !current;
      getSoundBank(soundBankRef).setEnabled(nextEnabled);
      return nextEnabled;
    });
    setUnlocked(true);
  }, []);

  useEffect((): (() => void) => {
    window.addEventListener("keydown", unlockAudio, { once: true });
    window.addEventListener("pointerdown", unlockAudio, { once: true });
    return (): void => {
      window.removeEventListener("keydown", unlockAudio);
      window.removeEventListener("pointerdown", unlockAudio);
    };
  }, [unlockAudio]);

  useEffect((): (() => void) => {
    function handleStateChange(): void {
      const previousState = previousStateRef.current;
      const nextState = simulation.getSnapshot();
      previousStateRef.current = nextState;
      playAudioEvent(
        soundBankRef,
        enabledRef.current,
        previousState,
        nextState,
      );
    }
    return simulation.subscribe(handleStateChange);
  }, [simulation]);

  const statusLabel = enabled ? getEnabledLabel(unlocked) : "Sound: Off";
  return { enabled, statusLabel, toggleEnabled };
}

function getSoundBank(
  soundBankRef: RefObject<HowlerSoundBank | null>,
): HowlerSoundBank {
  if (soundBankRef.current === null) {
    soundBankRef.current = createHowlerSoundBank();
  }
  return soundBankRef.current;
}

function playAudioEvent(
  soundBankRef: RefObject<HowlerSoundBank | null>,
  enabled: boolean,
  previousState: GameState,
  nextState: GameState,
): void {
  const event: GameAudioEvent | null = getAudioEvent(previousState, nextState);
  if (enabled && event !== null) {
    getSoundBank(soundBankRef).play(event);
  }
}

function getEnabledLabel(unlocked: boolean): string {
  return unlocked ? "Sound: On" : "Sound: Press any key";
}
