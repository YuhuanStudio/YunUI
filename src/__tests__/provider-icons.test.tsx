import { describe, it, expect } from "vitest";
import { render } from "@testing-library/react";
import { YunUIProvider } from "../adapters/context";
import { ProviderIcon } from "../ai/provider-icons";

describe("ProviderIcon — iconBasePath", () => {
  it("resolves built-in icons under /icons by default", () => {
    const { container } = render(<ProviderIcon provider="openai" />);
    expect(container.querySelector("img")?.getAttribute("src")).toMatch(/^\/icons\/providers\//);
  });

  it("honors a consumer-configured iconBasePath", () => {
    const { container } = render(
      <YunUIProvider adapters={{ iconBasePath: "/assets/icons" }}>
        <ProviderIcon provider="openai" />
      </YunUIProvider>
    );
    expect(container.querySelector("img")?.getAttribute("src")).toMatch(/^\/assets\/icons\/providers\//);
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
