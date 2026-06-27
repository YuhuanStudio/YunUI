import { describe, it, expect } from "vitest";
import { render } from "@testing-library/react";
import { YunUIProvider } from "../adapters/context";
import { ProviderIcon } from "../ai/provider-icons";

describe("ProviderIcon — iconBasePath", () => {
  // "jina" has a built-in webp but no monochrome glyph, so it exercises the
  // image/iconBasePath path (brands WITH a glyph render an inline <svg> instead).
  it("resolves built-in icons from the bundled jsDelivr CDN by default", () => {
    const { container } = render(<ProviderIcon provider="jina" />);
    expect(container.querySelector("img")?.getAttribute("src")).toMatch(
      /^https:\/\/cdn\.jsdelivr\.net\/npm\/@yuhuanowo\/yunui@[^/]+\/icons\/providers\//
    );
  });

  it("honors a consumer-configured iconBasePath", () => {
    const { container } = render(
      <YunUIProvider adapters={{ iconBasePath: "/assets/icons" }}>
        <ProviderIcon provider="jina" />
      </YunUIProvider>
    );
    expect(container.querySelector("img")?.getAttribute("src")).toMatch(/^\/assets\/icons\/providers\//);
  });

  it("renders a known brand as an inline monochrome glyph (no baked-bg avatar)", () => {
    const { container } = render(<ProviderIcon provider="openai" />);
    const svg = container.querySelector("svg");
    expect(svg).not.toBeNull();
    // currentColor glyph → no <img> (the colored avatar webp is bypassed).
    expect(container.querySelector("img")).toBeNull();
    expect(svg?.getAttribute("fill")).toBe("currentColor");
  });

  it("passes custom icon URLs through untouched", () => {
    const { container } = render(
      <YunUIProvider adapters={{ iconBasePath: "/assets/icons" }}>
        <ProviderIcon provider="acme" iconUrl="https://cdn.example.com/acme.png" />
      </YunUIProvider>
    );
    expect(container.querySelector("img")?.getAttribute("src")).toBe("https://cdn.example.com/acme.png");
  });
});
