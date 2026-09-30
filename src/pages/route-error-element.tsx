import { useEffect } from "react";
import { Link, useRouteError } from "react-router";
import type { ReactElement } from "react";

import { captureException } from "@/services";

export function RouteErrorElement(): ReactElement {
  const error = useRouteError();

  useEffect((): void => {
    void captureException(error);
  }, [error]);

  return (
    <main className="bg-paper grid min-h-screen place-items-center px-6">
      <section className="border-line bg-card w-full max-w-md rounded-2xl border p-8 shadow-[0_24px_60px_-36px_rgba(32,30,26,0.4)]">
        <p className="text-ink-soft flex items-center gap-2 text-sm font-medium">
          <span
            aria-hidden="true"
            className="h-2.5 w-2.5 rounded-[3px] bg-[#cf6370]"
          />
          Something broke
        </p>
        <h1 className="font-display text-ink mt-2 text-5xl leading-none">
          Crash
        </h1>
        <p className="text-ink-soft mt-3 text-sm leading-relaxed">
          The current route failed to render. The error has been reported.
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
