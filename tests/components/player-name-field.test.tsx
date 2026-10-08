import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it } from "vitest";

import { PlayerNameField } from "@/components/player-name-field";

describe("PlayerNameField", (): void => {
  it("renders an accessible labelled input", (): void => {
    render(<PlayerNameField />);
    expect(screen.getByLabelText(/player name/i)).toBeInTheDocument();
    expect(screen.getByText(/1-16 letters/i)).toBeInTheDocument();
  });

  it("updates the displayed value when the user types", async (): Promise<void> => {
    const user = userEvent.setup();
    render(<PlayerNameField />);
    const input = screen.getByLabelText(/player name/i);
    if (!(input instanceof HTMLInputElement)) {
      throw new Error("expected input element");
    }
    await user.type(input, "X");
    expect(input.value.endsWith("X")).toBe(true);
  });
});
