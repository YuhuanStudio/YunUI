import { act, fireEvent, render, screen, waitFor } from "@testing-library/react";
import { useState } from "react";
import { describe, expect, it, vi } from "vitest";
import { ChatComposer, type ChatComposerCommand, type ChatComposerMenuItem } from "../chat";

const source: ChatComposerMenuItem = { id: "docs", label: "Project docs", description: "Approved documentation" };
const model = { id: "model-42", label: "Model Forty Two", group: "Local provider" };

function changeInput(value: string, onChange: (value: string) => void, onSend = vi.fn()) {
  const props = { value, onChange, onSend };
  return props;
}

describe("ChatComposer host-owned menus", () => {
  it("uses a stable source id, reports desired selection, and inserts the host label after @", () => {
    const onChange = vi.fn();
    const onSourceToggle = vi.fn();
    render(<ChatComposer
      {...changeInput("@Pro", onChange)}
      sourceItems={[source]}
      onSourceToggle={onSourceToggle}
    />);

    const input = screen.getByRole("textbox");
    const listboxId = input.getAttribute("aria-controls");
    const option = screen.getByRole("option", { name: "Project docs" });
    expect(input.tagName).toBe("TEXTAREA");
    expect(listboxId).toBe(option.closest("[role=listbox]")?.id);
    fireEvent.keyDown(input, { key: "ArrowDown", keyCode: 40 });
    expect(input.getAttribute("aria-activedescendant")).toBe(option.id);
    fireEvent.keyDown(input, { key: "Enter", keyCode: 13, isComposing: false });

    expect(onSourceToggle).toHaveBeenCalledWith("docs", true);
    expect(onChange).toHaveBeenCalledWith("@Project docs ");
  });

  it("removes a selected source through the host callback using its stable id", () => {
    const onSourceToggle = vi.fn();
    render(<ChatComposer
      {...changeInput("", vi.fn())}
      sourceItems={[source]}
      selectedSourceIds={["docs"]}
      onSourceToggle={onSourceToggle}
    />);

    fireEvent.click(screen.getByRole("button", { name: "Remove Project docs" }));

    expect(onSourceToggle).toHaveBeenCalledWith("docs", false);
  });

  it("does not invent command text and sends the command object to the host callback", () => {
    const onCommandSelect = vi.fn();
    const onChange = vi.fn();
    const command: ChatComposerCommand = { id: "summarize-thread", label: "/summarize" };
    render(<ChatComposer
      {...changeInput("/sum", onChange)}
      commandItems={[command]}
      onCommandSelect={onCommandSelect}
    />);

    fireEvent.keyDown(screen.getByRole("textbox"), { key: "Enter", keyCode: 13, isComposing: false });

    expect(onCommandSelect).toHaveBeenCalledWith(command);
    expect(onChange).not.toHaveBeenCalled();
  });

  it("inserts only an explicit command insertText value", () => {
    const onCommandSelect = vi.fn();
    const onChange = vi.fn();
    const command: ChatComposerCommand = { id: "review", label: "/review", insertText: "/review --strict\nkeep exact" };
    render(<ChatComposer
      {...changeInput("/rev", onChange)}
      commandItems={[command]}
      onCommandSelect={onCommandSelect}
    />);

    fireEvent.keyDown(screen.getByRole("textbox"), { key: "Enter", keyCode: 13, isComposing: false });

    expect(onCommandSelect).toHaveBeenCalledWith(command);
    expect(onChange).toHaveBeenCalledWith("/review --strict\nkeep exact");
  });

  it("preserves the suffix when replacing a command at the caret and honors an empty insertText", () => {
    const onChange = vi.fn();
    function ControlledComposer({ initial, insertText }: { initial: string; insertText: string }) {
      const [value, setValue] = useState(initial);
      const command: ChatComposerCommand = insertText === ""
        ? { id: "clear", label: "/clear", insertText }
        : { id: "review", label: "/review", insertText };
      return <ChatComposer value={value} onChange={(next) => { onChange(next); setValue(next); }} onSend={() => {}}
        commandItems={[command]} />;
    }
    const { rerender } = render(<ControlledComposer key="review" initial="Keep /rev trailing" insertText="/review --strict" />);
    const input = screen.getByRole("textbox") as HTMLTextAreaElement;
    input.setSelectionRange(9, 9);
    fireEvent.select(input);
    fireEvent.keyDown(input, { key: "Enter", keyCode: 13, isComposing: false });
    expect(onChange).toHaveBeenLastCalledWith("Keep /review --strict trailing");

    onChange.mockClear();
    rerender(<ControlledComposer key="clear" initial="/clear" insertText="" />);
    fireEvent.keyDown(screen.getByRole("textbox"), { key: "Enter", keyCode: 13, isComposing: false });
    expect(onChange).toHaveBeenCalledWith("");
  });

  it("disables commands without an explicit insertion string or host handler", () => {
    render(<ChatComposer
      {...changeInput("", vi.fn())}
      commandItems={[{ id: "opaque-command", label: "/opaque" }]}
    />);

    fireEvent.click(screen.getByRole("button", { name: "Commands" }));
    expect(screen.getByRole("option", { name: "/opaque" })).toBeDisabled();
  });

  it("does not send an @ token when the open source menu has no selectable host action", () => {
    const onSend = vi.fn();
    render(<ChatComposer value="@Pro" onChange={() => {}} onSend={onSend} sourceItems={[source]} />);
    fireEvent.keyDown(screen.getByRole("textbox"), { key: "Enter", keyCode: 13, isComposing: false });
    expect(onSend).not.toHaveBeenCalled();
  });

  it("does not send when an explicitly opened source menu is empty", () => {
    const onSend = vi.fn();
    render(<ChatComposer value="draft" onChange={() => {}} onSend={onSend} sourceItems={[]} />);
    fireEvent.click(screen.getByRole("button", { name: "Sources" }));
    expect(screen.getByRole("status", { name: "Sources" })).toHaveTextContent("No sources available");
    expect(screen.queryByRole("listbox")).not.toBeInTheDocument();
    fireEvent.keyDown(screen.getByRole("textbox"), { key: "Enter", keyCode: 13, isComposing: false });
    expect(onSend).not.toHaveBeenCalled();
  });

  it("keeps an @ token as plain text when the host has supplied no source list", () => {
    const onSend = vi.fn();
    render(<ChatComposer value="@docs" onChange={() => {}} onSend={onSend} />);
    const input = screen.getByRole("textbox");
    expect(input).not.toHaveAttribute("aria-controls");
    fireEvent.keyDown(input, { key: "Enter", keyCode: 13, isComposing: false });
    expect(onSend).toHaveBeenCalledOnce();
  });

  it("keeps suffix text and returns the caret after inserting a source at a mid-string token", async () => {
    const onSourceToggle = vi.fn();
    function ControlledComposer() {
      const [value, setValue] = useState("Review @Pro and keep tail");
      return <ChatComposer value={value} onChange={setValue} onSend={() => {}}
        sourceItems={[source]} selectedSourceIds={[]} onSourceToggle={onSourceToggle} />;
    }
    render(<ControlledComposer />);
    const input = screen.getByRole("textbox") as HTMLTextAreaElement;
    input.setSelectionRange(11, 11);
    fireEvent.select(input);
    fireEvent.keyDown(input, { key: "ArrowDown", keyCode: 40 });
    fireEvent.keyDown(input, { key: "Enter", keyCode: 13, isComposing: false });

    await waitFor(() => expect(input.value).toBe("Review @Project docs and keep tail"));
    await waitFor(() => expect(input.selectionStart).toBe("Review @Project docs ".length));
    expect(onSourceToggle).toHaveBeenCalledWith("docs", true);
  });

  it("does not restore an old completion caret over a newer controlled edit", async () => {
    const frames: FrameRequestCallback[] = [];
    const requestFrame = vi.spyOn(window, "requestAnimationFrame").mockImplementation((callback) => {
      frames.push(callback);
      return frames.length;
    });
    function ControlledComposer() {
      const [value, setValue] = useState("Review @Pro and keep the rest of this draft");
      return <ChatComposer value={value} onChange={setValue} onSend={() => {}}
        sourceItems={[source]} selectedSourceIds={[]} onSourceToggle={() => {}} />;
    }
    render(<ControlledComposer />);
    const input = screen.getByRole("textbox") as HTMLTextAreaElement;
    input.setSelectionRange(11, 11);
    fireEvent.select(input);
    fireEvent.keyDown(input, { key: "ArrowDown", keyCode: 40 });
    fireEvent.keyDown(input, { key: "Enter", keyCode: 13, isComposing: false });
    await waitFor(() => expect(input.value).toBe("Review @Project docs and keep the rest of this draft"));

    const newerValue = "Replace this with a complete later edit";
    fireEvent.change(input, { target: { value: newerValue } });
    await waitFor(() => expect(input.value).toBe(newerValue));
    input.setSelectionRange(newerValue.length, newerValue.length);
    act(() => frames.forEach((callback) => callback(performance.now())));
    expect(input.selectionStart).toBe(newerValue.length);
    requestFrame.mockRestore();
  });

  it("replaces a selected substring through the explicit source menu without dropping its suffix", async () => {
    const onSourceToggle = vi.fn();
    function ControlledComposer() {
      const [value, setValue] = useState("Draft bad selection suffix");
      return <ChatComposer value={value} onChange={setValue} onSend={() => {}}
        sourceItems={[source]} selectedSourceIds={[]} onSourceToggle={onSourceToggle} />;
    }
    render(<ControlledComposer />);
    const input = screen.getByRole("textbox") as HTMLTextAreaElement;
    input.setSelectionRange(6, 19);
    fireEvent.select(input);
    fireEvent.click(screen.getByRole("button", { name: "Sources" }));
    fireEvent.click(screen.getByRole("option", { name: "Project docs" }));

    await waitFor(() => expect(input.value).toBe("Draft @Project docs suffix"));
    expect(onSourceToggle).toHaveBeenCalledWith("docs", true);
  });

  it("reports model ids and disables options when the host cannot handle a change", () => {
    const onModelChange = vi.fn();
    const { rerender } = render(<ChatComposer
      {...changeInput("", vi.fn())}
      modelItems={[{ ...model, id: "unavailable-model", label: "Unavailable model", disabled: true }, model]}
      selectedModelId={model.id}
      onModelChange={onModelChange}
    />);

    fireEvent.click(screen.getByRole("button", { name: "Select a model" }));
    expect(screen.getByRole("option", { name: "Unavailable model" })).toBeDisabled();
    expect(screen.getByRole("option", { name: "Model Forty Two" })).toBeEnabled();
    fireEvent.click(screen.getByRole("option", { name: "Model Forty Two" }));
    expect(onModelChange).toHaveBeenCalledWith(model.id);

    rerender(<ChatComposer
      {...changeInput("", vi.fn())}
      modelItems={[model]}
      selectedModelId={model.id}
    />);
    fireEvent.click(screen.getByRole("button", { name: "Select a model" }));
    expect(screen.getByRole("option", { name: "Model Forty Two" })).toBeDisabled();
  });

  it("accepts readonly host arrays without mutating them", () => {
    const frozenSource = Object.freeze({ id: "readonly-source", label: "Readonly source" } as const);
    const frozenModel = Object.freeze({ id: "readonly-model", label: "Readonly model", group: "Frozen group" } as const);
    const hostSources = Object.freeze([frozenSource]);
    const hostModels = Object.freeze([frozenModel]);
    const onSourceToggle = vi.fn();
    const onModelChange = vi.fn();
    render(<ChatComposer
      {...changeInput("", vi.fn())}
      sourceItems={hostSources}
      selectedSourceIds={Object.freeze([])}
      onSourceToggle={onSourceToggle}
      modelItems={hostModels}
      selectedModelId="readonly-model"
      onModelChange={onModelChange}
    />);

    fireEvent.click(screen.getByRole("button", { name: "Sources" }));
    fireEvent.click(screen.getByRole("option", { name: "Readonly source" }));
    fireEvent.click(screen.getByRole("button", { name: "Select a model" }));
    expect(screen.getByRole("group", { name: "Frozen group" })).toBeInTheDocument();
    fireEvent.click(screen.getByRole("option", { name: "Readonly model" }));

    expect(onSourceToggle).toHaveBeenCalledWith("readonly-source", true);
    expect(onModelChange).toHaveBeenCalledWith("readonly-model");
    expect(hostSources).toEqual([frozenSource]);
    expect(hostModels).toEqual([frozenModel]);
  });

  it("roves focus through enabled model options and restores the trigger on Escape", async () => {
    render(<ChatComposer
      {...changeInput("", vi.fn())}
      modelItems={[{ id: "disabled", label: "Unavailable", disabled: true }, model, { id: "second", label: "Second model" }]}
      selectedModelId={model.id}
      onModelChange={vi.fn()}
    />);
    const trigger = screen.getByRole("button", { name: "Select a model" });
    fireEvent.keyDown(trigger, { key: "ArrowDown", keyCode: 40 });
    const first = screen.getByRole("option", { name: "Model Forty Two" });
    await waitFor(() => expect(document.activeElement).toBe(first));
    fireEvent.keyDown(first, { key: "ArrowDown", keyCode: 40 });
    const second = screen.getByRole("option", { name: "Second model" });
    await waitFor(() => expect(document.activeElement).toBe(second));
    fireEvent.keyDown(second, { key: "Escape", keyCode: 27 });
    await waitFor(() => expect(document.activeElement).toBe(trigger));
  });

  it("keeps every menu and source-selection state host-owned", () => {
    const onChange = vi.fn();
    const onSourceToggle = vi.fn();
    render(<ChatComposer
      {...changeInput("", onChange)}
      sourceItems={[source]}
      selectedSourceIds={[]}
      onSourceToggle={onSourceToggle}
      commandItems={[]}
      modelItems={[]}
      selectedModelId="missing-host-model"
    />);

    expect(screen.getByRole("button", { name: "Sources" })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Commands" })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Select a model" })).toBeInTheDocument();
    expect(onChange).not.toHaveBeenCalled();
    expect(onSourceToggle).not.toHaveBeenCalled();
  });
});
