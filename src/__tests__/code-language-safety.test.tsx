import { render, screen, waitFor } from "@testing-library/react";
import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it } from "vitest";
import { CodeBlock } from "../content/code-block";
import { MarkdownRenderer } from "../content/markdown-renderer";

describe("untrusted code language identifiers", () => {
  for (const language of ["__proto__", "constructor"]) {
    it(`renders ${language} as an unknown language without prototype lookup`, async () => {
      const source = "const value = '<script>not executable</script>';";
      expect(() => renderToStaticMarkup(<CodeBlock language={language}>{source}</CodeBlock>)).not.toThrow();
      const { container } = render(<CodeBlock language={language}>{source}</CodeBlock>);
      await waitFor(() => expect(container.querySelector(".shiki")).not.toBeNull());
      expect(screen.getByText(language.toUpperCase())).toBeInTheDocument();
      expect(container.querySelector("script")).toBeNull();
      expect(container.querySelector("pre")?.textContent).toBe(source);
    });
  }
  it("keeps a hostile-looking fence language from crashing the whole Markdown reply", () => {
    const content = "Before\n\n```__proto__\nplain code\n```\n\nAfter";
    const html = renderToStaticMarkup(<MarkdownRenderer content={content} />);
    expect(html).toContain("Before");
    expect(html).toContain("After");
    expect(html).toContain("plain code");
  });
});
