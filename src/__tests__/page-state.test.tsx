import { fireEvent, render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import { PageErrorState } from "../patterns";

describe("PageErrorState", () => {
  it("renders a compact accessible error with a real retry action", () => {
    const onRetry = vi.fn();

    render(
      <PageErrorState
        message="Could not load this conversation"
        retryLabel="Try again"
        onRetry={onRetry}
      />
    );

    expect(screen.getByRole("alert")).toHaveTextContent("Could not load this conversation");
    const retry = screen.getByRole("button", { name: "Try again" });
    expect(retry.className).toContain("btn-outline");

    fireEvent.click(retry);
    expect(onRetry).toHaveBeenCalledOnce();
  });

  it("omits the retry action when recovery is unavailable", () => {
    render(<PageErrorState message="This result is unavailable" />);

    expect(screen.getByRole("alert")).toHaveTextContent("This result is unavailable");
    expect(screen.queryByRole("button")).toBeNull();
  });
});
