import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import { MarkdownRenderer } from "../content/markdown-renderer";

describe("MarkdownRenderer fenced-code metadata", () => {
  it("maps supported fence metadata through MarkdownRenderer into CodeBlock and onCodeEdit", async () => {
    const onCodeEdit = vi.fn();
    const source = [
      "```tsx showLineNumbers {2} filename=verify-navbar.locales.ts",
      "const routes = ['/en', '/zh-CN', '/zh-TW'];",
      "await verifyRoutes(routes);",
      "```",
    ].join("\n");
    const { container } = render(<MarkdownRenderer content={source} onCodeEdit={onCodeEdit} />);

    await waitFor(() => {
      expect(container.querySelectorAll(".highlighted-line")).toHaveLength(1);
      expect(container.querySelectorAll(".code-with-line-numbers code > span[data-line]")).toHaveLength(2);
    });
    expect(container).toHaveTextContent("verify-navbar.locales.ts");

    fireEvent.click(screen.getByRole("button", { name: "Edit" }));
    expect(onCodeEdit).toHaveBeenCalledWith({
      code: "const routes = ['/en', '/zh-CN', '/zh-TW'];\nawait verifyRoutes(routes);",
      language: "tsx",
      filename: "verify-navbar.locales.ts",
    });
  });

  it("bounds huge info-string highlight ranges to the actual fence lines", async () => {
    const { container } = render(
      <MarkdownRenderer content={["```ts showLineNumbers {1-9007199254740991}", "const a = 1;", "const b = 2;", "```"].join("\n")} />,
    );

    await waitFor(() => expect(container.querySelectorAll(".highlighted-line")).toHaveLength(2));
    expect(container.querySelectorAll(".code-with-line-numbers code > span[data-line]")).toHaveLength(2);
  });

  it("keeps filename values as escaped text and ignores unrelated info-string attributes", async () => {
    const onCodeEdit = vi.fn();
    const filename = "</code><img src=x onerror=alert(1)>";
    const source = [
      `\`\`\`ts showLineNumbers {2} filename="${filename}" onclick="alert(2)" style="color:red" data-hack="x"`,
      "const first = 1;",
      "const second = 2;",
      "\`\`\`",
    ].join("\n");
    const { container } = render(<MarkdownRenderer content={source} onCodeEdit={onCodeEdit} />);

    await waitFor(() => expect(container.querySelectorAll(".highlighted-line")).toHaveLength(1));
    expect(container.querySelector("img,script,iframe")).toBeNull();
    expect(container.querySelector("[onclick],[onerror],[data-hack]")).toBeNull();
    expect([...container.querySelectorAll<HTMLElement>("[style]")].some(element => element.getAttribute("style")?.includes("color: red"))).toBe(false);
    expect(container).toHaveTextContent(filename);

    fireEvent.click(screen.getByRole("button", { name: "Edit" }));
    expect(onCodeEdit.mock.calls[0]?.[0]).toMatchObject({ filename, language: "ts" });
  });

  it("ignores unknown and malformed metadata without creating DOM attributes or code options", async () => {
    const source = [
      "```ts onmouseover=alert(1) style=color:red filename=\"bad%GG title=hello {2,999999999999999999999999999}",
      "const first = 1;",
      "const second = 2;",
      "```",
    ].join("\n");
    const { container } = render(<MarkdownRenderer content={source} />);

    await waitFor(() => expect(container.querySelectorAll(".shiki-wrapper .line")).toHaveLength(2));
    expect(container.querySelector(".code-with-line-numbers")).toBeNull();
    expect(container.querySelector(".highlighted-line")).toBeNull();
    expect(container.querySelector("[onmouseover],[title='hello']")).toBeNull();
    expect([...container.querySelectorAll<HTMLElement>("[style]")].some(element => element.getAttribute("style")?.includes("color: red"))).toBe(false);
    expect(container.querySelector(".yunui-code-scroll")?.textContent).not.toContain("bad%GG");
  });

  it("preserves supported Unicode filenames through percent encoding", async () => {
    const filename = "文".repeat(124) + ".tsx";
    const onCodeEdit = vi.fn();
    render(<MarkdownRenderer content={[`\`\`\`tsx filename="${filename}"`, "const a = 1;", "\`\`\`"].join("\n")} onCodeEdit={onCodeEdit} />);
    fireEvent.click(screen.getByRole("button", { name: "Edit" }));
    expect(onCodeEdit).toHaveBeenCalledWith(expect.objectContaining({ filename }));
  });

  it("ignores oversized filename metadata", async () => {
    const oversized = "x".repeat(129);
    const onCodeEdit = vi.fn();
    const { container } = render(
      <MarkdownRenderer content={[`\`\`\`ts filename="${oversized}"`, "const a = 1;", "\`\`\`"].join("\n")} onCodeEdit={onCodeEdit} />,
    );

    await waitFor(() => expect(container.querySelectorAll(".shiki-wrapper .line")).toHaveLength(1));
    expect(container).not.toHaveTextContent(oversized);
    fireEvent.click(screen.getByRole("button", { name: "Edit" }));
    expect(onCodeEdit.mock.calls[0]?.[0]).toMatchObject({ filename: "snippet.ts", language: "ts" });
  });

  it("keeps sanitizer metadata narrowly scoped for raw code HTML", async () => {
    const { container } = render(
      <MarkdownRenderer
        content={'<pre><code class="language-js showLineNumbers {2} filename-raw%20source.js" onclick="alert(1)" style="color:red">const a = 1;\nconst b = 2;</code></pre>'}
      />,
    );

    await waitFor(() => expect(container.querySelectorAll(".highlighted-line")).toHaveLength(1));
    expect(container).toHaveTextContent("raw source.js");
    expect(container.querySelector("[onclick]")).toBeNull();
    expect([...container.querySelectorAll<HTMLElement>("[style]")].some(element => element.getAttribute("style")?.includes("color: red"))).toBe(false);
  });
});
