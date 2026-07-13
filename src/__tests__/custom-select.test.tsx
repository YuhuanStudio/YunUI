import { describe, it, expect, vi } from "vitest";
import { render, screen, waitFor } from "@testing-library/react";
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

describe("CustomSelect — remote search (onSearch)", () => {
  it("shows a search box in remote mode even without `searchable`", async () => {
    const user = userEvent.setup();
    renderSelect({ onSearch: vi.fn() });
    await user.click(screen.getByRole("button"));
    expect(screen.getByRole("combobox")).toBeInTheDocument();
  });

  it("passes the typed query to onSearch and does not filter locally", async () => {
    const user = userEvent.setup();
    const onSearch = vi.fn();
    render(
      <YunUIProvider adapters={{ useT: () => (k: string) => k }}>
        <CustomSelect options={opts} value="" onChange={vi.fn()} onSearch={onSearch} searchDebounceMs={50} />
      </YunUIProvider>
    );
    await user.click(screen.getByRole("button"));
    await user.type(screen.getByRole("combobox"), "xyz");
    // Query text never in any label → local filtering would hide all 3; remote keeps them.
    expect(screen.getAllByRole("option")).toHaveLength(3);
    await waitFor(() => expect(onSearch).toHaveBeenLastCalledWith("xyz"));
  });

  it("renders a loading indicator and no 'no options' text while fetching an empty list", async () => {
    const user = userEvent.setup();
    render(
      <YunUIProvider adapters={{ useT: () => (k: string) => k }}>
        <CustomSelect options={[]} value="" onChange={vi.fn()} onSearch={vi.fn()} loading />
      </YunUIProvider>
    );
    await user.click(screen.getByRole("button"));
    expect(screen.queryByText("common.select.noOptions")).toBeNull();
    expect(screen.getByRole("listbox").querySelector(".animate-spin")).toBeTruthy();
  });
});
