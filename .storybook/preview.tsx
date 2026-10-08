/// <reference types="vite/client" />

import { MemoryRouter } from "react-router";
import type { Decorator, Preview } from "@storybook/react-vite";
import type { ReactElement } from "react";

import "../src/index.css";

const withPaperFrame: Decorator = (Story): ReactElement => (
  <MemoryRouter>
    <div className="bg-paper text-ink min-h-screen p-6">
      <div className="mx-auto max-w-6xl">
        <Story />
      </div>
    </div>
  </MemoryRouter>
);

const preview: Preview = {
  decorators: [withPaperFrame],
  parameters: {
    a11y: {
      test: "error",
      config: {
        rules: [
          { id: "color-contrast", enabled: true },
          { id: "region", enabled: false },
        ],
      },
      options: {
        runOnly: {
          type: "tag",
          values: ["wcag2a", "wcag2aa"],
        },
      },
    },
    backgrounds: {
      default: "paper",
      values: [{ name: "paper", value: "#faf9f5" }],
    },
    controls: {
      matchers: {
        color: /(background|color)$/i,
        date: /Date$/i,
      },
    },
  },
};

export default preview;
