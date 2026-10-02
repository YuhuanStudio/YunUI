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
    for (const invalid of [Number.NaN, Number.POSITIVE_INFINITY, Number.NEGATIVE_INFINITY]) {
      rerender(<ChatAttachment name="paper.pdf" status="loading" progress={invalid} />);
      expect(screen.queryByRole("progressbar")).not.toBeInTheDocument();
    }
  });

  it("preserves message content and host actions in compact transcripts", () => {
    const onCopy = vi.fn();
    render(
      <ChatMessage role="assistant" density="compact" footer={<span>Host detail</span>} actions={<button type="button" onClick={onCopy}>Copy</button>}>
        Answer
      </ChatMessage>,
    );
    expect(screen.getByText("Answer")).toBeInTheDocument();
    expect(screen.getByText("Host detail")).toBeInTheDocument();
    fireEvent.click(screen.getByRole("button", { name: "Copy" }));
    expect(onCopy).toHaveBeenCalledOnce();
  });
});
