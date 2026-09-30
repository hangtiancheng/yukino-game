import type { Graphics } from "pixi.js";

import {
  BOARD_COLUMNS,
  BOARD_HEIGHT,
  BOARD_ORIGIN_X,
  BOARD_ORIGIN_Y,
  BOARD_ROWS,
  BOARD_WIDTH,
  CELL_SIZE,
  HOLD_BOX,
  NEXT_BOX,
  NEXT_BOX_STEP,
  NEXT_QUEUE_SIZE,
  tetrisTheme,
} from "@/constants";
import type { StageBox } from "@/constants";
import type { RenderCell } from "@/utils";

const CELL_RADIUS = 3;
const PANEL_RADIUS = 10;

export function drawRenderCell(graphic: Graphics, cell: RenderCell): void {
  const color = tetrisTheme.cells[cell.type];
  const inset = Math.max(1, Math.round(cell.size * 0.06));
  const innerSize = cell.size - inset * 2;
  graphic.clear();
  if (cell.kind === "ghost") {
    graphic
      .roundRect(inset, inset, innerSize, innerSize, CELL_RADIUS)
      .fill({ alpha: tetrisTheme.ghostAlpha, color })
      .stroke({ alignment: 1, color, width: 2 });
    graphic.alpha = 1;
  } else {
    graphic
      .roundRect(inset, inset, innerSize, innerSize, CELL_RADIUS)
      .fill({ color })
      .stroke({ alignment: 1, color: tetrisTheme.cellStroke, width: 1 });
    graphic.alpha = cell.dimmed ? 0.45 : 1;
  }
  graphic.position.set(cell.x, cell.y);
}

// Static well furniture: board backing, grid lines, and the hold/next
// panel boxes. Drawn once per scene; labels are separate Text objects.
export function drawStageFrame(graphic: Graphics): void {
  graphic
    .clear()
    .roundRect(
      BOARD_ORIGIN_X - 10,
      BOARD_ORIGIN_Y - 10,
      BOARD_WIDTH + 20,
      BOARD_HEIGHT + 20,
      14,
    )
    .fill({ color: tetrisTheme.boardBackground })
    .stroke({ alignment: 1, color: tetrisTheme.boardStroke, width: 1.5 });

  for (let col = 1; col < BOARD_COLUMNS; col += 1) {
    const x = BOARD_ORIGIN_X + col * CELL_SIZE;
    graphic.moveTo(x, BOARD_ORIGIN_Y).lineTo(x, BOARD_ORIGIN_Y + BOARD_HEIGHT);
  }
  for (let row = 1; row < BOARD_ROWS; row += 1) {
    const y = BOARD_ORIGIN_Y + row * CELL_SIZE;
    graphic.moveTo(BOARD_ORIGIN_X, y).lineTo(BOARD_ORIGIN_X + BOARD_WIDTH, y);
  }
  graphic.stroke({ alpha: 0.9, color: tetrisTheme.gridLine, width: 1 });

  tracePanelBoxes(graphic, HOLD_BOX, 1);
  tracePanelBoxes(graphic, NEXT_BOX, NEXT_QUEUE_SIZE);
  graphic
    .fill({ color: tetrisTheme.cardBackground })
    .stroke({ alignment: 1, color: tetrisTheme.panelStroke, width: 1.5 });
}

function tracePanelBoxes(
  graphic: Graphics,
  box: StageBox,
  count: number,
): void {
  for (let index = 0; index < count; index += 1) {
    graphic.roundRect(
      box.x,
      box.y + index * NEXT_BOX_STEP,
      box.width,
      box.height,
      PANEL_RADIUS,
    );
  }
}
