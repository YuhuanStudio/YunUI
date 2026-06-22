import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { YunUIProvider } from "../adapters/context";
import { CustomSelect, type SelectOption } from "../primitives/custom-select";

const opts: SelectOption[] = [
  { value: "a", label: "Apple" },
  { value: "b", label: "Banana" },
  { value: "c", label: "Cherry" },
];

function renderSelect(extra: Partial<React.ComponentProps<typeof CustomSelect>> = {}) {
  const onChange = vi.fn();
  render(
    <YunUIProvider adapters={{ useT: () => (k: string) => k }}>
      <CustomSelect options={opts} value="" onChange={onChange} {...extra} />
    </YunUIProvider>
  );
  return { onChange };
}

describe("CustomSelect — a11y + keyboard", () => {
  it("trigger exposes listbox combobox semantics", () => {
    renderSelect();
    const trigger = screen.getByRole("button");
    expect(trigger).toHaveAttribute("aria-haspopup", "listbox");
    expect(trigger).toHaveAttribute("aria-expanded", "false");
  });

  it("opens with ArrowDown and exposes role=listbox + role=option", async () => {
    const user = userEvent.setup();
    renderSelect();
    const trigger = screen.getByRole("button");
    trigger.focus();
    await user.keyboard("{ArrowDown}");
    expect(screen.getByRole("listbox")).toBeInTheDocument();
    expect(screen.getAllByRole("option")).toHaveLength(3);
    expect(trigger).toHaveAttribute("aria-expanded", "true");
  });

  it("ArrowDown navigation + Enter selects the highlighted option", async () => {
    const user = userEvent.setup();
    const { onChange } = renderSelect();
    screen.getByRole("button").focus();
    await user.keyboard("{ArrowDown}"); // open → highlight Apple (0)
    await user.keyboard("{ArrowDown}"); // → Banana (1)
    await user.keyboard("{Enter}");
    expect(onChange).toHaveBeenCalledWith("b");
  });

  it("Escape closes the listbox", async () => {
    const user = userEvent.setup();
    renderSelect();
    screen.getByRole("button").focus();
    await user.keyboard("{ArrowDown}");
    expect(screen.getByRole("listbox")).toBeInTheDocument();
    await user.keyboard("{Escape}");
    expect(screen.queryByRole("listbox")).toBeNull();
  });

  it("marks the current value as aria-selected", async () => {
    const user = userEvent.setup();
    renderSelect({ value: "c" });
    screen.getByRole("button").focus();
    await user.keyboard("{ArrowDown}");
    const selected = screen.getByRole("option", { selected: true });
    expect(selected).toHaveTextContent("Cherry");
  });
});
