import type { ReactElement } from "react";

import type { LeaderboardEntry } from "@/schema";

interface LeaderboardPanelProps {
  entries: LeaderboardEntry[];
}

export function LeaderboardPanel({
  entries,
}: LeaderboardPanelProps): ReactElement {
  return (
    <section className="border-line bg-card rounded-xl border p-5">
      <h2 className="font-display text-ink text-lg">Top scores</h2>
      {entries.length === 0 ? (
        <p className="text-ink-soft mt-3 text-sm">No runs recorded yet.</p>
      ) : (
        <ol className="mt-3">
          {entries.map(
            (entry: LeaderboardEntry, index: number): ReactElement => (
              <LeaderboardRow entry={entry} index={index} key={entry.id} />
            ),
          )}
        </ol>
      )}
    </section>
  );
}

function LeaderboardRow({
  entry,
  index,
}: {
  entry: LeaderboardEntry;
  index: number;
}): ReactElement {
  return (
    <li className="border-line/70 flex items-center gap-3 border-b py-2 text-sm last:border-0">
      <span className="font-display text-clay-deep w-6 tabular-nums">
        {index + 1}
      </span>
      <span className="text-ink flex-1 truncate font-medium">
        {entry.playerName}
      </span>
      <span className="border-line text-ink-soft rounded-full border px-2 py-0.5 text-xs">
        {entry.difficulty}
      </span>
      <span className="text-ink-soft tabular-nums">
        {entry.score.toLocaleString()} &middot; {entry.lines} lines &middot; Lv
        {entry.level}
      </span>
    </li>
  );
}
