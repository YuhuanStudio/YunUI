import { describe, expect, it } from "vitest";
import { renderToStaticMarkup } from "react-dom/server";
import { ContextCards } from "../chat/chat-context-cards";
import { StreamingText } from "../chat/chat-streaming-text";
import { SelectionActions } from "../ai/selection-actions";

describe("optional conversation labels while host copy loads", () => {
  it("keeps the source-opening fallback callable and preserves a zero header", () => {
    const html = renderToStaticMarkup(<ContextCards
      chunks={[{ id: "guide", title: "Guide", body: "Host content", source: "Guide.md", badge: "MD", href: "/guide" }]}
      labels={{ openSource: undefined, header: 0 }}
    />);
    expect(html).toContain('aria-label="Open Guide.md"');
    expect(html).toMatch(/<h3[^>]*>0<\/h3>/);
  });
  it("retains named actions and an instruction label for undefined overrides", () => {
    const answer = renderToStaticMarkup(<StreamingText content={[{ text: "Answer" }]} labels={{ actions: undefined, copyAnswer: undefined }} />);
    const selection = renderToStaticMarkup(<SelectionActions selectedText="Passage" labels={{ placeholder: undefined }} />);
    expect(answer).toContain('aria-label="Answer actions"');
    expect(answer).toContain('aria-label="Copy answer"');
    expect(selection).toContain('aria-label="Describe edits"');
  });
});
