import { afterEach, describe, expect, it, vi } from "vitest";
import { copyToClipboard } from "../lib/clipboard";

afterEach(() => { vi.unstubAllGlobals(); document.body.replaceChildren(); });

describe("clipboard fallback", () => {
  it("cleans up and restores focus when legacy copy throws", async () => {
    const button = document.createElement("button");
    document.body.append(button);
    button.focus();
    vi.stubGlobal("navigator", { clipboard: { writeText: vi.fn().mockRejectedValue(new Error("denied")) } });
    const legacy = vi.fn(() => { throw new Error("unavailable"); });
    Object.defineProperty(document, "execCommand", { configurable: true, value: legacy });
    expect(await copyToClipboard("  raw\n\n")).toBe(false);
    expect(document.querySelector("textarea")).toBeNull();
    expect(document.activeElement).toBe(button);
  });
  it("reports failed legacy copy accurately", async () => {
    vi.stubGlobal("navigator", {});
    Object.defineProperty(document, "execCommand", { configurable: true, value: vi.fn(() => false) });
    expect(await copyToClipboard("source")).toBe(false);
    expect(document.querySelector("textarea")).toBeNull();
  });
});
