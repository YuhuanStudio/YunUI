import { act, fireEvent, render, screen, waitFor } from "@testing-library/react";
import { useState } from "react";
import { renderToString } from "react-dom/server";
import { hydrateRoot } from "react-dom/client";
import { afterEach, describe, expect, it, vi } from "vitest";
import { CodeBlock } from "../content/code-block";
import { MarkdownRenderer } from "../content/markdown-renderer";
import { ImageLightbox } from "../content/image-lightbox";
import { useBodyScrollLock } from "../lib/hooks";
import { Dialog, DialogContent, DialogTitle, Modal } from "../primitives/index";
import { YunUIProvider } from "../adapters/context";

afterEach(() => {
  document.documentElement.className = "";
  document.documentElement.removeAttribute("data-theme");
});

describe("content release regressions", () => {
  it("hydrates absolute links without replacing the server subtree", async () => {
    const content = "[External](https://example.com) [Relative](/docs)";
    const container = document.createElement("div");
    container.innerHTML = renderToString(<MarkdownRenderer content={content} />);
    document.body.append(container);
    const original = container.querySelector("a");
    const onRecoverableError = vi.fn();
    let root!: ReturnType<typeof hydrateRoot>;
    await act(async () => {
      root = hydrateRoot(container, <MarkdownRenderer content={content} />, { onRecoverableError });
    });
    expect(onRecoverableError).not.toHaveBeenCalled();
    expect(container.querySelector("a")).toBe(original);
    expect(original).toHaveAttribute("target", "_blank");
    await act(async () => root.unmount());
    container.remove();
  });

  it("compares absolute link origins exactly when the host supplies one", () => {
    render(<MarkdownRenderer linkOrigin="https://example.com" content={
      "[Internal](https://example.com/docs) [Lookalike](https://example.com.evil.test) [Protocol](//other.test)"
    } />);
    expect(screen.getByRole("link", { name: "Internal" })).not.toHaveAttribute("target");
    expect(screen.getByRole("link", { name: "Lookalike" })).toHaveAttribute("target", "_blank");
    expect(screen.getByRole("link", { name: "Protocol" })).toHaveAttribute("target", "_blank");
  });

  it("highlights with the loaded theme and follows true-black and data-theme changes", async () => {
    const { container } = render(<CodeBlock language="typescript">{"const answer = 42;"}</CodeBlock>);
    await waitFor(() => expect(container.querySelector("pre.github-light-default .line span")).not.toBeNull());
    act(() => { document.documentElement.className = "true-black"; });
    await waitFor(() => expect(container.querySelector("pre.github-dark-default .line span")).not.toBeNull());
    act(() => {
      document.documentElement.className = "";
      document.documentElement.setAttribute("data-theme", "dark");
    });
    await waitFor(() => expect(container.querySelector("pre.github-dark-default .line span")).not.toBeNull());
    act(() => { document.documentElement.setAttribute("data-theme", "light"); });
    await waitFor(() => expect(container.querySelector("pre.github-light-default .line span")).not.toBeNull());
  }, 10000);

  it("contains focus, restores the opener and retains an enclosing scroll lock", async () => {
    function Parent() {
      const [open, setOpen] = useState(false);
      useBodyScrollLock(true);
      return <>
        <button type="button" onClick={() => setOpen(true)}>Open diagram</button>
        <ImageLightbox isOpen={open} onClose={() => setOpen(false)} label="Diagram preview"><div>Diagram</div></ImageLightbox>
      </>;
    }
    const { unmount } = render(<Parent />);
    const opener = screen.getByRole("button", { name: "Open diagram" });
    opener.focus();
    fireEvent.click(opener);
    const dialog = await screen.findByRole("dialog", { name: "Diagram preview" });
    expect(dialog).toHaveAttribute("aria-modal", "true");
    const buttons = screen.getAllByRole("button").filter(button => dialog.contains(button));
    buttons.at(-1)!.focus();
    fireEvent.keyDown(buttons.at(-1)!, { key: "Tab" });
    expect(buttons[0]).toHaveFocus();
    fireEvent.keyDown(buttons[0], { key: "Escape" });
    await waitFor(() => expect(screen.queryByRole("dialog", { name: "Diagram preview" })).not.toBeInTheDocument());
    await waitFor(() => expect(opener).toHaveFocus());
    expect(document.body.style.overflow).toBe("hidden");
    unmount();
    expect(document.body.style.overflow).toBe("");
  });

  it("traps focus and closes only the lightbox nested in a Radix dialog", async () => {
    function Parent() {
      const [previewOpen, setPreviewOpen] = useState(false);
      return (
        <Dialog defaultOpen>
          <DialogContent>
            <DialogTitle>Parent dialog</DialogTitle>
            <button type="button" onClick={() => setPreviewOpen(true)}>Open preview</button>
            <ImageLightbox isOpen={previewOpen} onClose={() => setPreviewOpen(false)} label="Inner preview">
              <div>Preview</div>
            </ImageLightbox>
          </DialogContent>
        </Dialog>
      );
    }

    render(<Parent />);
    const opener = screen.getByRole("button", { name: "Open preview" });
    fireEvent.click(opener);

    const inner = await screen.findByRole("dialog", { name: "Inner preview" });
    await waitFor(() => expect(inner.contains(document.activeElement)).toBe(true));

    const buttons = Array.from(inner.querySelectorAll<HTMLButtonElement>("button"));
    buttons.at(-1)!.focus();
    fireEvent.keyDown(buttons.at(-1)!, { key: "Tab" });
    expect(buttons[0]).toHaveFocus();

    fireEvent.keyDown(buttons[0], { key: "Escape" });
    await waitFor(() => expect(screen.queryByRole("dialog", { name: "Inner preview" })).not.toBeInTheDocument());
    expect(screen.getByRole("dialog", { name: "Parent dialog" })).toBeInTheDocument();
    expect(opener).toHaveFocus();
  });

  it("keeps Tab and Escape contained when nested in the custom Modal focus trap", async () => {
    function Parent() {
      const [previewOpen, setPreviewOpen] = useState(false);
      return (
        <YunUIProvider adapters={{ useT: () => (key) => key }}>
          <Modal isOpen onClose={() => {}} title="Custom parent" showCloseButton={false}>
            <button type="button" onClick={() => setPreviewOpen(true)}>Open custom preview</button>
            <ImageLightbox isOpen={previewOpen} onClose={() => setPreviewOpen(false)} label="Custom inner preview">
              <div>Preview</div>
            </ImageLightbox>
          </Modal>
        </YunUIProvider>
      );
    }

    render(<Parent />);
    const opener = screen.getByRole("button", { name: "Open custom preview" });
    opener.focus();
    fireEvent.click(opener);

    const inner = await screen.findByRole("dialog", { name: "Custom inner preview" });
    await waitFor(() => expect(inner.contains(document.activeElement)).toBe(true));
    const buttons = Array.from(inner.querySelectorAll<HTMLButtonElement>("button"));

    buttons.at(-1)!.focus();
    fireEvent.keyDown(buttons.at(-1)!, { key: "Tab" });
    expect(buttons[0]).toHaveFocus();

    fireEvent.keyDown(buttons[0], { key: "Tab", shiftKey: true });
    expect(buttons.at(-1)).toHaveFocus();

    fireEvent.keyDown(buttons.at(-1)!, { key: "Escape" });
    await waitFor(() => expect(screen.queryByRole("dialog", { name: "Custom inner preview" })).not.toBeInTheDocument());
    expect(screen.getByRole("dialog", { name: "Custom parent" })).toBeInTheDocument();
  });
});
