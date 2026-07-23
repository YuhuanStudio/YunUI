import { describe, it, expect } from "vitest";
import { render } from "@testing-library/react";
import {
  ProviderIcon,
  getIconPath,
  getModelDeveloperId,
  getProviderName,
  normalizeProviderId,
} from "../ai";

// Regression guards for the smoke-test crash: icon helpers/components used to
// throw "Cannot read properties of undefined (reading 'toLowerCase')" when given
// an undefined provider (e.g. a model record with no provider yet). They must
// degrade to a fallback instead of crashing the page.
describe("AI icon helpers tolerate missing ids", () => {
  it("pure helpers do not throw on undefined/null", () => {
    expect(normalizeProviderId(undefined)).toBe("");
    expect(normalizeProviderId(null)).toBe("");
    expect(getIconPath(undefined)).toBeNull();
    expect(getProviderName(undefined)).toBe("");
  });

  it("ProviderIcon renders a fallback instead of crashing when provider is missing", () => {
    // @ts-expect-error — intentionally exercising the bad-data runtime path
    expect(() => render(<ProviderIcon />)).not.toThrow();
    expect(() => render(<ProviderIcon provider={undefined as unknown as string} rounded />)).not.toThrow();
  });

  it("still resolves a known provider", () => {
    expect(getIconPath("openai")).toContain("openai");
    expect(getProviderName("openai")).toBe("OpenAI");
  });

  it("resolves model families from provider-qualified ids in one shared helper", () => {
    expect(getModelDeveloperId("gateway/gpt-5.6-luna")).toBe("openai");
    expect(getModelDeveloperId("local/mlx-community/Qwen3-Embedding-4B")).toBe("qwen");
    expect(getModelDeveloperId("provider/model", "Gemini Embedding 2")).toBe("gemini");
    expect(getModelDeveloperId("custom/acme-model")).toBe("acme-model");
  });
});
