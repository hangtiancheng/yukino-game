import clsx from "clsx";
import { memo, useMemo } from "react";
import type { CSSProperties, ReactElement } from "react";

import {
  BOARD_HEIGHT,
  BOARD_ORIGIN_X,
  BOARD_ORIGIN_Y,
  BOARD_WIDTH,
  CELL_SIZE,
  HOLD_BOX,
  HOLD_LABEL_POSITION,
  NEXT_BOX,
  NEXT_BOX_STEP,
  NEXT_LABEL_POSITION,
  NEXT_QUEUE_SIZE,
  cssColor,
  tetrisTheme,
} from "@/constants";
import type { StageBox, StagePoint } from "@/constants";
import type { GameRendererProps } from "@/types";
import { collectRenderCells } from "@/utils";
import type { RenderCell } from "@/utils";

const MemoBoardCell = memo(BoardCell);
const MemoStageFrame = memo(StageFrame);

export function DomGameRenderer({
  reducedMotion,
  state,
}: GameRendererProps): ReactElement {
  const cells = useMemo((): RenderCell[] => collectRenderCells(state), [state]);

  return (
    <>
      <MemoStageFrame />
      {cells.map((cell: RenderCell): ReactElement => (
        <MemoBoardCell
          cell={cell}
          key={cell.key}
          reducedMotion={reducedMotion}
        />
      ))}
    </>
  );
}

interface BoardCellProps {
  cell: RenderCell;
  reducedMotion: boolean;
}

function BoardCell({ cell, reducedMotion }: BoardCellProps): ReactElement {
  const color = cssColor(tetrisTheme.cells[cell.type]);
  const geometry: CSSProperties = {
    height: cell.size,
    left: cell.x,
    top: cell.y,
    width: cell.size,
  };
  if (cell.kind === "ghost") {
    return (
      <div
        className="absolute rounded-[3px]"
        style={{
          ...geometry,
          backgroundColor: color,
          border: `2px solid ${color}`,
          opacity: tetrisTheme.ghostAlpha,
        }}
      />
    );
  }
  return (
    <div
      className={clsx(
        "absolute rounded-[3px]",
        !reducedMotion && "transition-opacity duration-150",
      )}
      style={{
        ...geometry,
        backgroundColor: color,
        border: `1px solid ${cssColor(tetrisTheme.cellStroke)}`,
        opacity: cell.dimmed ? 0.45 : 1,
      }}
    />
  );
}

function StageFrame(): ReactElement {
  const gridStyle: CSSProperties = {
    backgroundImage: `linear-gradient(to right, ${cssColor(tetrisTheme.gridLine)} 1px, transparent 1px), linear-gradient(to bottom, ${cssColor(tetrisTheme.gridLine)} 1px, transparent 1px)`,
    backgroundSize: `${CELL_SIZE}px ${CELL_SIZE}px`,
    height: BOARD_HEIGHT,
    left: BOARD_ORIGIN_X,
    top: BOARD_ORIGIN_Y,
    width: BOARD_WIDTH,
  };
  const backingStyle: CSSProperties = {
    backgroundColor: cssColor(tetrisTheme.boardBackground),
    border: `1px solid ${cssColor(tetrisTheme.boardStroke)}`,
    boxShadow: "0 16px 36px -20px rgba(32, 30, 26, 0.5)",
    height: BOARD_HEIGHT + 20,
    left: BOARD_ORIGIN_X - 10,
    top: BOARD_ORIGIN_Y - 10,
    width: BOARD_WIDTH + 20,
  };
  return (
    <>
      <div className="absolute rounded-[14px]" style={backingStyle} />
      <div className="absolute" style={gridStyle} />
      <PanelGroup
        box={HOLD_BOX}
        count={1}
        label="Hold"
        labelPosition={HOLD_LABEL_POSITION}
      />
      <PanelGroup
        box={NEXT_BOX}
        count={NEXT_QUEUE_SIZE}
        label="Next"
        labelPosition={NEXT_LABEL_POSITION}
      />
    </>
  );
}

interface PanelGroupProps {
  box: StageBox;
  count: number;
  label: string;
  labelPosition: StagePoint;
}

function PanelGroup({
  box,
  count,
  label,
  labelPosition,
}: PanelGroupProps): ReactElement {
  const boxStyle: CSSProperties = {
    backgroundColor: cssColor(tetrisTheme.cardBackground),
    border: `1px solid ${cssColor(tetrisTheme.panelStroke)}`,
  };
  return (
    <>
      <p
        className="absolute text-xs font-semibold"
        style={{
          color: cssColor(tetrisTheme.labelText),
          left: labelPosition.x,
          top: labelPosition.y,
        }}
      >
        {label}
      </p>
      {Array.from({ length: count }, (_unused, index): ReactElement => (
        <div
          className="absolute rounded-[10px]"
          key={index}
          style={{
            ...boxStyle,
            height: box.height,
            left: box.x,
            top: box.y + index * NEXT_BOX_STEP,
            width: box.width,
          }}
        />
      ))}
    </>
  );
}
