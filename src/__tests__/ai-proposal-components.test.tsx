import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import { DiffTable, type DiffTableRow } from "../ai/diff-table";
import { SelectionActions } from "../ai/selection-actions";

const rect = (x: number, y: number, width: number, height: number) => ({
  x, y, left: x, top: y, width, height, right: x + width, bottom: y + height,
  toJSON: () => ({}),
}) as DOMRect;

let originalRect: typeof HTMLElement.prototype.getBoundingClientRect;
let originalClientRects: typeof Element.prototype.getClientRects;

beforeEach(() => {
  originalRect = HTMLElement.prototype.getBoundingClientRect;
  originalClientRects = Element.prototype.getClientRects;
  HTMLElement.prototype.getBoundingClientRect = function () {
    if (this.dataset.yunui === "selection-actions-host") return rect(10, 20, 420, 180);
    if (this.dataset.yunui === "selection-actions-selected") return rect(40, 48, 210, 22);
    return originalRect.call(this);
  };
  Element.prototype.getClientRects = function () {
    if ((this as HTMLElement).dataset?.yunui === "selection-actions-selected") return [rect(40, 48, 210, 22)] as unknown as DOMRectList;
    return originalClientRects.call(this);
  };
});

afterEach(() => {
  HTMLElement.prototype.getBoundingClientRect = originalRect;
  Element.prototype.getClientRects = originalClientRects;
});

const rows: DiffTableRow[] = [
  { id: "remove-a", primary: "Remove stale access", category: "Access", secondary: "Policy §2", change: "remove" },
  { id: "add-b", primary: "Add admin notice", category: "Guide", secondary: "Page §4", change: "add" },
  { id: "context-c", primary: "Keep request ID", category: "Guide", secondary: "Page §7", change: "unchanged" },
];

