import type { ReactElement } from "react";

import { GameShell } from "@/components";
import { GameLayout } from "@/routes";

export function HomePage(): ReactElement {
  return (
    <GameLayout presentation="standard">
      <GameShell />
    </GameLayout>
  );
}
