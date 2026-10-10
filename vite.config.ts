import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";
import { VitePWA } from "vite-plugin-pwa";

import packageJson from "./package.json" with { type: "json" };
import { resolve } from "path";

const vendorChunkMap: ReadonlyArray<readonly [string, string]> = [
  ["pixi.js", "pixi"],
  ["howler", "howler"],
  ["gsap", "gsap"],
  ["@sentry", "sentry"],
];

const releaseId = `${packageJson.name}@${packageJson.version}`;

export default defineConfig(({ command, isPreview }) => {
  const base = command === "build" || isPreview ? "/yukino-game/" : "/";
  return {
    base,
    build: {
      rollupOptions: {
        output: {
          manualChunks(id: string): string | undefined {
            if (!id.includes("node_modules")) {
              return undefined;
            }
            for (const [match, chunk] of vendorChunkMap) {
              if (id.includes(`/node_modules/${match}`)) {
                return chunk;
              }
            }
            return undefined;
          },
        },
      },
    },
    define: {
      __APP_VERSION__: JSON.stringify(releaseId),
    },
    plugins: [
      react(),
      tailwindcss(),
      VitePWA({
        registerType: "autoUpdate",
        includeAssets: [
          "favicon.svg",
          "favicon.ico",
          "apple-touch-icon-180x180.png",
        ],
        manifest: {
          name: "Yukino Game",
          short_name: "Yukino Game",
          description:
            "An original falling-block prototype with DOM and Pixi renderers.",
          theme_color: "#faf9f5",
          background_color: "#faf9f5",
          display: "standalone",
          orientation: "landscape",
          scope: base,
          start_url: base,
          icons: [
            {
              src: "pwa-64x64.png",
              sizes: "64x64",
              type: "image/png",
            },
            {
              src: "pwa-192x192.png",
              sizes: "192x192",
              type: "image/png",
            },
            {
              src: "pwa-512x512.png",
              sizes: "512x512",
              type: "image/png",
            },
            {
              src: "maskable-icon-512x512.png",
              sizes: "512x512",
              type: "image/png",
              purpose: "maskable",
            },
          ],
        },
        workbox: {
          globPatterns: ["**/*.{js,css,html,svg,png,ico,woff2}"],
          navigateFallback: `${base}index.html`,
          runtimeCaching: [
            {
              urlPattern: /\.mp3$/i,
              handler: "CacheFirst",
              options: {
                cacheName: "bgm-cache",
                expiration: {
                  maxEntries: 4,
                  maxAgeSeconds: 60 * 60 * 24 * 365,
                },
                cacheableResponse: { statuses: [0, 200] },
                rangeRequests: true,
              },
            },
          ],
        },
      }),
    ],
    resolve: {
      alias: {
        "@": resolve(import.meta.dirname, "src"),
      },
    },
  };
});
