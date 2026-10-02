"use client";
// src/lib/merge-labels.ts
function mergeLabels(fallbacks, overrides) {
  const result = { ...fallbacks };
  for (const key of Object.keys(fallbacks)) {
    if (!overrides || !Object.prototype.hasOwnProperty.call(overrides, key)) continue;
    const value = overrides[key];
    if (value !== void 0) result[key] = value;
  }
  return result;
}

export { mergeLabels };
//# sourceMappingURL=chunk-GRUB2GXF.js.map
//# sourceMappingURL=chunk-GRUB2GXF.js.map