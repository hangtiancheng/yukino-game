import { createRoot } from "react-dom/client";
import "./index.css";

import { AppErrorBoundary } from "./components/app-error-boundary";
import { AppRouter } from "./pages";
import { initializeSentry } from "./services";

const rootElement = document.getElementById("root");

if (!(rootElement instanceof HTMLElement)) {
  throw new Error("root element not found.");
}

void initializeSentry();

createRoot(rootElement).render(
  <AppErrorBoundary>
    <AppRouter />
  </AppErrorBoundary>,
);
