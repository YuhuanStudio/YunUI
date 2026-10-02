import { render, screen, waitFor } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { MarkdownRenderer } from "../content/markdown-renderer";

describe("Markdown trust boundary", () => {
  it("removes executable and embedded HTML with unsafe attributes", () => {
    const { container } = render(<MarkdownRenderer content={`
<script>window.attacked = true</script>
<style>body { display: none }</style>
<iframe srcdoc="<script>window.attacked = true</script>"></iframe>
<object data="https://evil.test"></object><embed src="https://evil.test">
<svg onload="window.attacked = true"><foreignObject>attack</foreignObject></svg>
<form action="https://evil.test"><input name="password"></form>
<div style="position:fixed;inset:0" onclick="window.attacked = true" tabindex="1">Safe text</div>
<a href="javascript:alert(1)" onmouseover="alert(1)" target="_blank" rel="opener">Bad URL</a>
<a href="jAva&#x09;script:alert(1)">Obfuscated</a>
<a href="data:text/html,attack">Data</a>
`} />);
    expect(container.querySelector("script,style,iframe,object,embed,svg,form")).toBeNull();
    expect(container.textContent).toContain("Safe text");
    expect(container.querySelector("[style],[onclick],[onmouseover],[onload],[tabindex='1']")).toBeNull();
    for (const anchor of container.querySelectorAll("a")) {
      expect(anchor.getAttribute("href") ?? "").not.toMatch(/javascript|data:/i);
    }
    expect(container.textContent).not.toContain("window.attacked");
  });

  it("filters custom URL transforms after rewriting while retaining safe destinations", () => {
    const { rerender } = render(<MarkdownRenderer content="[Link](https://example.test)" urlTransform={() => "javascript:alert(1)"} />);
    expect(screen.getByText("Link").getAttribute("href") ?? "").not.toContain("javascript:");
    rerender(<MarkdownRenderer content="[Link](https://example.test)" urlTransform={() => "/proxy/link"} />);
    expect(screen.getByRole("link", { name: "Link" })).toHaveAttribute("href", "/proxy/link");
    rerender(<MarkdownRenderer content="[Mail](mailto:hello@example.test)" />);
    expect(screen.getByRole("link", { name: "Mail" })).toHaveAttribute("href", "mailto:hello@example.test");
  });

  it("prefixes raw and generated IDs, preserving heading and footnote navigation", () => {
    const { container } = render(<MarkdownRenderer content={`# Location

[Jump](#location)

<a name="constructor"></a><h2 id="window">Raw heading</h2>

[Raw](#window)

A footnote[^1].

[^1]: A source.
`} />);
    expect(container.querySelector("#location,#window,[name='constructor']")).toBeNull();
    expect(screen.getByRole("heading", { name: /^Location/ })).toHaveAttribute("id", "user-content-location");
    expect(screen.getByRole("link", { name: "Jump" })).toHaveAttribute("href", "#user-content-location");
    expect(screen.getByRole("link", { name: "Raw" })).toHaveAttribute("href", "#user-content-window");
    for (const link of container.querySelectorAll<HTMLAnchorElement>("a[data-footnote-ref],a[data-footnote-backref]")) {
      const href = link.getAttribute("href")!;
      expect(container.querySelector(`[id="${decodeURIComponent(href.slice(1))}"]`)).not.toBeNull();
    }
  });

  it("retains GFM, callouts, math and permitted inline HTML", () => {
    const { container } = render(<MarkdownRenderer content={`| A | B |
| - | - |
| one | two |

- [x] Completed

3. Third item

> [!NOTE]
> **Important** content.

Inline $x^2$, <mark>highlight</mark>, <abbr title="World Wide Web">WWW</abbr>.

<details><summary>More</summary>Details</details>
`} />);
    expect(screen.getByRole("table")).toHaveTextContent("one");
    expect(container.querySelector("input[type='checkbox']")).toBeChecked();
    expect(container.querySelector("ol[start='3']")).toHaveTextContent("Third item");
    expect(container.querySelector(".katex")).not.toBeNull();
    expect(screen.getByText("Important").tagName).toBe("STRONG");
    expect(container.querySelector("mark")).toHaveTextContent("highlight");
    expect(container.querySelector("abbr")).toHaveAttribute("title", "World Wide Web");
    expect(container.querySelector("details summary")).toHaveTextContent("More");
  });

  it("does not allow untrusted TeX to introduce unsafe links", () => {
    const { container } = render(<MarkdownRenderer content={String.raw`$\href{javascript:alert(1)}{click}$`} />);
    expect(container.querySelector("a[href^='javascript:']")).toBeNull();
    expect(container.querySelector("iframe,script")).toBeNull();
  });

  it("bounds line-highlight ranges to actual code lines", async () => {
    const { container } = render(<MarkdownRenderer content={'<pre><code class="language-js showLineNumbers {1-9007199254740991}">const a = 1;\nconst b = 2;</code></pre>'} />);
    await waitFor(() => expect(container.querySelectorAll(".highlighted-line")).toHaveLength(2));
    expect(container.querySelectorAll("span[data-line]")).toHaveLength(2);
  });
});
