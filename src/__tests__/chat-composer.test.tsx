import { fireEvent, render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import { ChatComposer } from "../chat/chat-composer";

describe("ChatComposer IME keyboard handling", () => {
  it("does not send the final IME Enter event identified by legacy keyCode 229", () => {
    const onSend = vi.fn();
    render(<ChatComposer value="draft" onChange={() => {}} onSend={onSend} />);
    const input = screen.getByRole("textbox");

    fireEvent.keyDown(input, { key: "Enter", code: "Enter", keyCode: 229, which: 229, isComposing: false });

    expect(onSend).not.toHaveBeenCalled();
  });

  it("still sends ordinary Enter and leaves Shift+Enter as a newline", () => {
    const onSend = vi.fn();
    render(<ChatComposer value="draft" onChange={() => {}} onSend={onSend} />);
    const input = screen.getByRole("textbox");

    fireEvent.keyDown(input, { key: "Enter", code: "Enter", keyCode: 13, which: 13, isComposing: false });
    fireEvent.keyDown(input, { key: "Enter", code: "Enter", keyCode: 13, which: 13, shiftKey: true, isComposing: false });

    expect(onSend).toHaveBeenCalledOnce();
  });
});
