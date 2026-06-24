import { describe, it, expect, vi } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import {
  PasswordInput,
  NumberInput,
  Kbd,
  SearchInput,
  Separator,
  Alert,
  Tag,
  AvatarGroup,
} from "../primitives";

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

describe("SearchInput", () => {
  it("renders a search field and reports typed text as a string", () => {
    const onChange = vi.fn();
    render(<SearchInput value="" onChange={onChange} placeholder="Search" />);
    const input = screen.getByRole("searchbox");
    fireEvent.change(input, { target: { value: "gpt" } });
    expect(onChange).toHaveBeenLastCalledWith("gpt");
  });

  it("has exactly one clear control — shown only with a value — and clears via onChange('')", () => {
    const onChange = vi.fn();
    const { rerender } = render(<SearchInput value="" onChange={onChange} />);
    expect(screen.queryByRole("button", { name: /clear search/i })).toBeNull();
    rerender(<SearchInput value="gpt" onChange={onChange} />);
    // Exactly one clear button (no native type="search" ✕ alongside ours).
    expect(screen.getAllByRole("button", { name: /clear search/i })).toHaveLength(1);
    fireEvent.click(screen.getByRole("button", { name: /clear search/i }));
    expect(onChange).toHaveBeenLastCalledWith("");
  });
});

describe("Separator", () => {
  it("is a horizontal separator by default", () => {
    render(<Separator />);
    const sep = screen.getByRole("separator");
    expect(sep).not.toHaveAttribute("aria-orientation"); // horizontal is implicit
  });

  it("marks vertical orientation and can be decorative", () => {
    const { rerender } = render(<Separator orientation="vertical" />);
    expect(screen.getByRole("separator")).toHaveAttribute("aria-orientation", "vertical");
    rerender(<Separator decorative />);
    expect(screen.queryByRole("separator")).toBeNull();
  });
});

describe("Alert", () => {
  it("renders as role=alert with a title and body", () => {
    render(
      <Alert variant="error" title="Oops">
        Something went wrong
      </Alert>
    );
    const alert = screen.getByRole("alert");
    expect(alert).toHaveTextContent("Oops");
    expect(alert).toHaveTextContent("Something went wrong");
  });
});

describe("Tag", () => {
  it("renders children and fires onRemove from the remove button", () => {
    const onRemove = vi.fn();
    render(<Tag onRemove={onRemove}>vision</Tag>);
    expect(screen.getByText("vision")).toBeInTheDocument();
    fireEvent.click(screen.getByRole("button", { name: /remove/i }));
    expect(onRemove).toHaveBeenCalledOnce();
  });

  it("has no remove button without onRemove", () => {
    render(<Tag>plain</Tag>);
    expect(screen.queryByRole("button")).toBeNull();
  });
});

describe("AvatarGroup", () => {
  it("caps visible items at max and shows a +N overflow chip", () => {
    render(
      <AvatarGroup max={2}>
        <span>a</span>
        <span>b</span>
        <span>c</span>
        <span>d</span>
      </AvatarGroup>
    );
    expect(screen.getByText("a")).toBeInTheDocument();
    expect(screen.getByText("b")).toBeInTheDocument();
    expect(screen.queryByText("c")).toBeNull();
    expect(screen.getByText("+2")).toBeInTheDocument();
  });
});
