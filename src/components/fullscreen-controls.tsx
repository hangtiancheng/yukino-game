import { Link } from "react-router";
import type { ReactElement } from "react";

export function FullscreenControls(): ReactElement {
  return (
    <Link
      className="bg-clay-deep hover:bg-clay focus-visible:ring-clay focus-visible:ring-offset-paper rounded-md px-4 py-2 text-sm font-semibold text-[#fdf9f2] transition-colors focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:outline-none"
      to="/fullscreen"
    >
      Open fullscreen
    </Link>
  );
}
