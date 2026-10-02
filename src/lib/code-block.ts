import type { TranslateFn } from "../adapters/context";

export const CODE_BLOCK_FOLD_THRESHOLD = 16;
export const CODE_BLOCK_PREVIEW_LINES = 8;

export function codeLineCount(code: string): number {
  return code.split("\n").length;
}

export function codeLineCountLabel(count: number): string {
  return count === 1 ? "1 line" : `${count} lines`;
}

export function previewCode(code: string): string {
  return code.split("\n").slice(0, CODE_BLOCK_PREVIEW_LINES).join("\n");
}

/** Use host translations when available, with a visible English fallback. */
export function translateCodeBlockLabel(
  translate: TranslateFn,
  key: string,
  fallback: string,
  vars?: Record<string, unknown>,
): string {
  const translationKey = `codeBlock.${key}`;
  try {
    const value = translate(translationKey, vars);
    if (
      !value ||
      value === translationKey ||
      value.endsWith(`.${translationKey}`)
    ) {
      return fallback;
    }
    return value;
  } catch {
    return fallback;
  }
}

export interface CodeBlockScrollSnapshot {
  elements: Array<{ element: HTMLElement; top: number; left: number }>;
  windowX: number;
  windowY: number;
}

/** Capture only actual scroll containers that can move when a long block changes height. */
export function captureCodeBlockScroll(anchor: HTMLElement | null): CodeBlockScrollSnapshot {
  const elements: CodeBlockScrollSnapshot["elements"] = [];
  for (let element = anchor?.parentElement ?? null; element; element = element.parentElement) {
    if (element.scrollHeight > element.clientHeight + 1 || element.scrollWidth > element.clientWidth + 1) {
      elements.push({ element, top: element.scrollTop, left: element.scrollLeft });
    }
  }
  return {
    elements,
    windowX: typeof window === "undefined" ? 0 : window.scrollX,
    windowY: typeof window === "undefined" ? 0 : window.scrollY,
  };
}

/** Restore the saved reading position after React changes the disclosed block height. */
export function restoreCodeBlockScroll(snapshot: CodeBlockScrollSnapshot): void {
  for (const { element, top, left } of snapshot.elements) {
    if (!element.isConnected) continue;
    if (element.scrollTop !== top) element.scrollTop = top;
    if (element.scrollLeft !== left) element.scrollLeft = left;
  }
  if (
    typeof window !== "undefined" &&
    (window.scrollX !== snapshot.windowX || window.scrollY !== snapshot.windowY)
  ) {
    window.scrollTo(snapshot.windowX, snapshot.windowY);
  }
}

/**
 * Restore again after the browser applies scroll anchoring for the new layout.
 * A focused disclosure can move by many rows when a collapsed block expands;
 * its ancestor may scroll after React's layout effects have already run.
 */
export function scheduleCodeBlockScrollRestore(
  snapshot: CodeBlockScrollSnapshot,
  onRestored?: () => void,
): () => void {
  if (typeof window === "undefined") return () => {};
  const frames: number[] = [];
  frames.push(window.requestAnimationFrame(() => {
    frames.push(window.requestAnimationFrame(() => {
      restoreCodeBlockScroll(snapshot);
      onRestored?.();
    }));
  }));
  return () => frames.forEach((frame) => window.cancelAnimationFrame(frame));
}
