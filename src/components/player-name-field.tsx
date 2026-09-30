import { useAtom } from "jotai";
import type { ChangeEvent, ReactElement } from "react";

import { playerNameSchema } from "@/schema";
import { playerNameAtom } from "@/stores";

export function PlayerNameField(): ReactElement {
  const [playerName, setPlayerName] = useAtom(playerNameAtom);

  function handleChange(event: ChangeEvent<HTMLInputElement>): void {
    const result = playerNameSchema.safeParse(event.target.value);
    if (result.success) {
      setPlayerName(result.data);
    }
  }

  return (
    <label className="border-line bg-card block rounded-xl border p-4">
      <span className="text-ink text-sm font-medium">Player name</span>
      <input
        aria-describedby="player-name-help"
        className="border-line bg-paper text-ink focus:border-clay focus:ring-clay mt-2 w-full rounded-md border px-3 py-2 text-sm focus:ring-1 focus:outline-none"
        maxLength={16}
        onChange={handleChange}
        type="text"
        value={playerName}
      />
      <span className="text-ink-soft mt-2 block text-xs" id="player-name-help">
        1-16 letters, numbers, spaces, dashes, or underscores.
      </span>
    </label>
  );
}
