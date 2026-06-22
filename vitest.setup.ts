import "@testing-library/jest-dom/vitest";

// jsdom does not implement scrollIntoView; stub it so components that call it
// (e.g. CustomSelect highlight-into-view) don't throw during tests.
if (typeof Element !== "undefined" && !Element.prototype.scrollIntoView) {
  Element.prototype.scrollIntoView = () => {};
}

// Radix primitives (Slider, etc.) observe size via ResizeObserver, which jsdom
// does not implement. Provide a no-op so they mount in tests.
if (typeof globalThis.ResizeObserver === "undefined") {
  globalThis.ResizeObserver = class {
    observe() {}
    unobserve() {}
    disconnect() {}
  };
}
