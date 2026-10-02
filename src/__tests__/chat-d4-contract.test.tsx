import { fireEvent, render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import { ChatAttachment } from "../chat/chat-attachment";
import { ChatComposer } from "../chat/chat-composer";
import { ChatHeader } from "../chat/chat-header";
import { ChatMessage } from "../chat/chat-message";

describe("D4 chat surface composition", () => {
  it("keeps the user turn distinct and preserves explicit message metadata/actions", () => {
    const onCopy = vi.fn();
    render(
      <>
        <ChatMessage role="user">Check the Navbar on mobile.</ChatMessage>
        <ChatMessage
          role="assistant"
          name="YunUI agent"
          timestamp="10:42"
          badges={<span>Route review</span>}
          footer={<span>Host-owned trace</span>}
          actions={<button type="button" onClick={onCopy}>Copy response</button>}
        >
          The mobile route looks ready.
        </ChatMessage>
      </>,
    );

    expect(screen.getByText("Check the Navbar on mobile.").closest('[data-yunui="chat-message"]'))
      .toHaveAttribute("data-role", "user");
    expect(screen.queryByText("You")).not.toBeInTheDocument();
    expect(screen.getByText("YunUI agent")).toBeInTheDocument();
    expect(screen.getByText("10:42")).toBeInTheDocument();
    expect(screen.getByText("Route review")).toBeInTheDocument();
    expect(screen.getByText("Host-owned trace")).toBeInTheDocument();
    fireEvent.click(screen.getByRole("button", { name: "Copy response" }));
    expect(onCopy).toHaveBeenCalledOnce();
  });

  it("keeps header content in the host-provided slots", () => {
    render(
      <ChatHeader
        left={<h1>Release review</h1>}
        status={<span>Working</span>}
        actions={<button type="button">Share</button>}
      />,
    );

    expect(screen.getByRole("heading", { name: "Release review" })).toBeInTheDocument();
    expect(screen.getByText("Working")).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Share" })).toBeInTheDocument();
  });

  it("keeps the docked composer controlled with host toolbar and attachment slots", () => {
    const onSend = vi.fn();
    const onChange = vi.fn();
    const { rerender } = render(
      <ChatComposer
        value=""
        onChange={onChange}
        onSend={onSend}
        placeholder="Message the release agent…"
        labels={{ prompt: "Release message", send: "Send release message" }}
        toolbar={<button type="button">Add a file</button>}
        attachments={<ChatAttachment name="navbar-notes.md" meta="Ready to attach" />}
        modelItems={[]}
      />,
    );

    const input = screen.getByRole("textbox", { name: "Release message" });
    expect(input).toHaveAttribute("placeholder", "Message the release agent…");
    expect(screen.getByRole("button", { name: "Add a file" })).toBeInTheDocument();
    expect(screen.getByText("navbar-notes.md")).toBeInTheDocument();
    fireEvent.change(input, { target: { value: "Review the docs route" } });
    expect(onChange).toHaveBeenCalledWith("Review the docs route");

    rerender(
      <ChatComposer
        value="Review the docs route"
        onChange={onChange}
        onSend={onSend}
        labels={{ prompt: "Release message", send: "Send release message" }}
        toolbar={<button type="button">Add a file</button>}
        modelItems={[]}
      />,
    );
    fireEvent.click(screen.getByRole("button", { name: "Send release message" }));
    expect(onSend).toHaveBeenCalledOnce();
  });
});
