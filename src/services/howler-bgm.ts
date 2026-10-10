import { Howl } from "howler";

import bgmUrl from "@/assets/bgm.mp3";

let bgm: Howl | null = null;

export function playBgm(): void {
  if (bgm === null) {
    bgm = new Howl({
      src: [bgmUrl],
      loop: true,
      volume: 0.35,
      html5: true,
      autoplay: true,
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
