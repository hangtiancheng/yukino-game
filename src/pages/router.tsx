import { createBrowserRouter, RouterProvider } from "react-router";
import type { ReactElement } from "react";
import type { RouteObject } from "react-router";

import { RouteErrorElement } from "./route-error-element";

async function loadHomeRoute(): Promise<{
  Component: typeof import("./home-page").HomePage;
}> {
  const module = await import("./home-page");
  return { Component: module.HomePage };
}

async function loadFullscreenRoute(): Promise<{
  Component: typeof import("./fullscreen-page").FullscreenPage;
}> {
  const module = await import("./fullscreen-page");
  return { Component: module.FullscreenPage };
}

async function loadNotFoundRoute(): Promise<{
  Component: typeof import("./not-found-page").NotFoundPage;
}> {
  const module = await import("./not-found-page");
  return { Component: module.NotFoundPage };
}

const routes: RouteObject[] = [
  {
    HydrateFallback: RouteFallback,
    errorElement: <RouteErrorElement />,
    path: "/",
    lazy: loadHomeRoute,
  },
  {
    HydrateFallback: RouteFallback,
    errorElement: <RouteErrorElement />,
    path: "/fullscreen",
    lazy: loadFullscreenRoute,
  },
  {
    HydrateFallback: RouteFallback,
    errorElement: <RouteErrorElement />,
    path: "*",
    lazy: loadNotFoundRoute,
  },
];

const router = createBrowserRouter(routes, {
  basename: import.meta.env.BASE_URL,
});

export function AppRouter(): ReactElement {
  return <RouterProvider router={router} />;
}

function RouteFallback(): ReactElement {
  return (
    <div className="bg-paper text-ink-soft grid min-h-screen place-items-center text-sm font-medium">
      Loading route
    </div>
  );
}
