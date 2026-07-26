import { fireEvent, render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import { InlineCitation } from "../content/inline-citation";
import { MarkdownRenderer } from "../content/markdown-renderer";

describe("InlineCitation", () => {
  it("keeps evidence claim-adjacent and delegates source navigation", () => {
    const onOpen = vi.fn();
    render(
      <InlineCitation
        label="Report p.120"
        title="Sustainability report"
        meta="Page 120"
        description="The report states 27,456 GWh."
        onOpen={onOpen}
      />,
    );

    const citation = screen.getByRole("button", {
      name: "Report p.120: Sustainability report, Page 120",
    });
    fireEvent.click(citation);
    expect(onOpen).toHaveBeenCalledOnce();
  });

  it("lets a host replace typed fragment links without replacing ordinary links", () => {
    render(
      <MarkdownRenderer
        content={"A claim [source](#typed-source). [Website](https://example.com)."}
        renderLink={({ href }) =>
          href === "#typed-source" ? <span data-testid="typed-source">Evidence</span> : undefined
        }
      />,
    );

    expect(screen.getByTestId("typed-source")).toHaveTextContent("Evidence");
    expect(screen.getByRole("link", { name: /Website/ })).toHaveAttribute(
      "href",
      "https://example.com",
    );
  });
});
