import { Howl } from "howler";

import bgmUrl from "@/assets/bgm.mp3";

let bgm: Howl | null = null;

export function playBgm(): void {
  if (bgm === null) {
    // autoplay covers the initial load; guarding on state() prevents
    // queueing a second loop when unlock fires twice while still loading.
    bgm = new Howl({
      src: [bgmUrl],
      loop: true,
      volume: 0.35,
      html5: true,
      autoplay: true,
      // A failed load would otherwise leave bgm stuck in a permanent
      // non-loaded state with no way to retry.
      onloaderror: (): void => {
        bgm?.unload();
        bgm = null;
      },
    });
    return;
  }
  if (bgm.state() === "loaded" && !bgm.playing()) {
    bgm.play();
  }
}
