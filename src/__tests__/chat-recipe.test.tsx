import { act, render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";
import { YunUIConversation } from "../../agent/recipes/chat";

describe("consumer recipe send acceptance", () => {
  it("retains rejected drafts and does not duplicate pending submissions", async () => {
    let reject!: (error: Error) => void;
    const onSend = vi.fn(() => new Promise<void>((_, fail) => { reject = fail; }));
    const onError = vi.fn();
    render(<YunUIConversation messages={[]} blocks={[]} running={false} onSend={onSend} onSendError={onError} onStop={() => {}} />);
    const user = userEvent.setup();
    const input = screen.getByRole("textbox");
    await user.type(input, "Keep this draft");
    await user.click(screen.getByRole("button", { name: "Send" }));
    expect(screen.getByRole("button", { name: "Send" })).toBeDisabled();
    await user.click(input);
    await user.keyboard("{Enter}");
    expect(onSend).toHaveBeenCalledOnce();
    const error = new Error("Host rejected the request");
    await act(async () => reject(error));
    await waitFor(() => expect(onError).toHaveBeenCalledWith(error));
    expect(input).toHaveValue("Keep this draft");
  });

  it("does not erase edits made while the host accepts an earlier draft", async () => {
    let accept!: () => void;
    const onSend = vi.fn(() => new Promise<void>(resolve => { accept = resolve; }));
    render(<YunUIConversation messages={[]} blocks={[]} running={false} onSend={onSend} onStop={() => {}} />);
    const user = userEvent.setup();
    const input = screen.getByRole("textbox");
    await user.type(input, "First draft");
    await user.click(screen.getByRole("button", { name: "Send" }));
    await user.clear(input);
    await user.type(input, "Next draft");
    await act(async () => accept());
    expect(input).toHaveValue("Next draft");
    expect(onSend).toHaveBeenCalledWith("First draft");
  });
});
