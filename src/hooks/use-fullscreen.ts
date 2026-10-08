import { useEffect, useState } from "react";

export interface FullscreenControlsState {
  active: boolean;
  supported: boolean;
  toggleFullscreen: () => void;
}

export function useFullscreen(): FullscreenControlsState {
  const [active, setActive] = useState<boolean>(
    document.fullscreenElement !== null,
  );
  const supported = document.fullscreenEnabled;

  function toggleFullscreen(): void {
    if (!supported) {
      return;
    }
    if (document.fullscreenElement === null) {
      document.documentElement.requestFullscreen().catch((): void => undefined);
    } else {
      document.exitFullscreen().catch((): void => undefined);
    }
  }

  useEffect((): (() => void) => {
    function handleFullscreenChange(): void {
      setActive(document.fullscreenElement !== null);
    }

    document.addEventListener("fullscreenchange", handleFullscreenChange);
    return (): void =>
      document.removeEventListener("fullscreenchange", handleFullscreenChange);
  }, []);

  return { active, supported, toggleFullscreen };
}
