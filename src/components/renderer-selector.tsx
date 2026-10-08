import clsx from "clsx";
import type { ReactElement } from "react";

import type { GameRendererKind } from "@/types";

interface RendererOption {
  label: string;
  value: GameRendererKind;
}

interface RendererSelectorProps {
  selectedRenderer: GameRendererKind;
  onChange: (rendererKind: GameRendererKind) => void;
}

const rendererOptions: RendererOption[] = [
  { label: "DOM", value: "dom" },
  { label: "Pixi", value: "pixi" },
];

export function RendererSelector({
  selectedRenderer,
  onChange,
}: RendererSelectorProps): ReactElement {
  return (
    <div className="border-line bg-card rounded-xl border p-4">
      <p className="text-ink text-sm font-medium">Renderer</p>
      <div className="mt-3 flex gap-2">
        {rendererOptions.map((option: RendererOption): ReactElement => (
          <button
            className={clsx(
              "rounded-md border px-3 py-2 text-sm font-semibold transition-colors",
              option.value === selectedRenderer
                ? "border-clay bg-clay/10 text-ink"
                : "border-line bg-paper text-ink hover:border-clay/60",
            )}
            key={option.value}
            onClick={(): void => onChange(option.value)}
            type="button"
          >
            {option.label}
          </button>
        ))}
      </div>
    </div>
  );
}
