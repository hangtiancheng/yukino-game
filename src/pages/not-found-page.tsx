import { Link } from "react-router";
import type { ReactElement } from "react";

export function NotFoundPage(): ReactElement {
  return (
    <main className="bg-paper grid min-h-screen place-items-center px-6">
      <section className="border-line bg-card w-full max-w-md rounded-2xl border p-8 shadow-[0_24px_60px_-36px_rgba(32,30,26,0.4)]">
        <p className="text-ink-soft text-sm font-medium">Route missing</p>
        <h1 className="font-display text-ink mt-2 text-6xl leading-none">
          404
        </h1>
        <p className="text-ink-soft mt-3 text-sm">
          This page is not part of the game.
        </p>
        <Link
          className="bg-clay-deep hover:bg-clay focus-visible:ring-clay focus-visible:ring-offset-card mt-6 inline-flex rounded-md px-5 py-2.5 text-sm font-semibold text-[#fdf9f2] transition-colors focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:outline-none"
          to="/"
        >
          Return home
        </Link>
      </section>
    </main>
  );
}
