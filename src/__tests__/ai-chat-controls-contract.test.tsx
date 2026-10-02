import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import { afterEach, describe, expect, it, vi } from "vitest";
import { ModelSelect, type ModelSelectOption } from "../ai/model-select";
import { AgentTimeline } from "../ai/agent-timeline";
import { ChatComposer } from "../chat/chat-composer";

const nativeScrollIntoView = Element.prototype.scrollIntoView;
afterEach(() => {
  if (nativeScrollIntoView) Element.prototype.scrollIntoView = nativeScrollIntoView;
  else delete (Element.prototype as Partial<Element>).scrollIntoView;
});

describe("AI/chat control contracts", () => {
  it("does not select a disabled ModelSelect option by pointer", async () => {
    const onChange = vi.fn();
    render(<ModelSelect value="ready" onChange={onChange} options={[
      { id: "blocked", label: "Unavailable", group: "Provider", disabled: true },
      { id: "ready", label: "Ready", group: "Provider" },
    ]} />);

    fireEvent.click(screen.getByRole("button", { name: /Ready/ }));
    const blocked = screen.getByRole("option", { name: "Unavailable" });
    expect(blocked).toHaveAttribute("aria-disabled", "true");
    fireEvent.click(blocked);
    expect(onChange).not.toHaveBeenCalled();
    expect(screen.getByRole("listbox")).toBeInTheDocument();
  });

  it("skips disabled ModelSelect options with keyboard and restores trigger focus on Escape", async () => {
    const onChange = vi.fn();
    const scrollIntoView = vi.fn();
    Element.prototype.scrollIntoView = scrollIntoView;
    const options: ModelSelectOption[] = [
      { id: "blocked", label: "Unavailable", group: "Provider", disabled: true },
      { id: "ready", label: "Ready", group: "Provider" },
    ];
    const { unmount } = render(<ModelSelect value="" onChange={onChange} options={options} />);
    const trigger = screen.getByRole("button", { name: "Select a model" });

    fireEvent.click(trigger);
    const search = screen.getByRole("combobox", { name: "Search models…" });
    await waitFor(() => expect(search).toHaveFocus());
    fireEvent.keyDown(search, { key: "ArrowDown" });
    expect(search).toHaveAttribute("aria-activedescendant", screen.getByRole("option", { name: "Ready" }).id);
    fireEvent.keyDown(search, { key: "Enter" });
    expect(onChange).toHaveBeenCalledWith("ready");
    await waitFor(() => expect(trigger).toHaveFocus());

    fireEvent.click(trigger);
    const reopenedSearch = screen.getByRole("combobox", { name: "Search models…" });
    await waitFor(() => expect(reopenedSearch).toHaveFocus());
    fireEvent.keyDown(reopenedSearch, { key: "Escape" });
    await waitFor(() => expect(screen.queryByRole("listbox")).not.toBeInTheDocument());
    await waitFor(() => expect(trigger).toHaveFocus());

    unmount();
  });

  it("removes collapsed AgentTimeline content from accessibility and keyboard navigation", () => {
    const { container } = render(<AgentTimeline blocks={[
      { kind: "tool", id: "run", verb: "Run", status: "done", output: "result" },
    ]} />);
    expect(screen.queryByRole("region", { name: "Run output" })).not.toBeInTheDocument();
    const region = container.querySelector<HTMLElement>('[role="region"][aria-label="Run output"]')!;
    expect(region.closest("[aria-hidden='true'][inert]")).not.toBeNull();

    fireEvent.click(screen.getByRole("button", { name: /Run/ }));
    expect(screen.getByRole("region", { name: "Run output" })).toBeInTheDocument();
    expect(region.closest("[aria-hidden='false']:not([inert])")).not.toBeNull();
  });

  it("does not expose pending approval buttons without host callbacks", () => {
    const block = { kind: "approval" as const, id: "approval", title: "Approve", verb: "shell", allowLabel: "Allow", denyLabel: "Deny" };
    const { rerender } = render(<AgentTimeline blocks={[block]} />);
    expect(screen.getByRole("button", { name: "Allow" })).toBeDisabled();
    expect(screen.getByRole("button", { name: "Deny" })).toBeDisabled();

    const onApprove = vi.fn();
    const onReject = vi.fn();
    rerender(<AgentTimeline blocks={[block]} onApprove={onApprove} onReject={onReject} />);
    fireEvent.click(screen.getByRole("button", { name: "Allow" }));
    fireEvent.click(screen.getByRole("button", { name: "Deny" }));
    expect(onApprove).toHaveBeenCalledWith("approval");
    expect(onReject).toHaveBeenCalledWith("approval");
  });

  it("disables the ChatComposer stop action when no host callback is supplied", () => {
    const onStop = vi.fn();
    const { rerender } = render(<ChatComposer value="draft" onChange={() => {}} onSend={() => {}} loading />);
    const stop = screen.getByRole("button", { name: "Stop" });
    expect(stop).toBeDisabled();

    rerender(<ChatComposer value="draft" onChange={() => {}} onSend={() => {}} loading onStop={onStop} />);
    const enabledStop = screen.getByRole("button", { name: "Stop" });
    expect(enabledStop).toBeEnabled();
    fireEvent.click(enabledStop);
    expect(onStop).toHaveBeenCalledOnce();
  });
});
