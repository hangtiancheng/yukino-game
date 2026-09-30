import { Container, Graphics, Text } from "pixi.js";

import {
  HOLD_LABEL_POSITION,
  NEXT_LABEL_POSITION,
  tetrisTheme,
} from "@/constants";
import type { StagePoint } from "@/constants";
import type { GameState } from "@/types";
import { collectRenderCells, getRenderCellKey } from "@/utils";
import type { RenderCell } from "@/utils";
import { drawRenderCell, drawStageFrame } from "./pixi-draw";
import { createGraphicsPool } from "./pixi-pool";
import type { GraphicsPool } from "./pixi-pool";

interface PixiSceneState {
  cellPool: GraphicsPool<RenderCell>;
}

const pixiSceneStates = new WeakMap<Container, PixiSceneState>();

export function renderPixiScene(scene: Container, state: GameState): void {
  const sceneState = getPixiSceneState(scene);
  sceneState.cellPool.sync(
    collectRenderCells(state),
    getRenderCellKey,
    drawRenderCell,
  );
}

export function destroyPixiScene(scene: Container): void {
  const sceneState = pixiSceneStates.get(scene);
  if (sceneState === undefined) {
    return;
  }
  sceneState.cellPool.destroy();
  pixiSceneStates.delete(scene);
}

function getPixiSceneState(scene: Container): PixiSceneState {
  const existingState = pixiSceneStates.get(scene);
  if (existingState !== undefined) {
    return existingState;
  }
  const world = new Container();
  const frame = new Graphics();
  drawStageFrame(frame);
  world.addChild(
    frame,
    createPanelLabel("Hold", HOLD_LABEL_POSITION),
    createPanelLabel("Next", NEXT_LABEL_POSITION),
  );
  scene.addChild(world);
  const sceneState: PixiSceneState = { cellPool: createGraphicsPool(world) };
  pixiSceneStates.set(scene, sceneState);
  return sceneState;
}

function createPanelLabel(text: string, position: StagePoint): Text {
  const label = new Text({
    style: {
      fill: tetrisTheme.labelText,
      fontFamily:
        '"Avenir Next", "Segoe UI", system-ui, -apple-system, "Helvetica Neue", Arial, sans-serif',
      fontSize: 12,
      fontWeight: "600",
      letterSpacing: 0.3,
    },
    text,
  });
  label.position.set(position.x, position.y);
  return label;
}
