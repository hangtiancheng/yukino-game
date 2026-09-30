import type { ReactElement } from "react";

const scoringRows: readonly (readonly [string, string])[] = [
  ["Single", "100 × level"],
  ["Double", "300 × level"],
  ["Triple", "500 × level"],
  ["TETRIS", "800 × level"],
  ["Back-to-back TETRIS", "×1.5"],
  ["Combo", "50 × streak × level"],
  ["Soft drop", "1 per cell"],
  ["Hard drop", "2 per cell"],
];

export function ScoringCard(): ReactElement {
  return (
    <section className="border-line bg-card rounded-xl border p-5">
      <h2 className="font-display text-ink text-lg">Scoring</h2>
      <p className="text-ink-soft mt-1 text-xs">
        Difficulty multiplies every line award. Level rises every 10 lines.
      </p>
      <table className="mt-3 w-full text-sm">
        <tbody>
          {scoringRows.map(([name, value]): ReactElement => (
            <tr className="border-line/70 border-b last:border-0" key={name}>
              <th
                className="text-ink py-1.5 pr-4 text-left font-medium"
                scope="row"
              >
                {name}
              </th>
              <td className="text-ink-soft py-1.5 text-right tabular-nums">
                {value}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </section>
  );
}
