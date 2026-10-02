"use client";
// src/lib/clipboard.ts
async function copyToClipboard(text) {
  try {
    if (typeof navigator !== "undefined" && navigator.clipboard?.writeText) {
      await navigator.clipboard.writeText(text);
      return true;
    }
  } catch {
  }
  let textarea;
  const previousFocus = typeof document !== "undefined" ? document.activeElement : null;
  try {
    textarea = document.createElement("textarea");
    textarea.value = text;
    textarea.setAttribute("readonly", "");
    textarea.style.position = "fixed";
    textarea.style.left = "-9999px";
    document.body.appendChild(textarea);
    textarea.select();
    const ok = document.execCommand("copy");
    return ok;
  } catch {
    return false;
  } finally {
    textarea?.remove();
    if (typeof HTMLElement !== "undefined" && previousFocus instanceof HTMLElement && previousFocus.isConnected) {
      previousFocus.focus({ preventScroll: true });
    }
  }
}

export { copyToClipboard };
//# sourceMappingURL=chunk-P6LU2FWV.js.map
//# sourceMappingURL=chunk-P6LU2FWV.js.map