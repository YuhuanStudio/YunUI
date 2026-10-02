import { fireEvent, render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";
import { YunUIProvider, type YunUIAdapters } from "../adapters/context";
import { ModelCard } from "../ai/model-card";

const adapters: Partial<YunUIAdapters> = { useT: () => (key: string) => key };

function renderWithProvider(card: React.ReactNode) {
  return render(<YunUIProvider adapters={adapters}>{card}</YunUIProvider>);
}

describe("ModelCard clickable semantics", () => {
  it("keeps the full-card click target while exposing separate native actions", async () => {
    const user = userEvent.setup();
    const select = vi.fn();
    const copyId = "model-id";
    renderWithProvider(
      <ModelCard name="Model" ids={[copyId]} description="Model description" onClick={select} />,
    );
    const action = screen.getByRole("button", { name: "Model" });
    const copy = screen.getByRole("button", { name: "clickToCopy" });

    expect(action).toHaveAttribute("data-model-card-action");
    expect(copy).not.toBe(action);
    await user.click(screen.getByText("Model description"));
    expect(select).toHaveBeenCalledOnce();

    await user.click(copy);
    expect(select).toHaveBeenCalledOnce();

  });

  it("activates from the card action button but not from link/button slots", async () => {
    const user = userEvent.setup();
    const select = vi.fn();
    const linkAction = vi.fn();
    const slotAction = vi.fn();
    renderWithProvider(
      <ModelCard
        name="Model"
        onClick={select}
        description={(
          <>
            <a href="#details" onClick={(event) => { event.preventDefault(); linkAction(); }}>Details</a>
            <button type="button" onClick={slotAction}>Host action</button>
          </>
        )}
      />,
    );
    const cardAction = screen.getByRole("button", { name: "Model" });
    cardAction.focus();
    await user.keyboard("{Enter}");
    await user.keyboard(" ");
    expect(select).toHaveBeenCalledTimes(2);

    await user.click(screen.getByRole("link", { name: "Details" }));
    await user.click(screen.getByRole("button", { name: "Host action" }));
    expect(linkAction).toHaveBeenCalledOnce();
    expect(slotAction).toHaveBeenCalledOnce();
    expect(select).toHaveBeenCalledTimes(2);
  });

  it("leaves host checkbox and editable text slots independent of card activation", async () => {
    const user = userEvent.setup();
    const select = vi.fn();
    const toggleCheckbox = vi.fn();
    renderWithProvider(
      <ModelCard
        name="Model"
        onClick={select}
        icon={<div role="checkbox" aria-checked="false" onClick={toggleCheckbox}>Pin model</div>}
        description={<div contentEditable suppressContentEditableWarning>Editable notes</div>}
      />,
    );
    await user.click(screen.getByRole("checkbox", { name: "Pin model" }));
    await user.click(screen.getByText("Editable notes"));
    expect(toggleCheckbox).toHaveBeenCalledOnce();
    expect(select).not.toHaveBeenCalled();
  });

  it("does not interpret an active text selection as a card selection", () => {
    const select = vi.fn();
    renderWithProvider(<ModelCard name="Model" description="Select this description" onClick={select} />);
    const description = screen.getByText("Select this description");
    const range = document.createRange();
    range.selectNodeContents(description);
    const selection = window.getSelection();
    selection?.removeAllRanges();
    fireEvent.pointerDown(description);
    selection?.addRange(range);

    fireEvent.pointerUp(description);
    fireEvent.click(description);
    expect(select).not.toHaveBeenCalled();
    selection?.removeAllRanges();

    fireEvent.pointerDown(description);
    fireEvent.pointerUp(description);
    fireEvent.click(description);
    expect(select).toHaveBeenCalledOnce();
  });

  it("leaves a bare ModelCard without an extra action stop", () => {
    renderWithProvider(<ModelCard name="Static" />);
    expect(screen.getByText("Static")).toBeInTheDocument();
    expect(screen.queryByRole("button")).not.toBeInTheDocument();
  });
});
