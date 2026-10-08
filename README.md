# Yukino Game

A guideline-style falling-block game. Stack tetrominoes, chase TETRIS lines and back-to-back bonuses, and defend a score-, line-, and level-weighted high score on the local leaderboard across four difficulty tiers, from Low to Hell.

**Play it live:** <https://hangtiancheng.github.io/yukino-game/>

---

## Features

- **Guideline mechanics** — SRS rotation with full wall/floor kick tables, the 7-bag randomizer (seeded and deterministic per run), hold with swap, a five-piece next queue, and ghost piece projection.
- **Modern game feel** — DAS/ARR auto-shift, soft drop at 20x gravity, hard drop, 500 ms lock delay with capped move resets, and the classic gravity curve `(0.8 - (level - 1) * 0.007)^(level - 1)` seconds per row.
- **Guideline scoring** — Single/Double/Triple/TETRIS awards scaled by level, back-to-back TETRIS bonus, combo bonus, soft/hard drop points, and a difficulty multiplier on line awards.
- **Dual renderers, one visual language** — switch at runtime between a DOM renderer (Tailwind-styled divs) and a PixiJS WebGL renderer. Both consume a shared palette and a shared cell-layout description, so they are pixel-consistent.
- **Four difficulty tiers** — start level and score multiplier scale from Low (Lv1, x1) to Hell (Lv10, x3).
- **Audio** — sound effects are synthesized at runtime into WAV data URIs and played through Howler.js; a looping background track starts on the first user gesture and respects the global mute toggle.
- **Installable PWA** — offline-capable via a Workbox service worker; the app shell is precached and the background music is cached on first playback.
- **Local leaderboard** — scores, lines, level, difficulty, and player name persist in `localStorage`, validated with Zod on every read.

## Controls

| Action     | Keys                   |
| ---------- | ---------------------- |
| Move       | `←` / `→` or `A` / `D` |
| Soft drop  | `↓` or `S`             |
| Hard drop  | `Space`                |
| Rotate CW  | `↑`, `W`, or `X`       |
| Rotate CCW | `Z`                    |
| Hold       | `C` or `Shift`         |
| Pause      | `P` or `Esc`           |
| Restart    | `R`                    |

Touch controls appear automatically on small screens. A distraction-free fullscreen mode is available at `/fullscreen`.

## Scoring

| Clear        | Base × level × tier multiplier         |
| ------------ | -------------------------------------- |
| Single       | 100                                    |
| Double       | 300                                    |
| Triple       | 500                                    |
| Tetris       | 800                                    |
| Back-to-back | ×1.5 on chained Tetrises               |
| Combo        | +50 × (combo − 1) × level × multiplier |
| Soft drop    | +1 per cell                            |
| Hard drop    | +2 per cell                            |

Level rises every 10 cleared lines; gravity follows the guideline curve `(0.8 − (level − 1) × 0.007)^(level − 1)` seconds per row.

---

## Tech Stack

| Layer          | Technology               | Version  | Role                                                              |
| -------------- | ------------------------ | -------- | ----------------------------------------------------------------- |
| Framework      | React                    | 19.3     | UI rendering, component tree                                      |
| Language       | TypeScript               | 6.0      | Strict static typing (`noUncheckedIndexedAccess` enabled)         |
| Build          | Vite                     | 8.3      | Dev server, HMR, bundling                                         |
| Styling        | Tailwind CSS             | 4.3      | Utility-first CSS                                                 |
| State          | Jotai                    | 2.20     | Atom-based state (difficulty, leaderboard, player name, renderer) |
| Graphics (alt) | PixiJS                   | 8.21     | Optional WebGL renderer, lazy-loaded                              |
| Animation      | GSAP                     | 3.15     | Score counter tween                                               |
| Audio          | Howler.js                | 2.2      | Synthesized sound effects and looping background music            |
| PWA            | vite-plugin-pwa          | 1.3      | Service worker, web app manifest, offline support                 |
| Validation     | Zod                      | 4.6      | Runtime schema checks (leaderboard, storage, env)                 |
| Routing        | React Router             | 7.18     | SPA routing: home, fullscreen, 404                                |
| Error Tracking | Sentry                   | 10.75    | Exception capture in production                                   |
| Testing        | Vitest + Testing Library | 4.1      | Unit and integration tests                                        |
| E2E            | Playwright               | 1.63     | Browser-level end-to-end tests                                    |
| Component Dev  | Storybook                | 10.6     | Isolated component development                                    |
| Linting        | ESLint + Prettier        | 10 / 3.9 | Code quality, formatting                                          |

---

## Architecture

```
src/
  assets/            Background music track
  components/        UI components (game stage, HUD, selectors, overlays)
    renderers/       DOM and PixiJS renderers (switchable at runtime)
  constants/         Well geometry, input/scoring tuning, tetromino + SRS kick
                     tables, difficulty presets, shared palette
  hooks/             React hooks (game loop, simulation, session, keyboard, audio)
  pages/             Route-level pages (home, fullscreen, 404)
  routes/            Layout wrapper
  schema/            Zod schemas
  services/          Sentry, Howler sound bank, BGM, WAV synthesis
  stores/            Jotai atoms with localStorage persistence
  types/             TypeScript type definitions
  utils/             Pure game logic (board, tetromino rotation/kicks, bag RNG,
                     gravity, scoring, lock delay, the state-machine reducer)
```

The simulation lives outside the React render cycle: `useGameSimulation` holds an immutable `GameState` in a ref and advances it with a fixed-timestep `requestAnimationFrame` loop. Each tick produces a new state, published to subscribers through `useSyncExternalStore` — the DOM renderer consumes it declaratively, while the Pixi renderer redraws imperatively from the same snapshot. Both renderers draw the same `collectRenderCells` scene description, which maps the board, active piece, ghost, hold, and next queue into absolutely positioned cells.

All gameplay rules (collision, SRS kicks, bag randomizer, gravity, lock delay, line clears, scoring) are pure functions in `src/utils`, seeded and deterministic, which keeps them unit-testable without a browser.

---

## Development

```sh
pnpm install
pnpm dev          # Start dev server
pnpm test         # Run unit tests
pnpm e2e          # Run Playwright e2e tests (requires pnpm build first)
pnpm storybook    # Component explorer
pnpm typecheck    # TypeScript project check
pnpm lint         # ESLint
pnpm build        # Production build
```

End-to-end tests run against the production build served by `vite preview` under the `/yukino-game/` base path, mirroring the deployed environment.

## Deployment

Every push to `main` (or a manual workflow dispatch) runs unit tests, builds with the `/yukino-game/` base, and publishes to GitHub Pages via `.github/workflows/deploy.yml`. A `404.html` copy of the app shell provides the SPA fallback for deep links.