describe("host-controlled AI proposal components", () => {
  it("anchors selection actions and reports only host action requests", async () => {
    const onAction = vi.fn();
    const { container, rerender } = render(
      <SelectionActions lead="Selected text: " selectedText="Original passage" onAction={onAction} labels={{ placeholder: "Describe a change" }} />,
    );
    await waitFor(() => expect(container.querySelector('[data-yunui="selection-actions-anchor"]')).toHaveAttribute("aria-hidden", "false"));
    expect(screen.getByText("Original passage")).toBeInTheDocument();

    fireEvent.click(screen.getByRole("button", { name: "Improve" }));
    expect(onAction).toHaveBeenCalledWith("Improve", undefined);
    // Choosing an action requests host work; it does not invent a busy/result state.
    expect(screen.queryByRole("status")).not.toBeInTheDocument();

    rerender(<SelectionActions lead="Selected text: " selectedText="New selection" state="busy" busyLabel="Improving passage" onAction={onAction} labels={{ placeholder: "Describe a change" }} />);
    expect(await screen.findByRole("status")).toHaveTextContent("Improving passage");
    expect(screen.queryByRole("button", { name: "Improve" })).not.toBeInTheDocument();
    expect(screen.getByText("New selection")).toBeInTheDocument();
  });

  it("keeps custom instruction, result acceptance and dismiss callbacks host-owned", async () => {
    const onAction = vi.fn();
    const onAccept = vi.fn();
    const onDismiss = vi.fn();
    const { rerender } = render(<SelectionActions selectedText="Original text" onAction={onAction} labels={{ placeholder: "Ask for an edit", submitInstruction: "Send edit" }} />);
    await waitFor(() => expect(screen.getByRole("textbox", { name: "Ask for an edit" })).toBeInTheDocument());
    fireEvent.change(screen.getByRole("textbox", { name: "Ask for an edit" }), { target: { value: "Keep the meaning" } });
    fireEvent.click(screen.getByRole("button", { name: "Send edit" }));
    expect(onAction).toHaveBeenCalledWith("Custom instruction", "Keep the meaning");
    expect(screen.getByText("Original text")).toBeInTheDocument();

    rerender(<SelectionActions selectedText="Original text" resultText="" state="result" onAccept={onAccept} onDismiss={onDismiss} labels={{ keep: "Use edit", discard: "Dismiss edit", result: "Suggested text" }} />);
    fireEvent.click(await screen.findByRole("button", { name: "Use edit" }));
    expect(onAccept).toHaveBeenCalledWith("");
    fireEvent.click(screen.getByRole("button", { name: "Dismiss edit" }));
    expect(onDismiss).toHaveBeenCalledOnce();
  });

  it("disables missing action callbacks and exposes controlled error copy", async () => {
    const { rerender } = render(<SelectionActions selectedText="Passage" actions={[{ id: "Explain", action: "explain" }]} />);
    await waitFor(() => expect(screen.getByRole("button", { name: "Explain" })).toBeDisabled());
    expect(screen.getByRole("button", { name: "Submit custom instruction" })).toBeDisabled();
    rerender(<SelectionActions selectedText="Passage" resultText="Proposed" state="result" />);
    expect(screen.getByRole("button", { name: "Keep" })).toBeDisabled();
    rerender(<SelectionActions selectedText="Passage" state="error" labels={{ error: "Request failed; original text remains." }} />);
    expect(await screen.findByRole("status")).toHaveTextContent("Request failed; original text remains.");
  });

  it("localizes the action label without changing its stable host ID", async () => {
    const onAction = vi.fn();
    render(<SelectionActions selectedText="Passage" actions={[{ id: "Improve", label: "改善" }]} onAction={onAction} />);
    await waitFor(() => expect(screen.getByRole("button", { name: "改善" })).toBeInTheDocument());
    fireEvent.click(screen.getByRole("button", { name: "改善" }));
    expect(onAction).toHaveBeenCalledWith("Improve", undefined);
  });

  it("toggles stable diff IDs, preserves table order and submits only selected changed rows", () => {
    const onSelectionChange = vi.fn();
    const onApply = vi.fn();
    const onReject = vi.fn();
    render(<DiffTable rows={rows} selectedIds={["remove-a"]} onSelectionChange={onSelectionChange} onApply={onApply} onReject={onReject} />);

    const addition = screen.getByText("Add admin notice").closest("tr");
    expect(addition).toBeInTheDocument();
    fireEvent.click(addition!);
    expect(onSelectionChange).toHaveBeenCalledWith(["remove-a", "add-b"]);
    fireEvent.click(screen.getByRole("button", { name: "Apply 1 change" }));
    expect(onApply).toHaveBeenCalledWith(["remove-a"]);
    fireEvent.click(screen.getByRole("button", { name: "Reject" }));
    expect(onReject).toHaveBeenCalledWith(["remove-a"]);
    expect(screen.getByText("Keep request ID").closest("tr")).not.toHaveAttribute("tabindex");
  });

  it("does not offer apply for zero valid selections and respects row/callback locks", () => {
    const onApply = vi.fn();
    const onChange = vi.fn();
    const { rerender } = render(<DiffTable rows={rows} selectedIds={["stale-id", "context-c"]} onApply={onApply} onSelectionChange={onChange} />);
    expect(screen.getByRole("button", { name: "Apply 0 changes" })).toBeDisabled();
    expect(screen.queryByRole("button", { name: "Reject" })).not.toBeInTheDocument();
    expect(screen.getByText("Remove stale access").closest("tr")).toHaveAttribute("tabindex", "0");

    rerender(<DiffTable rows={rows} selectedIds={["remove-a"]} />);
    expect(screen.getByRole("button", { name: "Apply 1 change" })).toBeDisabled();
    expect(screen.getByText("Remove stale access").closest("tr")).not.toHaveAttribute("tabindex");

    rerender(<DiffTable rows={rows} selectedIds={["remove-a"]} state="busy" onApply={onApply} onSelectionChange={onChange} statusMessage="Waiting for approval" />);
    expect(screen.getByRole("status")).toHaveTextContent("Waiting for approval");
    expect(screen.getByText("Remove stale access").closest("tr")).not.toHaveAttribute("tabindex");
    expect(screen.queryByRole("button", { name: /Apply/ })).not.toBeInTheDocument();

    rerender(<DiffTable rows={[{ ...rows[0], disabled: true }]} selectedIds={["remove-a"]} onApply={onApply} onSelectionChange={onChange} />);
    expect(screen.getByText("Remove stale access").closest("tr")).not.toHaveAttribute("tabindex");
    expect(screen.getByText("Remove stale access").closest("tr")).toHaveAttribute("aria-selected", "false");
    expect(screen.getByRole("button", { name: "Apply 0 changes" })).toBeDisabled();
  });
});

it("returns the exact empty result when the host proposes deleting the passage", async () => {
  const accept = vi.fn();
  render(<SelectionActions selectedText="Remove this passage" resultText="" state="result" onAccept={accept} />);
  await waitFor(() => expect(screen.getByRole("button", { name: "Keep" })).toBeEnabled());
  fireEvent.click(screen.getByRole("button", { name: "Keep" }));
  expect(accept).toHaveBeenCalledWith("");
});
