import { render, screen, within } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { TextShimmer } from "../index";

describe("TextShimmer", () => {
  it("exposes one accessible status label while keeping paint layers decorative", () => {
    const { container } = render(<TextShimmer text="Checking the evidence" data-testid="status" />);

    const status = screen.getByTestId("status");
    // The name has to come from real text, not `aria-label`: ARIA prohibits
    // aria-label on a span with no role and browsers ignore it, so the old
    // attribute assertion passed while a screen reader heard nothing.
    expect(status).not.toHaveAttribute("aria-label");
    expect(within(status).getByText("Checking the evidence", { selector: ".sr-only" })).toBeInTheDocument();
    expect(status).toHaveAttribute("data-active", "true");
    expect(container.querySelectorAll('[aria-hidden="true"]')).toHaveLength(1);
  });

  it("can pause without changing its label or geometry contract", () => {
    const { rerender } = render(<TextShimmer text="Thinking" active={false} data-testid="status" />);
    const status = screen.getByTestId("status");
    expect(status).toHaveAttribute("data-active", "false");

    rerender(<TextShimmer text="Reflecting" active data-testid="status" />);
    expect(within(status).getByText("Reflecting", { selector: ".sr-only" })).toBeInTheDocument();
    expect(status).toHaveAttribute("data-active", "true");
  });
});
