import clsx from "clsx";
import type { ReactElement, ReactNode } from "react";

import { usePageIntro } from "@/hooks";

export type GameLayoutPresentation = "fullscreen" | "standard";

interface GameLayoutProps {
  children: ReactNode;
  presentation: GameLayoutPresentation;
}

export function GameLayout({
  children,
  presentation,
}: GameLayoutProps): ReactElement {
  const pageRef = usePageIntro();
  return (
    <div ref={pageRef}>
      <main className={getMainClass(presentation)}>
        <div className="mx-auto flex max-w-6xl flex-col gap-5">{children}</div>
      </main>
    </div>
  );
}

function getMainClass(presentation: GameLayoutPresentation): string {
  return clsx(
    "min-h-screen overflow-hidden bg-paper text-ink",
    presentation === "fullscreen" ? "px-3 py-4 sm:px-6" : "px-4 py-6 sm:px-8",
  );
}
