import { describe, it, expect } from "vitest";
import { render, fireEvent } from "@testing-library/react";
import { useRef } from "react";
import { useFocusTrap } from "../lib/hooks";
import { Sheet } from "../primitives/sheet";

function Trap({ enabled = true }: { enabled?: boolean }) {
  const ref = useRef<HTMLDivElement>(null);
  useFocusTrap(ref, enabled);
  return (
    <div>
      <button data-testid="outside">outside</button>
      <div ref={ref} data-testid="panel" tabIndex={-1}>
        <button data-testid="a">A</button>
        <button data-testid="b">B</button>
      </div>
    </div>
  );
}

describe("useFocusTrap", () => {
  it("moves focus into the container on enable", () => {
    const { getByTestId } = render(<Trap />);
    expect(document.activeElement).toBe(getByTestId("a"));
  });

  it("wraps Tab from the last focusable back to the first", () => {
    const { getByTestId } = render(<Trap />);
    getByTestId("b").focus();
    fireEvent.keyDown(getByTestId("panel"), { key: "Tab" });
    expect(document.activeElement).toBe(getByTestId("a"));
  });

  it("wraps Shift+Tab from the first focusable to the last", () => {
    const { getByTestId } = render(<Trap />);
    getByTestId("a").focus();
    fireEvent.keyDown(getByTestId("panel"), { key: "Tab", shiftKey: true });
    expect(document.activeElement).toBe(getByTestId("b"));
  });

  it("does not force focus when disabled", () => {
    const { getByTestId } = render(<Trap enabled={false} />);
    expect(document.activeElement).not.toBe(getByTestId("a"));
  });
});

describe("Sheet focus trap", () => {
  it("is a labelled modal dialog and keeps Tab inside the panel", () => {
    const { getByRole, getByTestId } = render(
      <Sheet open onClose={() => {}} title="Settings">
        <button data-testid="x">X</button>
        <button data-testid="y">Y</button>
      </Sheet>,
    );
    const dialog = getByRole("dialog");
    expect(dialog).toHaveAttribute("aria-modal", "true");
    // focus is moved into the panel on open
    expect(dialog.contains(document.activeElement)).toBe(true);
    // Tab from the last focusable wraps back inside the panel (never escapes)
    getByTestId("y").focus();
    fireEvent.keyDown(dialog, { key: "Tab" });
    expect(dialog.contains(document.activeElement)).toBe(true);
  });
});
