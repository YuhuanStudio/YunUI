import { describe, it, expect, vi } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import { PasswordInput, NumberInput, Kbd } from "../primitives";

describe("PasswordInput", () => {
  it("masks by default and toggles to text via the reveal button", () => {
    const { container } = render(<PasswordInput placeholder="pw" />);
    const input = container.querySelector("input")!;
    expect(input.getAttribute("type")).toBe("password");

    const toggle = screen.getByRole("button", { name: /show password/i });
    expect(toggle).toHaveAttribute("aria-pressed", "false");
    fireEvent.click(toggle);

    expect(input.getAttribute("type")).toBe("text");
    expect(screen.getByRole("button", { name: /hide password/i })).toHaveAttribute("aria-pressed", "true");
  });

  it("wires error aria like Input", () => {
    const { container } = render(<PasswordInput error="Required" />);
    const input = container.querySelector("input")!;
    expect(input).toHaveAttribute("aria-invalid", "true");
    const describedby = input.getAttribute("aria-describedby")!;
    expect(document.getElementById(describedby)?.textContent).toContain("Required");
  });
});

describe("NumberInput", () => {
  it("steps up/down via the +/- buttons (controlled, clamped)", () => {
    const onChange = vi.fn();
    render(<NumberInput value={5} onChange={onChange} min={0} max={10} step={2} />);
    fireEvent.click(screen.getByRole("button", { name: /increase/i }));
    expect(onChange).toHaveBeenLastCalledWith(7);
    fireEvent.click(screen.getByRole("button", { name: /decrease/i }));
    expect(onChange).toHaveBeenLastCalledWith(3);
  });

  it("disables the stepper at the bound", () => {
    const onChange = vi.fn();
    render(<NumberInput value={10} onChange={onChange} min={0} max={10} />);
    expect(screen.getByRole("button", { name: /increase/i })).toBeDisabled();
    expect(screen.getByRole("button", { name: /decrease/i })).not.toBeDisabled();
  });
});

describe("Kbd", () => {
  it("renders a <kbd> with its children", () => {
    const { container } = render(<Kbd>⌘</Kbd>);
    const kbd = container.querySelector("kbd");
    expect(kbd).not.toBeNull();
    expect(kbd?.textContent).toBe("⌘");
  });
});
