import { act, createEvent, fireEvent, render, screen, waitFor } from "@testing-library/react";
import { afterEach, describe, expect, it, vi } from "vitest";
import { YunUIProvider } from "../adapters/context";
import { CodeBlock as ContentCodeBlock, InlineCode } from "../content/code-block";
import { CodeBlock as PatternCodeBlock } from "../patterns/code-block";
import { captureCodeBlockScroll, restoreCodeBlockScroll } from "../lib/code-block";

const originalClipboard = Object.getOwnPropertyDescriptor(navigator, "clipboard");

function setClipboard(writeText: (text: string) => Promise<void>) {
  Object.defineProperty(navigator, "clipboard", {
    configurable: true,
    value: { writeText },
  });
}

afterEach(() => {
  vi.useRealTimers();
  vi.restoreAllMocks();
  if (originalClipboard) Object.defineProperty(navigator, "clipboard", originalClipboard);
  else Reflect.deleteProperty(navigator, "clipboard");
});

function numberedLines(count: number, prefix = "line") {
  return Array.from({ length: count }, (_, index) => `${prefix}-${index + 1}`).join("\n");
}

describe("compact code blocks", () => {
  it("retains the selected tab by id across reorders and selects a valid tab when the active id disappears", () => {
    const first = { id: "first", label: "First", code: "first payload" };
    const second = { id: "second", label: "Second", code: "second payload" };
    const third = { id: "third", label: "Third", code: "third payload" };
    const { container, rerender } = render(<PatternCodeBlock code="fallback" tabs={[first, second, third]} />);

    fireEvent.click(screen.getByRole("button", { name: "Third" }));
    expect(screen.getByRole("button", { name: "Third" })).toHaveAttribute("aria-pressed", "true");
    expect(container.querySelector("pre code")).toHaveTextContent("third payload");

    rerender(<PatternCodeBlock code="fallback" tabs={[third, first, second]} />);
    expect(screen.getByRole("button", { name: "Third" })).toHaveAttribute("aria-pressed", "true");
    expect(container.querySelector("pre code")).toHaveTextContent("third payload");

    rerender(<PatternCodeBlock code="fallback" tabs={[first, second]} />);
    expect(screen.getByRole("button", { name: "First" })).toHaveAttribute("aria-pressed", "true");
    expect(screen.getByRole("button", { name: "Second" })).toHaveAttribute("aria-pressed", "false");
    expect(container.querySelector("pre code")).toHaveTextContent("first payload");
  });

  it.each(["content", "pattern"] as const)("does not announce a stale %s copy after the active payload changes", async (kind) => {
    let resolveWrite!: () => void;
    const writeText = vi.fn(() => new Promise<void>((resolve) => { resolveWrite = resolve; }));
    setClipboard(writeText);

    if (kind === "content") {
      const { rerender } = render(<ContentCodeBlock language="text">first payload</ContentCodeBlock>);
      fireEvent.click(screen.getByRole("button", { name: "Copy full code" }));
      rerender(<ContentCodeBlock language="text">second payload</ContentCodeBlock>);
      await act(async () => {
        resolveWrite();
        await Promise.resolve();
        await Promise.resolve();
      });
    } else {
      render(<PatternCodeBlock code="fallback" tabs={[
        { id: "first", label: "First", code: "first payload" },
        { id: "second", label: "Second", code: "second payload" },
      ]} />);
      fireEvent.click(screen.getByRole("button", { name: "Copy full code" }));
      fireEvent.click(screen.getByRole("button", { name: "Second" }));
      await act(async () => {
        resolveWrite();
        await Promise.resolve();
        await Promise.resolve();
      });
      expect(screen.getByRole("button", { name: "Second" })).toHaveAttribute("aria-pressed", "true");
    }

    expect(screen.getByRole("button", { name: "Copy full code" })).toBeInTheDocument();
    expect(screen.queryByRole("button", { name: "Copied" })).not.toBeInTheDocument();
  });

  it("keeps the newer copy confirmation when an earlier same-payload timer expires", async () => {
    vi.useFakeTimers();
    setClipboard(vi.fn().mockResolvedValue(undefined));
    render(<PatternCodeBlock code="same payload" />);

    await act(async () => {
      fireEvent.click(screen.getByRole("button", { name: "Copy full code" }));
      await Promise.resolve();
      await Promise.resolve();
    });
    expect(screen.getByRole("button", { name: "Copied" })).toBeInTheDocument();

    await act(async () => { vi.advanceTimersByTime(1000); });
    await act(async () => {
      fireEvent.click(screen.getByRole("button", { name: "Copied" }));
      await Promise.resolve();
      await Promise.resolve();
    });

    await act(async () => { vi.advanceTimersByTime(1000); });
    expect(screen.getByRole("button", { name: "Copied" })).toBeInTheDocument();
    await act(async () => { vi.advanceTimersByTime(1000); });
    expect(screen.getByRole("button", { name: "Copy full code" })).toBeInTheDocument();
  });

  it("restores nested scroll positions after disclosure content changes height", () => {
    const scrollable = document.createElement("div");
    const button = document.createElement("button");
    scrollable.append(button);
    document.body.append(scrollable);
    Object.defineProperties(scrollable, {
      scrollHeight: { configurable: true, value: 1000 },
      clientHeight: { configurable: true, value: 200 },
      scrollWidth: { configurable: true, value: 600 },
      clientWidth: { configurable: true, value: 200 },
    });
    scrollable.scrollTop = 84;
    scrollable.scrollLeft = 32;

    const snapshot = captureCodeBlockScroll(button);
    scrollable.scrollTop = 600;
    scrollable.scrollLeft = 200;
    restoreCodeBlockScroll(snapshot);

    expect(scrollable.scrollTop).toBe(84);
    expect(scrollable.scrollLeft).toBe(32);
    scrollable.remove();
  });

  it.each([3, 12, 16])("keeps %i-line Markdown code fully visible", async (count) => {
    const { container } = render(<ContentCodeBlock language="text">{numberedLines(count)}</ContentCodeBlock>);
    await waitFor(() => expect(container.querySelectorAll(".shiki-wrapper .line")).toHaveLength(count));
    expect(screen.queryByRole("button", { name: new RegExp("Show all") })).not.toBeInTheDocument();
  });

  it("formats singular line counts in both headers", async () => {
    const { container } = render(
      <>
        <ContentCodeBlock language="text">only one line</ContentCodeBlock>
        <PatternCodeBlock code="only one line" language="text" />
      </>,
    );
    await waitFor(() => expect(container.querySelector(".shiki-wrapper .line")).not.toBeNull());
    const shikiScroller = container.querySelector(".shiki-wrapper pre");
    expect(shikiScroller).toHaveAttribute("tabindex", "0");
    expect(shikiScroller).toHaveAttribute("aria-label", "Plain Text code, 1 line");
    expect(screen.getAllByText("1 line")).toHaveLength(2);
  });

  it("folds Markdown to eight lines, copies the full source, and restores disclosure focus", async () => {
    const code = numberedLines(20);
    const writeText = vi.fn().mockResolvedValue(undefined);
    const focus = vi.spyOn(HTMLElement.prototype, "focus");
    setClipboard(writeText);
    const { container } = render(<ContentCodeBlock language="typescript" filename="long-example.ts">{code}</ContentCodeBlock>);

    const showAll = screen.getByRole("button", { name: "Show all 20 lines" });
    await waitFor(() => expect(container.querySelectorAll(".shiki-wrapper .line")).toHaveLength(8));
    expect(container.querySelector(".shiki-wrapper .line")?.textContent).toBe("line-1");
    fireEvent.click(screen.getByRole("button", { name: "Copy full code" }));
    await waitFor(() => expect(writeText).toHaveBeenCalledWith(code));
    await waitFor(() => expect(screen.getByRole("button", { name: "Copied" })).toBeInTheDocument());

    showAll.focus();
    focus.mockClear();
    fireEvent.click(showAll);
    await waitFor(() => expect(container.querySelectorAll(".shiki-wrapper .line")).toHaveLength(20));
    const showLess = screen.getByRole("button", { name: "Show less" });
    expect(showLess).toHaveAttribute("aria-expanded", "true");
    const expandedCode = container.querySelector("pre.yunui-code-scroll") as HTMLPreElement | null;
    await waitFor(() => expect(expandedCode).toHaveFocus());
    expect(focus).toHaveBeenLastCalledWith({ preventScroll: true });
    expect(expandedCode).toHaveAccessibleName("TypeScript code, 20 lines");
    const copyButton = screen.getByRole("button", { name: "Copied" });
    expect(copyButton.compareDocumentPosition(expandedCode!) & Node.DOCUMENT_POSITION_FOLLOWING).toBeTruthy();
    expect(expandedCode!.compareDocumentPosition(showLess) & Node.DOCUMENT_POSITION_FOLLOWING).toBeTruthy();
    fireEvent.keyDown(expandedCode!, { key: "Tab", shiftKey: true });
    expect(copyButton).toHaveFocus();
    expandedCode!.focus({ preventScroll: true });
    fireEvent.keyDown(expandedCode!, { key: "Tab" });
    expect(showLess).toHaveFocus();
    fireEvent.click(showLess);
    await waitFor(() => expect(container.querySelectorAll(".shiki-wrapper .line")).toHaveLength(8));
    await waitFor(() => expect(screen.getByRole("button", { name: "Show all 20 lines" })).toHaveFocus());
    expect(focus).toHaveBeenLastCalledWith({ preventScroll: true });
  }, 10000);

  it("keeps Shiki line metadata and the full edit payload across the fold", async () => {
    const code = numberedLines(20, "const value");
    const onEdit = vi.fn();
    const { container } = render(
      <ContentCodeBlock
        language="typescript"
        filename="long-example.ts"
        showLineNumbers
        highlightLines={[17]}
        onEdit={onEdit}
      >
        {code}
      </ContentCodeBlock>,
    );
    await waitFor(() => expect(container.querySelectorAll(".shiki-wrapper .line")).toHaveLength(8));
    expect(container.querySelector(".highlighted-line")).toBeNull();
    fireEvent.click(screen.getByRole("button", { name: "Edit" }));
    expect(onEdit).toHaveBeenCalledWith({ code, language: "typescript", filename: "long-example.ts" });

    fireEvent.click(screen.getByRole("button", { name: "Show all 20 lines" }));
    await waitFor(() => expect(container.querySelectorAll(".shiki-wrapper .line")).toHaveLength(20));
    expect(container.querySelector('.highlighted-line[data-line="17"]')).toBeInTheDocument();
    expect(container.querySelector(".code-with-line-numbers")).toBeInTheDocument();
  }, 10000);

  it("announces clipboard failure and leaves the Copy action available", async () => {
    setClipboard(vi.fn().mockRejectedValue(new DOMException("denied", "NotAllowedError")));
    render(<ContentCodeBlock language="typescript">{numberedLines(2)}</ContentCodeBlock>);
    fireEvent.click(screen.getByRole("button", { name: "Copy full code" }));
    expect(await screen.findByRole("alert")).toHaveTextContent("Clipboard access was denied");
    expect(screen.getByRole("button", { name: "Copy full code" })).toHaveTextContent("Copy");
  });

  it("uses the lightweight tokenizer with the same fold and full selected-tab copy", async () => {
    const first = numberedLines(20, "ts");
    const second = numberedLines(21, "py");
    const writeText = vi.fn().mockResolvedValue(undefined);
    setClipboard(writeText);
    const { container } = render(
      <PatternCodeBlock
        code="fallback"
        tabs={[
          { id: "typescript", label: "TypeScript", language: "typescript", code: first },
          { id: "python", label: "Python", language: "python", code: second },
        ]}
      />,
    );

    expect(container.querySelectorAll(".code-keyword")).toHaveLength(0);
    expect(container.querySelectorAll(".table-cell.select-none")).toHaveLength(0);
    expect(container.querySelectorAll(".table-row")).toHaveLength(8);
    fireEvent.click(screen.getByRole("button", { name: "Python" }));
    expect(screen.getByRole("button", { name: "Python" })).toHaveAttribute("aria-pressed", "true");
    expect(container.querySelectorAll(".table-row")).toHaveLength(8);
    fireEvent.click(screen.getByRole("button", { name: "Copy full code" }));
    await waitFor(() => expect(writeText).toHaveBeenCalledWith(second));
    await waitFor(() => expect(screen.getByRole("button", { name: "Copied" })).toBeInTheDocument());

    const focus = vi.spyOn(HTMLElement.prototype, "focus");
    const showAll = screen.getByRole("button", { name: "Show all 21 lines" });
    showAll.focus();
    focus.mockClear();
    fireEvent.click(showAll);
    expect(container.querySelectorAll(".table-row")).toHaveLength(21);
    expect(container.querySelector("pre[aria-label='python code, 21 lines']")).toHaveFocus();
    expect(focus).toHaveBeenLastCalledWith({ preventScroll: true });
    const showLess = screen.getByRole("button", { name: "Show less" });
    const copyButton = screen.getByRole("button", { name: "Copied" });
    expect(container.querySelector("pre")!.compareDocumentPosition(showLess) & Node.DOCUMENT_POSITION_FOLLOWING).toBeTruthy();
    const codeRegion = container.querySelector("pre[aria-label='python code, 21 lines']") as HTMLPreElement;
    fireEvent.keyDown(codeRegion, { key: "Tab", shiftKey: true });
    expect(copyButton).toHaveFocus();
    codeRegion.focus({ preventScroll: true });
    fireEvent.keyDown(codeRegion, { key: "Tab" });
    expect(showLess).toHaveFocus();
    fireEvent.click(showLess);
    expect(screen.getByRole("button", { name: "Show all 21 lines" })).toHaveFocus();
    expect(focus).toHaveBeenLastCalledWith({ preventScroll: true });
  });

  it("reports failed pattern clipboard access and keeps the selected value intact", async () => {
    setClipboard(vi.fn().mockRejectedValue(new DOMException("denied", "NotAllowedError")));
    const code = numberedLines(3, "go");
    const { container } = render(<PatternCodeBlock code={code} language="go" />);
    fireEvent.click(screen.getByRole("button", { name: "Copy full code" }));
    expect(await screen.findByRole("alert")).toHaveTextContent("Clipboard access was denied");
    expect(container.querySelector("pre code")?.textContent).toContain("go-1");
    expect(screen.getByRole("button", { name: "Copy full code" })).toHaveTextContent("Copy");
  });

  it("bridges expanded pattern Tab to Show less and leaves Shift+Tab native without a copy control", () => {
    const { container, rerender } = render(
      <PatternCodeBlock code={numberedLines(20)} copyable={false} />,
    );
    const showAll = screen.getByRole("button", { name: "Show all 20 lines" });
    fireEvent.click(showAll);
    const pre = container.querySelector("pre") as HTMLPreElement;
    expect(pre).toHaveFocus();

    const shiftTab = createEvent.keyDown(pre, { key: "Tab", shiftKey: true, bubbles: true, cancelable: true });
    fireEvent(pre, shiftTab);
    expect(shiftTab.defaultPrevented).toBe(false);

    const tab = createEvent.keyDown(pre, { key: "Tab", bubbles: true, cancelable: true });
    fireEvent(pre, tab);
    expect(tab.defaultPrevented).toBe(true);
    expect(screen.getByRole("button", { name: "Show less" })).toHaveFocus();
    fireEvent.click(screen.getByRole("button", { name: "Show less" }));

    rerender(
      <PatternCodeBlock
        code="fallback"
        copyable={false}
        tabs={[
          { id: "first", label: "First", code: numberedLines(20) },
          { id: "second", label: "Second", code: numberedLines(21) },
        ]}
      />,
    );
    fireEvent.click(screen.getByRole("button", { name: "Show all 20 lines" }));
    const tabsPre = container.querySelector("pre") as HTMLPreElement;
    const shiftToTab = createEvent.keyDown(tabsPre, { key: "Tab", shiftKey: true, bubbles: true, cancelable: true });
    fireEvent(tabsPre, shiftToTab);
    expect(shiftToTab.defaultPrevented).toBe(true);
    expect(screen.getByRole("button", { name: "Second" })).toHaveFocus();
  });

  it("handles horizontal keys on the actual code viewport and leaves edge keys native", async () => {
    const { container } = render(<ContentCodeBlock language="text">{"a".repeat(120)}</ContentCodeBlock>);
    await waitFor(() => expect(container.querySelector(".shiki-wrapper pre.yunui-code-scroll")).not.toBeNull());
    const pre = container.querySelector(".shiki-wrapper pre.yunui-code-scroll") as HTMLPreElement;
    let scrollLeft = 0;
    Object.defineProperties(pre, {
      scrollWidth: { configurable: true, get: () => 1000 },
      clientWidth: { configurable: true, get: () => 200 },
      scrollLeft: {
        configurable: true,
        get: () => scrollLeft,
        set: (value: number) => { scrollLeft = Math.max(0, Math.min(800, value)); },
      },
    });
    pre.focus();
    const moved = fireEvent.keyDown(pre, { key: "ArrowRight" });
    expect(pre.scrollLeft).toBe(48);
    expect(moved).toBe(false); // fireEvent reports canceled events as false.

    pre.scrollLeft = 800;
    const atEdge = fireEvent.keyDown(pre, { key: "ArrowRight" });
    expect(pre.scrollLeft).toBe(800);
    expect(atEdge).toBe(true);
    expect(pre).toHaveFocus();
  });

  it("keeps legacy single-tab values and empty code intact", () => {
    const { container } = render(
      <PatternCodeBlock
        code="fallback"
        tabs={[{ id: "empty", label: "Empty", code: "" }]}
        showLineNumbers
      />,
    );
    expect(container.querySelector("pre code")?.textContent).toBe("1");
    expect(container.querySelectorAll(".table-row > .table-cell:not(.select-none)")[0]?.textContent).toBe("");
    expect(container.querySelectorAll(".table-cell.select-none")).toHaveLength(1);
  });

  it("accepts host translations for new disclosure labels in both entries", () => {
    const useT = (namespace?: string) => (key: string, vars?: Record<string, unknown>) => {
      if (key === "codeBlock.showAll") {
        return `${namespace === "content" ? "Content" : "Pattern"}: ${vars?.count} lines`;
      }
      return key;
    };
    render(
      <YunUIProvider adapters={{ useT }}>
        <ContentCodeBlock language="text">{numberedLines(17)}</ContentCodeBlock>
        <PatternCodeBlock code={numberedLines(17)} language="text" />
      </YunUIProvider>,
    );
    expect(screen.getByRole("button", { name: "Content: 17 lines" })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Pattern: 17 lines" })).toBeInTheDocument();
  });

  it("keeps InlineCode compact without paragraph-side margins or a border", () => {
    render(<p>Run <InlineCode>pnpm test</InlineCode> before merging.</p>);
    const code = screen.getByText("pnpm test");
    expect(code).toHaveClass("px-[3px]", "wrap-break-word", "bg-(--accent-subtle)");
    expect(code.className).not.toMatch(/\bmx-|\bborder\b/);
  });
});
