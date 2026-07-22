import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { TextShimmer } from "../index";

describe("TextShimmer", () => {
  it("exposes one accessible status label while keeping paint layers decorative", () => {
    const { container } = render(<TextShimmer text="Checking the evidence" data-testid="status" />);

    const status = screen.getByTestId("status");
    expect(status).toHaveAttribute("aria-label", "Checking the evidence");
    expect(status).toHaveAttribute("data-active", "true");
    expect(container.querySelectorAll('[aria-hidden="true"]')).toHaveLength(1);
  });

  it("can pause without changing its label or geometry contract", () => {
    const { rerender } = render(<TextShimmer text="Thinking" active={false} data-testid="status" />);
    const status = screen.getByTestId("status");
    expect(status).toHaveAttribute("data-active", "false");

    rerender(<TextShimmer text="Reflecting" active data-testid="status" />);
    expect(status).toHaveAttribute("aria-label", "Reflecting");
    expect(status).toHaveAttribute("data-active", "true");
  });
});
