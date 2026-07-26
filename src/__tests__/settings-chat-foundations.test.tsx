import { fireEvent, render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import { SettingsShell } from "../patterns/settings-shell";
import { ChatAttachment } from "../chat/chat-attachment";
import { ChatMessage } from "../chat/chat-message";

describe("settings and chat foundations", () => {
  it("renders grouped settings navigation and reports the selected item", () => {
    const onValueChange = vi.fn();
    render(
      <SettingsShell
        header={<h1>Settings</h1>}
        navigationLabel="Settings sections"
        groups={[
          {
            key: "personal",
            label: "Personal",
            items: [
              { key: "general", label: "General" },
              { key: "memory", label: "Memory" },
            ],
          },
        ]}
        value="general"
        onValueChange={onValueChange}
      >
        <div>Panel</div>
      </SettingsShell>,
    );

    expect(screen.getAllByRole("navigation", { name: "Settings sections" })).toHaveLength(1);
    expect(screen.getAllByRole("button", { name: "General" })[0]).toHaveAttribute("aria-current", "page");
    fireEvent.click(screen.getAllByRole("button", { name: "Memory" })[0]);
    expect(onValueChange).toHaveBeenCalledWith("memory");
    expect(screen.getByRole("combobox", { name: "Settings sections" })).toBeInTheDocument();
  });

  it("exposes real attachment progress without inventing a percentage", () => {
    const { rerender } = render(
      <ChatAttachment name="paper.pdf" meta="Parsing" status="loading" />,
    );
    expect(screen.queryByRole("progressbar")).not.toBeInTheDocument();

    rerender(
      <ChatAttachment name="paper.pdf" meta="Uploading" status="loading" progress={42} />,
    );
    expect(screen.getByRole("progressbar")).toHaveAttribute("aria-valuenow", "42");
  });

  it("supports compact transcript rhythm", () => {
    const { container } = render(
      <ChatMessage role="assistant" density="compact" actions={<button type="button">Copy</button>}>
        Answer
      </ChatMessage>,
    );
    expect(container.firstChild).toHaveClass("py-4");
    expect(container.firstChild).not.toHaveClass("py-6");
    expect(screen.getByRole("button", { name: "Copy" }).parentElement?.parentElement).toHaveClass("h-0");
  });
});
