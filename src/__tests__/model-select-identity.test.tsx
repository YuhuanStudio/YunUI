import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { useState } from "react";
import { describe, expect, it, vi } from "vitest";
import { ModelSelect } from "../ai/model-select";

describe("ModelSelect identity", () => {
  it("keeps pin actions outside options and retains keyboard focus when regrouped", async () => {
    const change = vi.fn();
    function Host() {
      const [pinned, setPinned] = useState<string[]>([]);
      return <ModelSelect value="" options={[{ id: "model", label: "Model", group: "Provider" }]} onChange={change} pinned={pinned} onTogglePin={id => setPinned(current => current.includes(id) ? [] : [id])} />;
    }
    render(<Host />);
    fireEvent.click(screen.getByRole("button", { name: "Select a model" }));
    await waitFor(() => expect(screen.getByRole("combobox")).toHaveFocus());
    const pin = screen.getByRole("button", { name: "Pin" });
    expect(pin.closest('[role="option"]')).toBeNull();
    pin.focus();
    await userEvent.setup().keyboard("{Enter}");
    expect(change).not.toHaveBeenCalled();
    await waitFor(() => expect(screen.getByRole("button", { name: "Unpin" })).toHaveFocus());
  });
  it("announces an empty result without making it selectable", () => {
    const change = vi.fn();
    render(<ModelSelect value="" options={[]} onChange={change} />);
    fireEvent.click(screen.getByRole("button", { name: "Select a model" }));
    expect(screen.getByRole("option", { name: "No models found" })).toHaveAttribute("aria-disabled", "true");
    fireEvent.keyDown(screen.getByRole("combobox"), { key: "Enter" });
    expect(change).not.toHaveBeenCalled();
  });
  it("keeps option identities distinct for punctuation, Unicode and multiple instances", () => {
    const options = [
      { id: "a/b", label: "Slash", group: "__proto__" },
      { id: "a_b", label: "Underscore", group: "constructor" },
      { id: "中文", label: "Chinese", group: "__proto__" },
    ];
    const { container } = render(<><ModelSelect value="" options={options} onChange={vi.fn()} /><ModelSelect value="" options={options} onChange={vi.fn()} /></>);
    screen.getAllByRole("button", { name: "Select a model" }).forEach(button => fireEvent.click(button));
    const searches = screen.getAllByRole("combobox");
    expect(searches).toHaveLength(2);
    searches.forEach(search => {
      const listbox = container.querySelector(`[id="${search.getAttribute("aria-controls")}"]`)!;
      fireEvent.keyDown(search, { key: "ArrowDown" });
      const activeId = search.getAttribute("aria-activedescendant")!;
      expect(listbox.getAttribute("aria-owns")?.split(" ")).toContain(activeId);
      expect(document.getElementById(activeId)).toHaveAttribute("role", "option");
    });
    const ids = Array.from(container.querySelectorAll("[id]"), element => element.id);
    expect(new Set(ids).size).toBe(ids.length);
  });
  it("allows host labels and pins without selecting the model", () => {
    const change = vi.fn();
    const pin = vi.fn();
    render(<ModelSelect value="" options={[{ id: "model", label: "Model", group: "Provider" }]} onChange={change} onTogglePin={pin} labels={{ pin: "釘選", unpin: "取消釘選" }} />);
    fireEvent.click(screen.getByRole("button", { name: "Select a model" }));
    fireEvent.click(screen.getByRole("button", { name: "釘選" }));
    expect(pin).toHaveBeenCalledWith("model");
    expect(change).not.toHaveBeenCalled();
  });
});
