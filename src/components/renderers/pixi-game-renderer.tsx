import { Application, Container } from "pixi.js";
import { useEffect, useRef, useState } from "react";
import type { ReactElement } from "react";

import { VIEWPORT_HEIGHT, VIEWPORT_WIDTH } from "@/constants";
import type { PixiGameRendererProps } from "@/types";
import { destroyPixiScene, renderPixiScene } from "./pixi-scene";

export function PixiGameRenderer({
  simulation,
}: PixiGameRendererProps): ReactElement {
  const [hostElement, setHostElement] = useState<HTMLDivElement | null>(null);
  const sceneRef = useRef<Container | null>(null);

  useEffect((): (() => void) | undefined => {
    if (hostElement === null) {
      return undefined;
    }

    let cancelled = false;
    const app = new Application();
    const scene = new Container();
    sceneRef.current = scene;

    const paint = (): void => {
      renderPixiScene(scene, simulation.stateRef.current);
    };

    let unsubscribe: (() => void) | null = null;

    app
      .init({
        antialias: true,
        autoDensity: true,
        backgroundAlpha: 0,
        height: VIEWPORT_HEIGHT,
        resolution: Math.min(window.devicePixelRatio, 2),
        width: VIEWPORT_WIDTH,
      })
      .then((): void => {
        if (cancelled) {
          app.destroy({ removeView: true }, { children: true });
          return;
        }
        app.stage.addChild(scene);
        hostElement.appendChild(app.canvas);
        paint();
        unsubscribe = simulation.subscribe(paint);
      })
      .catch((): void => {
        sceneRef.current = null;
      });

    return (): void => {
      cancelled = true;
      if (unsubscribe !== null) {
        unsubscribe();
      }
      destroyPixiScene(scene);
      sceneRef.current = null;
      app.destroy({ removeView: true }, { children: true });
    };
  }, [hostElement, simulation]);

  return (
    <div
      className="absolute inset-0 [&>canvas]:h-full [&>canvas]:w-full"
      ref={setHostElement}
    />
  );
}
