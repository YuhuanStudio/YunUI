import "@testing-library/jest-dom/vitest";

// jsdom does not implement scrollIntoView; stub it so components that call it
// (e.g. CustomSelect highlight-into-view) don't throw during tests.
if (typeof Element !== "undefined" && !Element.prototype.scrollIntoView) {
  Element.prototype.scrollIntoView = () => {};
}
