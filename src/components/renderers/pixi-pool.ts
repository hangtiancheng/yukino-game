import { Container, Graphics } from "pixi.js";

export interface GraphicsPool<T> {
  destroy: () => void;
  sync: (
    items: T[],
    getKey: (item: T) => string,
    draw: (graphic: Graphics, item: T) => void,
  ) => void;
}

export function createGraphicsPool<T>(parent: Container): GraphicsPool<T> {
  const graphicsByKey = new Map<string, Graphics>();

  return {
    destroy(): void {
      for (const graphic of graphicsByKey.values()) {
        graphic.destroy();
      }
      graphicsByKey.clear();
    },
    sync(items, getKey, draw): void {
      const activeKeys = new Set<string>();
      for (const item of items) {
        const key = getKey(item);
        activeKeys.add(key);
        const graphic = getGraphic(parent, graphicsByKey, key);
        draw(graphic, item);
      }
      removeInactiveGraphics(parent, graphicsByKey, activeKeys);
    },
  };
}

function getGraphic(
  parent: Container,
  graphicsByKey: Map<string, Graphics>,
  key: string,
): Graphics {
  const existingGraphic = graphicsByKey.get(key);
  if (existingGraphic !== undefined) {
    return existingGraphic;
  }
  const graphic = new Graphics();
  graphicsByKey.set(key, graphic);
  parent.addChild(graphic);
  return graphic;
}

function removeInactiveGraphics(
  parent: Container,
  graphicsByKey: Map<string, Graphics>,
  activeKeys: Set<string>,
): void {
  for (const [key, graphic] of graphicsByKey) {
    if (!activeKeys.has(key)) {
      graphicsByKey.delete(key);
      parent.removeChild(graphic);
      graphic.destroy();
    }
  }
}
