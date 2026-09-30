import { useAtom, useAtomValue } from "jotai";
import { useCallback, useState } from "react";
import type { ReactElement } from "react";

import { useGameSession } from "@/hooks";
import type { Difficulty } from "@/schema";
import { difficultyAtom, leaderboardAtom, rendererKindAtom } from "@/stores";
import { DifficultySelector } from "./difficulty-selector";
import { FullscreenControls } from "./fullscreen-controls";
import { GameHeader } from "./game-header";
import { GameStage } from "./game-stage";
import { GameStatsHud } from "./game-stats-hud";
import { LeaderboardPanel } from "./leaderboard-panel";
import { PlayerNameField } from "./player-name-field";
import { RendererSelector } from "./renderer-selector";
import { ScoringCard } from "./scoring-card";
import { TouchControls } from "./touch-controls";

export function GameShell(): ReactElement {
  const [difficulty, setDifficulty] = useAtom(difficultyAtom);
  const [rendererKind, setRendererKind] = useAtom(rendererKindAtom);
  const leaderboard = useAtomValue(leaderboardAtom);
  const { audio, gameState, keyboard, restartGame, simulation } =
    useGameSession(difficulty);
  const [settingsOpen, setSettingsOpen] = useState(false);

  const selectDifficulty = useCallback(
    (nextDifficulty: Difficulty): void => {
      setDifficulty(nextDifficulty);
      simulation.reset(nextDifficulty);
    },
    [setDifficulty, simulation],
  );

  return (
    <>
      <GameHeader audio={audio} />
      <GameStatsHud simulation={simulation} />
      <GameStage
        input={keyboard}
        onRestart={restartGame}
        rendererKind={rendererKind}
        simulation={simulation}
      />
      <div className="flex flex-wrap items-center gap-3">
        <FullscreenControls />
        <button
          className="border-line bg-card text-ink hover:border-clay hover:text-clay-deep rounded-md border px-4 py-2 text-sm font-semibold transition-colors"
          onClick={(): void => setSettingsOpen((o) => !o)}
          type="button"
        >
          {settingsOpen ? "Hide settings" : "Settings"}
        </button>
      </div>
      <div className="grid items-start gap-5 md:grid-cols-2">
        <LeaderboardPanel entries={leaderboard} />
        {settingsOpen ? (
          <div className="grid gap-4">
            <DifficultySelector
              difficulty={difficulty}
              onChange={selectDifficulty}
            />
            <RendererSelector
              onChange={setRendererKind}
              selectedRenderer={rendererKind}
            />
            <PlayerNameField />
          </div>
        ) : (
          <ScoringCard />
        )}
      </div>
      <TouchControls
        inputRef={keyboard.inputRef}
        onRestart={restartGame}
        visible={gameState.phase === "running"}
      />
    </>
  );
}
