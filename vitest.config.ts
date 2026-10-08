import { defineConfig } from "vitest/config";
import react from "@vitejs/plugin-react";

import packageJson from "./package.json" with { type: "json" };
import { resolve } from "path";

const releaseId = `${packageJson.name}@${packageJson.version}`;

export default defineConfig({
  define: {
    __APP_VERSION__: JSON.stringify(releaseId),
  },
  plugins: [react()],
  test: {
    environment: "jsdom",
    globals: false,
    include: ["tests/**/*.test.{ts,tsx}"],
    setupFiles: ["./tests/setup.ts"],
  },
  resolve: {
    alias: {
      "@": resolve(import.meta.dirname, "src"),
    },
  },
});
