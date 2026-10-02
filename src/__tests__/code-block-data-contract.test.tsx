import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import { CodeBlock as ContentCodeBlock } from "../content/code-block";
import { CodeBlock as PatternCodeBlock } from "../patterns/code-block";

describe("code block source fidelity", () => {
  it("does not submit a host form when editing or switching code tabs", () => {
    const submit = vi.fn((event: React.FormEvent) => event.preventDefault());
    render(<form onSubmit={submit}>
      <ContentCodeBlock onEdit={vi.fn()}>source</ContentCodeBlock>
      <PatternCodeBlock code="source" tabs={[{ id: "a", label: "Tab A", code: "a" }, { id: "b", label: "Tab B", code: "b" }]} />
    </form>);
    fireEvent.click(screen.getByRole("button", { name: "Edit" }));
    fireEvent.click(screen.getByRole("button", { name: "Tab B" }));
    screen.getAllByRole("button", { name: /Copy/ }).forEach(button => expect(button).toHaveAttribute("type", "button"));
    expect(submit).not.toHaveBeenCalled();
  });
  it("settles into highlighted markup without an explicit highlight-lines prop", async () => {
    const { container } = render(<ContentCodeBlock language="typescript">{"const answer = 42;"}</ContentCodeBlock>);
    await waitFor(() => expect(container.querySelector(".shiki-wrapper .shiki")).not.toBeNull());
    expect(container.querySelector(".shiki-wrapper span[style]")).not.toBeNull();
  });
  it("preserves indentation and blank lines in the editor payload", () => {
    const onEdit = vi.fn();
    const code = "    preserve_indent()\n\n";
    render(<ContentCodeBlock language="python" filename="snippet.py" onEdit={onEdit}>{code}</ContentCodeBlock>);
    fireEvent.click(screen.getByRole("button", { name: "Edit" }));
    expect(onEdit).toHaveBeenCalledWith({ code, language: "python", filename: "snippet.py" });
  });

  it("switches the displayed tab without line numbers and retains intentionally empty code", () => {
    const { container } = render(<PatternCodeBlock code="base fallback" showLineNumbers={false} tabs={[
      { id: "first", label: "First", code: "first tab" },
      { id: "second", label: "Second", code: "second tab" },
      { id: "empty", label: "Empty", code: "" },
    ]} />);
    expect(container.querySelector("pre")?.textContent).toBe("first tab");
    fireEvent.click(screen.getByRole("button", { name: "Second" }));
    expect(container.querySelector("pre")?.textContent).toBe("second tab");
    fireEvent.click(screen.getByRole("button", { name: "Empty" }));
    expect(container.querySelector("pre")?.textContent).toBe("");
  });

  it("keeps tokenizer highlighting independent from the line-number gutter", async () => {
    const code = 'const title = "你好 café 🚀";\nconst unfinished = "quoted text\nconst template = `unfinished';
    const { container, rerender } = render(<PatternCodeBlock code={code} language="typescript" showLineNumbers={false} />);

    await waitFor(() => expect(container.querySelectorAll(".code-keyword")).toHaveLength(3));
    const getCodeText = () => [...container.querySelectorAll(".table-row > .table-cell:last-child")]
      .map(cell => cell.textContent)
      .join("\n");
    expect(getCodeText()).toBe(code);
    expect(container.querySelectorAll(".table-cell.select-none")).toHaveLength(0);
    const tokenCount = container.querySelectorAll(".code-keyword,.code-string").length;

    rerender(<PatternCodeBlock code={code} language="typescript" showLineNumbers />);
    await waitFor(() => expect(container.querySelectorAll(".table-row > .table-cell.select-none")).toHaveLength(3));
    expect(container.querySelectorAll(".code-keyword,.code-string")).toHaveLength(tokenCount);
    expect(getCodeText()).toBe(code);
  });
});
